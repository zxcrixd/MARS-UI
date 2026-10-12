package com.mars.launcher.home

import com.mars.launcher.apps.AppInfo
import com.mars.launcher.ui.theme.IconShape

enum class LauncherScreenMode {
    DESKTOP,
    APP_DRAWER,
    SETTINGS
}

data class HomeUiState(
    val allApps: List<AppInfo> = emptyList(),
    val filteredApps: List<AppInfo> = emptyList(),
    val desktopApps: List<AppInfo> = emptyList(),
    val dockApps: List<AppInfo> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
    val screenMode: LauncherScreenMode = LauncherScreenMode.DESKTOP,
    val drawerColumns: Int = 4,
    val homeColumns: Int = 4,
    val iconShape: IconShape = IconShape.SQUIRCLE,
    val showDockSearch: Boolean = true,
    val showClockWidget: Boolean = true,
    val isAmoled: Boolean = false,
    val selectedAppForDialog: AppInfo? = null,
    val showClockWidgetDialog: Boolean = false,
    val showDesktopContextMenu: Boolean = false
)
