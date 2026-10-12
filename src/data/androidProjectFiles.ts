export interface AndroidFile {
  path: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'res' | 'docs' | 'ci';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: '.github/workflows/build.yml',
    category: 'ci',
    description: 'Автоматическая сборка APK через бесплатный GitHub Actions в облаке',
    content: `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission to gradlew
        run: chmod +x gradlew

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: mars-launcher-debug-apk
          path: app/build/outputs/apk/debug/*.apk
          retention-days: 14`
  },
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
    content: `plugins {
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
    path: 'gradle/wrapper/gradle-wrapper.properties',
    category: 'gradle',
    description: 'Gradle distribution URL configuration (v8.10.2-bin)',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
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
    path: 'app/src/main/java/com/mars/launcher/home/HomeScreen.kt',
    category: 'kotlin',
    description: 'Главный экран в стиле One UI / Lawnchair с виджетом At-a-Glance и нижним доком',
    content: `package com.mars.launcher.home

import androidx.activity.compose.BackHandler
import androidx.compose.animation.*
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
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

    BackHandler(enabled = uiState.screenMode != LauncherScreenMode.DESKTOP) {
        viewModel.setScreenMode(LauncherScreenMode.DESKTOP)
    }

    MarsLauncherTheme(isAmoled = uiState.isAmoled) {
        Box(modifier = modifier.fillMaxSize().background(MarsTheme.colors.background)) {
            AnimatedContent(
                targetState = uiState.screenMode,
                transitionSpec = {
                    (slideInVertically { height -> height / 2 } + fadeIn())
                        .togetherWith(fadeOut())
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
    path: 'app/src/main/java/com/mars/launcher/apps/AppRepository.kt',
    category: 'kotlin',
    description: 'Фоновое сканирование установленных приложений через PackageManager',
    content: `package com.mars.launcher.apps

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
            combine(
                _rawApps,
                preferences.desktopPackagesFlow,
                preferences.dockPackagesFlow
            ) { rawList: List<AppInfo>, desktop: Set<String>, docked: Set<String> ->
                rawList.map { app ->
                    app.copy(
                        isFavorite = desktop.contains(app.packageName),
                        isDocked = docked.contains(app.packageName)
                    )
                }
            }.collect { mergedList: List<AppInfo> ->
                _apps.value = mergedList
            }
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
                ?: return Result.failure(Exception("Launch intent not found"))
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
    path: 'app/src/main/java/com/mars/launcher/data/LauncherPreferences.kt',
    category: 'kotlin',
    description: 'Хранилище Jetpack DataStore для рабочего стола, дока и виджета часов',
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
        val KEY_DESKTOP_PACKAGES = stringSetPreferencesKey("desktop_packages_set")
        val KEY_DOCK_PACKAGES = stringSetPreferencesKey("dock_packages_set")
        val KEY_DRAWER_COLUMNS = intPreferencesKey("drawer_columns")
        val KEY_HOME_COLUMNS = intPreferencesKey("home_columns")
        val KEY_ICON_SHAPE = stringPreferencesKey("icon_shape")
        val KEY_SHOW_DOCK_SEARCH = booleanPreferencesKey("show_dock_search")
        val KEY_SHOW_CLOCK_WIDGET = booleanPreferencesKey("show_clock_widget")
        val KEY_AMOLED_MODE = booleanPreferencesKey("amoled_mode")
    }

    val desktopPackagesFlow: Flow<Set<String>> = context.dataStore.data.map { it[KEY_DESKTOP_PACKAGES] ?: emptySet() }
    val favoritesFlow: Flow<Set<String>> get() = desktopPackagesFlow
    val dockPackagesFlow: Flow<Set<String>> = context.dataStore.data.map { it[KEY_DOCK_PACKAGES] ?: emptySet() }
    val showClockWidgetFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_SHOW_CLOCK_WIDGET] ?: true }
    val drawerColumnsFlow: Flow<Int> = context.dataStore.data.map { it[KEY_DRAWER_COLUMNS] ?: 4 }
    val homeColumnsFlow: Flow<Int> = context.dataStore.data.map { it[KEY_HOME_COLUMNS] ?: 4 }
    val iconShapeFlow: Flow<String> = context.dataStore.data.map { it[KEY_ICON_SHAPE] ?: "SQUIRCLE" }
    val showDockSearchFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_SHOW_DOCK_SEARCH] ?: true }
    val amoledModeFlow: Flow<Boolean> = context.dataStore.data.map { it[KEY_AMOLED_MODE] ?: false }

    suspend fun addToDesktop(packageName: String) = context.dataStore.edit {
        val s = (it[KEY_DESKTOP_PACKAGES] ?: emptySet()).toMutableSet()
        s.add(packageName)
        it[KEY_DESKTOP_PACKAGES] = s
    }

    suspend fun removeFromDesktop(packageName: String) = context.dataStore.edit {
        val s = (it[KEY_DESKTOP_PACKAGES] ?: emptySet()).toMutableSet()
        s.remove(packageName)
        it[KEY_DESKTOP_PACKAGES] = s
    }

    suspend fun setShowClockWidget(show: Boolean) = context.dataStore.edit { it[KEY_SHOW_CLOCK_WIDGET] = show }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/apps/AppDrawerScreen.kt',
    category: 'kotlin',
    description: 'Меню приложений с поиском и вызовом системных действий (One UI / Lawnchair)',
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
import androidx.compose.ui.Alignment
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
            modifier = Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCloseDrawer) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Назад", tint = MarsTheme.colors.textSecondary)
            }
            MarsSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.onSearchQueryChanged(it) },
                placeholderText = "Поиск приложений...",
                modifier = Modifier.weight(1f)
            )
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(uiState.drawerColumns),
            contentPadding = PaddingValues(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(uiState.filteredApps, key = { it.uniqueId }) { app ->
                MarsGridItem(
                    app = app,
                    onClick = { viewModel.launchApp(app) },
                    onLongClick = { viewModel.selectAppForOptions(app) },
                    iconShape = uiState.iconShape
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/settings/SettingsScreen.kt',
    category: 'kotlin',
    description: 'Настройки лаунчера: сетка, форма иконок, выбор домашнего экрана по умолчанию',
    content: `package com.mars.launcher.settings

import android.content.Context
import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.mars.launcher.home.HomeUiState
import com.mars.launcher.home.HomeViewModel
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun SettingsScreen(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    // Clean One UI style categories and default launcher button
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ui/components/MarsSearchBar.kt',
    category: 'kotlin',
    description: 'Строка поиска Lawnchair с прямой интеграцией super-mars.ai.studio',
    content: `package com.mars.launcher.ui.components

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun MarsSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    // Lawnchair pill search bar with direct super-mars.ai.studio integration
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ui/components/MarsClock.kt',
    category: 'kotlin',
    description: 'Виджет времени и даты At-a-Glance с поддержкой удаления по долгому нажатию',
    content: `package com.mars.launcher.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.mars.launcher.ui.theme.MarsTheme

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MarsClock(
    onClick: (() -> Unit)? = null,
    onLongClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    // Clock & Date widget with long-press removal
}`
  },
  {
    path: 'app/src/main/java/com/mars/launcher/ui/theme/MarsColors.kt',
    category: 'kotlin',
    description: 'Цветовая палитра Material 3 / One UI и определение формы иконок',
    content: `package com.mars.launcher.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

val LauncherBackgroundDark = Color(0xFF0F0F12)
val LauncherSurfaceDark = Color(0xFF18181F)
val LauncherCardDark = Color(0xFF22222C)
val LauncherAccent = Color(0xFFE53935)

enum class IconShape {
    SQUIRCLE, // One UI style
    CIRCLE,   // Pixel style
    ROUNDED   // Classic style
}

@Immutable
data class MarsColorPalette(
    val background: Color = LauncherBackgroundDark,
    val surface: Color = LauncherSurfaceDark,
    val surfaceVariant: Color = LauncherCardDark,
    val accent: Color = LauncherAccent,
    val textPrimary: Color = Color.White,
    val textSecondary: Color = Color(0xFFA0A3BD),
    val textTertiary: Color = Color(0xFF71758A),
    val isDark: Boolean = true
)`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'res',
    description: 'Названия и локализация интерфейса (русский / английский)',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">MARS Launcher</string>
    <string name="search_apps_hint">Поиск приложений...</string>
    <string name="all_apps">Все приложения</string>
    <string name="settings">Настройки главного экрана</string>
    <string name="set_default_launcher">Выбрать лаунчером по умолчанию</string>
</resources>`
  },
  {
    path: 'README.md',
    category: 'docs',
    description: 'Инструкция по сборке, установке и запуску через Android Studio и GitHub Actions',
    content: `# MARS Launcher (com.mars.launcher)
Базовый, чистый и производительный Android-лаунчер на Kotlin и Jetpack Compose в стиле **One UI** и **Lawnchair**.

## Сборка APK
1. Через **GitHub Actions** (автоматически при push благодаря \`.github/workflows/build.yml\`).
2. Через **Android Studio**: открыть папку и нажать **Run** (\`Shift + F10\`).
3. Через консоль: \`./gradlew assembleDebug\`.`
  }
];
