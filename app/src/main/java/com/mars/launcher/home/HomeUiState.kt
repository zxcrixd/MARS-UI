package com.mars.launcher.home

import com.mars.launcher.apps.AppInfo

enum class LauncherScreenMode {
    DESKTOP,
    APP_DRAWER,
    SETTINGS
}

data class HomeUiState(
    val allApps: List<AppInfo> = emptyList(),
    val filteredApps: List<AppInfo> = emptyList(),
    val favoriteApps: List<AppInfo> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val screenMode: LauncherScreenMode = LauncherScreenMode.DESKTOP,
    val gridColumns: Int = 4,
    val themeIntensity: String = "BALANCED",
    val showSeconds: Boolean = true,
    val martianSolMode: Boolean = true,
    val showHudTelemetry: Boolean = true,
    val selectedAppForDialog: AppInfo? = null
)
