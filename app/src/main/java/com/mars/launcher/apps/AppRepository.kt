package com.mars.launcher.apps

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.mars.launcher.data.LauncherPreferences
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AppRepository(
    private val context: Context,
    private val preferences: LauncherPreferences
) {
    private val repositoryScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _rawApps = MutableStateFlow<List<AppInfo>>(emptyList())
    private val _apps = MutableStateFlow<List<AppInfo>>(emptyList())
    val apps: StateFlow<List<AppInfo>> = _apps.asStateFlow()

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()

    init {
        // Observe preferences and re-merge favorites & docked state
        repositoryScope.launch {
            combine(
                _rawApps,
                preferences.favoritesFlow,
                preferences.dockPackagesFlow
            ) { rawList, favorites, docked ->
                rawList.map { app ->
                    app.copy(
                        isFavorite = favorites.contains(app.packageName),
                        isDocked = docked.contains(app.packageName)
                    )
                }
            }.collect { mergedList ->
                _apps.value = mergedList
            }
        }
    }

    /**
     * Scans for all installed applications that have a launchable MAIN/LAUNCHER activity.
     * Runs strictly off the main thread.
     */
    fun refreshApps() {
        repositoryScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            try {
                val installed = withContext(Dispatchers.IO) {
                    queryInstalledLaunchableApps()
                }
                _rawApps.value = installed
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load apps: ${e.localizedMessage}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun queryInstalledLaunchableApps(): List<AppInfo> {
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }

        val resolveInfos: List<ResolveInfo> = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            pm.queryIntentActivities(
                mainIntent,
                PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_ALL.toLong())
            )
        } else {
            @Suppress("DEPRECATION")
            pm.queryIntentActivities(mainIntent, 0)
        }

        val ourPackage = context.packageName

        return resolveInfos
            .filter { resolveInfo ->
                // Do not display MARS Launcher inside its own app list as a duplicate loop
                resolveInfo.activityInfo.packageName != ourPackage
            }
            .mapNotNull { resolveInfo ->
                try {
                    val pkgName = resolveInfo.activityInfo.packageName
                    val actName = resolveInfo.activityInfo.name
                    val label = resolveInfo.loadLabel(pm).toString().trim()
                    val icon = resolveInfo.loadIcon(pm)
                    val pkgInfo = try {
                        pm.getPackageInfo(pkgName, 0)
                    } catch (e: Exception) {
                        null
                    }
                    val installTime = pkgInfo?.firstInstallTime ?: 0L

                    AppInfo(
                        packageName = pkgName,
                        activityName = actName,
                        label = if (label.isNotEmpty()) label else pkgName,
                        icon = icon,
                        installTime = installTime
                    )
                } catch (e: Exception) {
                    null
                }
            }
            .sortedBy { it.label.lowercase() }
    }

    /**
     * Launches an application with FLAG_ACTIVITY_NEW_TASK.
     */
    fun launchApp(packageName: String): Result<Unit> {
        return try {
            val pm = context.packageManager
            val launchIntent = pm.getLaunchIntentForPackage(packageName)
                ?: return Result.failure(ActivityNotFoundException("No launch intent found for $packageName"))

            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
            context.startActivity(launchIntent)
            Result.success(Unit)
        } catch (e: ActivityNotFoundException) {
            Result.failure(e)
        } catch (e: SecurityException) {
            Result.failure(e)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Opens system Application Details settings for an app (e.g. from long-press).
     */
    fun openAppDetails(packageName: String) {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.parse("package:$packageName")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            // Fallback to generic settings
            val intent = Intent(Settings.ACTION_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        }
    }

    /**
     * Uninstalls an application via standard Android system prompt.
     */
    fun requestUninstall(packageName: String) {
        try {
            val intent = Intent(Intent.ACTION_DELETE).apply {
                data = Uri.parse("package:$packageName")
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (_: Exception) {}
    }
}
