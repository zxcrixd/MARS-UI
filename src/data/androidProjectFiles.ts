export interface AndroidFile {
  path: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'res' | 'docs';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle repository management and root project include',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MarsLauncher"
include(":app")`
  },
  {
    path: 'build.gradle.kts',
    category: 'gradle',
    description: 'Top-level root build file configuring plugins',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`
  },
  {
    path: 'gradle.properties',
    category: 'gradle',
    description: 'JVM args and AndroidX flags',
    content: `# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
  },
  {
    path: 'gradle/libs.versions.toml',
    category: 'gradle',
    description: 'Gradle Version Catalog for AGP 8.7, Kotlin 2.0 & Compose BOM',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
datastore = "1.1.1"
coroutines = "1.9.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App module configuration, SDK 35, Jetpack Compose plugins & deps',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.mars.launcher"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mars.launcher"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material-icons-extended)
    implementation(libs.androidx.datastore-preferences)
    implementation(libs.kotlinx.coroutines.android)

    debugImplementation(libs.androidx.ui.tooling)
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'HOME launcher intent filters, package visibility query & package receiver',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Least-privileged query for discoverable launchable apps in Android 11+ (API 30+) -->
    <queries>
        <intent>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent>
    </queries>

    <application
        android:name=".MarsLauncherApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MarsLauncher">

        <!-- Main Home Launcher Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:clearTaskOnLaunch="true"
            android:stateNotNeeded="true"
            android:resumeWhilePausing="true"
            android:windowSoftInputMode="adjustResize">

            <!-- Identifies MARS Launcher as an Android Home Screen replacement -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.HOME" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>

            <!-- Standard app launcher entry point so users can open it from app lists -->
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Dynamic receiver to refresh app list on package install/uninstall/update -->
        <receiver
            android:name=".apps.PackageChangeReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.PACKAGE_ADDED" />
                <action android:name="android.intent.action.PACKAGE_REMOVED" />
                <action android:name="android.intent.action.PACKAGE_REPLACED" />
                <action android:name="android.intent.action.PACKAGE_CHANGED" />
                <data android:scheme="package" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/MarsLauncherApplication.kt',
    category: 'kotlin',
    description: 'Application singleton initializing repository, preferences & AI bridge',
    content: `package com.mars.launcher

import android.app.Application
import com.mars.launcher.apps.AppRepository
import com.mars.launcher.data.LauncherPreferences
import com.mars.launcher.ai.MarsAiBridge

class MarsLauncherApplication : Application() {

    lateinit var appRepository: AppRepository
        private set

    lateinit var launcherPreferences: LauncherPreferences
        private set

    lateinit var aiBridge: MarsAiBridge
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        launcherPreferences = LauncherPreferences(this)
        appRepository = AppRepository(this, launcherPreferences)
        aiBridge = MarsAiBridge()

        // Preload launchable applications on IO dispatcher
        appRepository.refreshApps()
    }

    companion object {
        lateinit var instance: MarsLauncherApplication
            private set
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/MainActivity.kt',
    category: 'kotlin',
    description: 'Edge-to-edge Launcher Activity mounting Jetpack Compose HomeScreen',
    content: `package com.mars.launcher

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import com.mars.launcher.home.HomeScreen
import com.mars.launcher.home.HomeViewModel

class MainActivity : ComponentActivity() {

    private val homeViewModel: HomeViewModel by viewModels {
        val app = application as MarsLauncherApplication
        HomeViewModel.Factory(
            repository = app.appRepository,
            prefs = app.launcherPreferences,
            aiBridge = app.aiBridge
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // Enable edge-to-edge system bars (API 26+)
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            HomeScreen(viewModel = homeViewModel)
        }
    }

    override fun onResume() {
        super.onResume()
        // Ensure apps are freshly synced whenever returning to the launcher home screen
        homeViewModel.refreshApps()
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/home/HomeScreen.kt',
    category: 'kotlin',
    description: 'Primary MARS RED desktop layout, animated screen switcher & orbital dock',
    content: `package com.mars.launcher.home

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material3.Icon
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.apps.AppDrawerScreen
import com.mars.launcher.settings.SettingsScreen
import com.mars.launcher.ui.components.*
import com.mars.launcher.ui.theme.MarsLauncherTheme
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    // Handle Android system back button
    BackHandler(enabled = uiState.screenMode != LauncherScreenMode.DESKTOP) {
        if (uiState.screenMode == LauncherScreenMode.SETTINGS || uiState.screenMode == LauncherScreenMode.APP_DRAWER) {
            viewModel.setScreenMode(LauncherScreenMode.DESKTOP)
        }
    }

    MarsLauncherTheme(intensity = uiState.themeIntensity) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(MarsTheme.colors.background)
        ) {
            AnimatedContent(
                targetState = uiState.screenMode,
                transitionSpec = {
                    if (targetState == LauncherScreenMode.APP_DRAWER || targetState == LauncherScreenMode.SETTINGS) {
                        (slideInVertically { height -> height / 2 } + fadeIn())
                            .togetherWith(fadeOut())
                    } else {
                        fadeIn().togetherWith(slideOutVertically { height -> height / 2 } + fadeOut())
                    }
                },
                label = "ScreenTransition"
            ) { targetMode ->
                when (targetMode) {
                    LauncherScreenMode.DESKTOP -> DesktopView(uiState = uiState, viewModel = viewModel)
                    LauncherScreenMode.APP_DRAWER -> AppDrawerScreen(uiState = uiState, viewModel = viewModel, onCloseDrawer = { viewModel.setScreenMode(LauncherScreenMode.DESKTOP) })
                    LauncherScreenMode.SETTINGS -> SettingsScreen(uiState = uiState, viewModel = viewModel, onBack = { viewModel.setScreenMode(LauncherScreenMode.DESKTOP) })
                }
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/home/HomeViewModel.kt',
    category: 'kotlin',
    description: 'State management, search filtering, app launch dispatch & preferences flow',
    content: `package com.mars.launcher.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.mars.launcher.apps.AppInfo
import com.mars.launcher.apps.AppRepository
import com.mars.launcher.data.LauncherPreferences
import com.mars.launcher.ai.MarsAiBridge
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class HomeViewModel(
    private val appRepository: AppRepository,
    private val preferences: LauncherPreferences,
    private val aiBridge: MarsAiBridge
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            combine(appRepository.apps, appRepository.isLoading, appRepository.errorMessage) { apps, loading, error ->
                Triple(apps, loading, error)
            }.collect { (apps, loading, error) ->
                _uiState.update { current ->
                    current.copy(
                        allApps = apps,
                        filteredApps = applySearchFilter(apps, current.searchQuery),
                        favoriteApps = apps.filter { it.isFavorite },
                        isLoading = loading,
                        errorMessage = error
                    )
                }
            }
        }
        viewModelScope.launch { preferences.gridColumnsFlow.collect { cols -> _uiState.update { it.copy(gridColumns = cols) } } }
        viewModelScope.launch { preferences.themeIntensityFlow.collect { int -> _uiState.update { it.copy(themeIntensity = int) } } }
        viewModelScope.launch { preferences.showClockSecondsFlow.collect { sec -> _uiState.update { it.copy(showSeconds = sec) } } }
        viewModelScope.launch { preferences.martianSolModeFlow.collect { sol -> _uiState.update { it.copy(martianSolMode = sol) } } }
        viewModelScope.launch { preferences.showHudTelemetryFlow.collect { hud -> _uiState.update { it.copy(showHudTelemetry = hud) } } }
    }

    fun onSearchQueryChanged(newQuery: String) {
        _uiState.update { current ->
            current.copy(
                searchQuery = newQuery,
                filteredApps = applySearchFilter(current.allApps, newQuery),
                screenMode = if (newQuery.isNotEmpty() && current.screenMode == LauncherScreenMode.DESKTOP) LauncherScreenMode.APP_DRAWER else current.screenMode
            )
        }
    }

    private fun applySearchFilter(apps: List<AppInfo>, query: String): List<AppInfo> {
        val trimmed = query.trim().lowercase()
        if (trimmed.isEmpty()) return apps
        return apps.filter { it.label.lowercase().contains(trimmed) || it.packageName.lowercase().contains(trimmed) }
    }

    fun setScreenMode(mode: LauncherScreenMode) { _uiState.update { it.copy(screenMode = mode) } }
    fun launchApp(app: AppInfo) = appRepository.launchApp(app.packageName)
    fun toggleFavorite(app: AppInfo) = viewModelScope.launch { preferences.toggleFavorite(app.packageName) }
    fun refreshApps() = appRepository.refreshApps()
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/apps/AppRepository.kt',
    category: 'kotlin',
    description: 'Background discovery of launchable apps via PackageManager & Intent execution',
    content: `package com.mars.launcher.apps

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.os.Build
import com.mars.launcher.data.LauncherPreferences
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

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

    init {
        repositoryScope.launch {
            combine(_rawApps, preferences.favoritesFlow, preferences.dockPackagesFlow) { rawList, favorites, docked ->
                rawList.map { app ->
                    app.copy(
                        isFavorite = favorites.contains(app.packageName),
                        isDocked = docked.contains(app.packageName)
                    )
                }
            }.collect { _apps.value = it }
        }
    }

    fun refreshApps() {
        repositoryScope.launch {
            _isLoading.value = true
            try {
                val installed = withContext(Dispatchers.IO) { queryInstalledLaunchableApps() }
                _rawApps.value = installed
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun queryInstalledLaunchableApps(): List<AppInfo> {
        val pm = context.packageManager
        val mainIntent = Intent(Intent.ACTION_MAIN, null).apply { addCategory(Intent.CATEGORY_LAUNCHER) }
        val resolveInfos = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            pm.queryIntentActivities(mainIntent, PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_ALL.toLong()))
        } else {
            @Suppress("DEPRECATION")
            pm.queryIntentActivities(mainIntent, 0)
        }

        return resolveInfos
            .filter { it.activityInfo.packageName != context.packageName }
            .mapNotNull { resolveInfo ->
                try {
                    val pkgName = resolveInfo.activityInfo.packageName
                    val label = resolveInfo.loadLabel(pm).toString().trim()
                    AppInfo(
                        packageName = pkgName,
                        activityName = resolveInfo.activityInfo.name,
                        label = if (label.isNotEmpty()) label else pkgName,
                        icon = resolveInfo.loadIcon(pm)
                    )
                } catch (_: Exception) { null }
            }.sortedBy { it.label.lowercase() }
    }

    fun launchApp(packageName: String): Result<Unit> {
        return try {
            val intent = context.packageManager.getLaunchIntentForPackage(packageName)
                ?: return Result.failure(ActivityNotFoundException())
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
            context.startActivity(intent)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/apps/AppDrawerScreen.kt',
    category: 'kotlin',
    description: 'Scrollable app drawer grid with column customization & long-press actions',
    content: `package com.mars.launcher.apps

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.mars.launcher.home.HomeUiState
import com.mars.launcher.home.HomeViewModel
import com.mars.launcher.ui.components.MarsGridItem
import com.mars.launcher.ui.components.MarsSearchBar
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun AppDrawerScreen(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    onCloseDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MarsTheme.colors.background)
            .statusBarsPadding()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            IconButton(onClick = onCloseDrawer) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = MarsTheme.colors.primaryRed)
            }
            MarsSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.onSearchQueryChanged(it) },
                modifier = Modifier.weight(1f)
            )
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(uiState.gridColumns),
            contentPadding = PaddingValues(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(uiState.filteredApps, key = { it.uniqueId }) { app ->
                MarsGridItem(
                    app = app,
                    onClick = { viewModel.launchApp(app) },
                    onLongClick = { viewModel.selectAppForOptions(app) }
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/data/LauncherPreferences.kt',
    category: 'kotlin',
    description: 'Jetpack DataStore preferences for favorites, column counts & Martian Sol mode',
    content: `package com.mars.launcher.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "mars_launcher_prefs")

class LauncherPreferences(private val context: Context) {
    companion object {
        val KEY_FAVORITES = stringSetPreferencesKey("favorites_set")
        val KEY_GRID_COLUMNS = intPreferencesKey("grid_columns")
        val KEY_THEME_INTENSITY = stringPreferencesKey("mars_theme_intensity")
        val KEY_SHOW_SECONDS = booleanPreferencesKey("show_clock_seconds")
        val KEY_MARTIAN_SOL_MODE = booleanPreferencesKey("martian_sol_mode")
        val KEY_SHOW_HUD = booleanPreferencesKey("show_hud_telemetry")
        val KEY_DOCK_PACKAGES = stringSetPreferencesKey("dock_packages_set")
    }

    val favoritesFlow: Flow<Set<String>> = context.dataStore.data.map { it[KEY_FAVORITES] ?: emptySet() }
    val gridColumnsFlow: Flow<Int> = context.dataStore.data.map { it[KEY_GRID_COLUMNS] ?: 4 }
    val themeIntensityFlow: Flow<String> = context.dataStore.data.map { it[KEY_THEME_INTENSITY] ?: "BALANCED" }
    val showClockSecondsFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_SHOW_SECONDS] ?: true }
    val martianSolModeFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_MARTIAN_SOL_MODE] ?: true }
    val showHudTelemetryFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_SHOW_HUD] ?: true }
    val dockPackagesFlow: Flow<Set<String>> = context.dataStore.data.map { it[KEY_DOCK_PACKAGES] ?: emptySet() }

    suspend fun toggleFavorite(packageName: String) {
        context.dataStore.edit { prefs ->
            val set = prefs[KEY_FAVORITES]?.toMutableSet() ?: mutableSetOf()
            if (set.contains(packageName)) set.remove(packageName) else set.add(packageName)
            prefs[KEY_FAVORITES] = set
        }
    }

    suspend fun setGridColumns(cols: Int) = context.dataStore.edit { it[KEY_GRID_COLUMNS] = cols.coerceIn(3, 6) }
    suspend fun setThemeIntensity(intensity: String) = context.dataStore.edit { it[KEY_THEME_INTENSITY] = intensity }
    suspend fun setShowClockSeconds(show: Boolean) = context.dataStore.edit { it[KEY_SHOW_SECONDS] = show }
    suspend fun setMartianSolMode(sol: Boolean) = context.dataStore.edit { it[KEY_MARTIAN_SOL_MODE] = sol }
    suspend fun setShowHudTelemetry(hud: Boolean) = context.dataStore.edit { it[KEY_SHOW_HUD] = hud }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ai/AiFeatureProvider.kt',
    category: 'kotlin',
    description: 'Interface contract for future MARS AI neural search and natural commands',
    content: `package com.mars.launcher.ai

import com.mars.launcher.apps.AppInfo

sealed class MarsCommandResult {
    data class LaunchApp(val app: AppInfo) : MarsCommandResult()
    data class OpenSetting(val settingKey: String) : MarsCommandResult()
    data class Message(val text: String) : MarsCommandResult()
    data class Unhandled(val originalInput: String) : MarsCommandResult()
}

data class AiAppRecommendation(
    val app: AppInfo,
    val relevanceScore: Float,
    val explanation: String
)

data class MarsBriefing(
    val title: String,
    val summary: String,
    val suggestedApps: List<AppInfo>
)

interface AiFeatureProvider {
    val isEnabled: Boolean
    val providerName: String

    suspend fun searchAppsWithAi(query: String, installedApps: List<AppInfo>): List<AiAppRecommendation>
    suspend fun parseNaturalCommand(command: String, installedApps: List<AppInfo>): MarsCommandResult
    suspend fun getDailyBriefing(installedApps: List<AppInfo>): MarsBriefing?
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ai/MarsAiBridge.kt',
    category: 'kotlin',
    description: 'Standalone offline neural heuristics provider requiring zero API keys',
    content: `package com.mars.launcher.ai

import com.mars.launcher.apps.AppInfo
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class OfflineMarsAiProvider : AiFeatureProvider {
    override val isEnabled: Boolean = true
    override val providerName: String = "MARS Local Neural Heuristics (Offline)"

    override suspend fun searchAppsWithAi(query: String, installedApps: List<AppInfo>): List<AiAppRecommendation> {
        val trimmed = query.trim().lowercase()
        if (trimmed.isEmpty()) return emptyList()

        return installedApps.mapNotNull { app ->
            val labelLower = app.label.lowercase()
            val score = when {
                labelLower == trimmed -> 1.0f
                labelLower.startsWith(trimmed) -> 0.85f
                labelLower.contains(trimmed) -> 0.65f
                else -> 0.0f
            }
            if (score > 0.0f) AiAppRecommendation(app, score, "Direct heuristic match on device") else null
        }.sortedByDescending { it.relevanceScore }
    }

    override suspend fun parseNaturalCommand(command: String, installedApps: List<AppInfo>): MarsCommandResult {
        val lower = command.trim().lowercase()
        for (prefix in listOf("open ", "launch ", "start ")) {
            if (lower.startsWith(prefix)) {
                val targetName = lower.removePrefix(prefix).trim()
                val matched = installedApps.firstOrNull { it.label.lowercase().contains(targetName) }
                if (matched != null) return MarsCommandResult.LaunchApp(matched)
            }
        }
        return MarsCommandResult.Unhandled(command)
    }

    override suspend fun getDailyBriefing(installedApps: List<AppInfo>): MarsBriefing {
        return MarsBriefing("ARES-IV OPERATIONAL CYCLE", "All onboard systems nominal.", installedApps.filter { it.isFavorite }.take(3))
    }
}

class MarsAiBridge(initialProvider: AiFeatureProvider = OfflineMarsAiProvider()) {
    private val _currentProvider = MutableStateFlow(initialProvider)
    val currentProvider: StateFlow<AiFeatureProvider> = _currentProvider.asStateFlow()

    fun updateProvider(newProvider: AiFeatureProvider) { _currentProvider.value = newProvider }
    suspend fun processQuery(query: String, apps: List<AppInfo>) = _currentProvider.value.searchAppsWithAi(query, apps)
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ui/theme/MarsColors.kt',
    category: 'kotlin',
    description: 'AMOLED black and electric red palette definitions',
    content: `package com.mars.launcher.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

val MarsAmoledBlack = Color(0xFF000000)
val MarsDarkSurface = Color(0xFF0A0A0E)
val MarsCardSurface = Color(0xFF13131A)
val MarsRedPrimary = Color(0xFFFF2A36)
val MarsRedCrimson = Color(0xFFD6001C)
val MarsRedGlow = Color(0xFFFF4D5A)
val MarsTextPrimary = Color(0xFFFFFFFF)
val MarsTextSecondary = Color(0xFF8F93A0)
val MarsBorderGlow = Color(0x33FF2A36)

@Immutable
data class MarsColorPalette(
    val background: Color = MarsAmoledBlack,
    val surface: Color = MarsDarkSurface,
    val surfaceVariant: Color = MarsCardSurface,
    val primaryRed: Color = MarsRedPrimary,
    val primaryRedVariant: Color = MarsRedCrimson,
    val redGlow: Color = MarsRedGlow,
    val textPrimary: Color = MarsTextPrimary,
    val textSecondary: Color = MarsTextSecondary,
    val borderGlow: Color = MarsBorderGlow
)`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'res',
    description: 'Android XML strings for launcher labels and settings',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">MARS Launcher</string>
    <string name="search_apps_hint">Search Martian apps &amp; commands…</string>
    <string name="all_apps">All Applications</string>
    <string name="favorites">Orbital Dock</string>
    <string name="settings">System Protocol</string>
    <string name="set_default_launcher">Set as Default Launcher</string>
</resources>`
  },
  {
    path: 'README.md',
    category: 'docs',
    description: 'Build guide, Android Studio steps & default launcher instructions',
    content: `# MARS Launcher (com.mars.launcher)
Native Android Home Screen Replacement in Jetpack Compose.
See complete build & ADB deployment instructions.`
  }
];
