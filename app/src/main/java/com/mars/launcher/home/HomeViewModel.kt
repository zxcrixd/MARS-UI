package com.mars.launcher.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.mars.launcher.apps.AppInfo
import com.mars.launcher.apps.AppRepository
import com.mars.launcher.data.LauncherPreferences
import com.mars.launcher.ai.MarsAiBridge
import com.mars.launcher.ui.theme.IconShape
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class HomeViewModel(
    private val appRepository: AppRepository,
    private val preferences: LauncherPreferences,
    private val aiBridge: MarsAiBridge
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        // Observe applications
        viewModelScope.launch {
            combine(
                appRepository.apps,
                appRepository.isLoading,
                appRepository.errorMessage
            ) { apps, loading, error ->
                Triple(apps, loading, error)
            }.collect { (apps, loading, error) ->
                _uiState.update { current ->
                    val filtered = applySearchFilter(apps, current.searchQuery)
                    val favorites = apps.filter { it.isFavorite }
                    val dock = if (favorites.isNotEmpty()) favorites.take(5) else apps.take(5)
                    val desktop = if (favorites.size > 5) favorites.drop(5) else apps.take(8)

                    current.copy(
                        allApps = apps,
                        filteredApps = filtered,
                        desktopApps = desktop,
                        dockApps = dock,
                        isLoading = loading,
                        errorMessage = error
                    )
                }
            }
        }

        // Observe preferences
        viewModelScope.launch {
            preferences.drawerColumnsFlow.collect { cols ->
                _uiState.update { it.copy(drawerColumns = cols) }
            }
        }

        viewModelScope.launch {
            preferences.homeColumnsFlow.collect { cols ->
                _uiState.update { it.copy(homeColumns = cols) }
            }
        }

        viewModelScope.launch {
            preferences.iconShapeFlow.collect { shapeStr ->
                val shape = try {
                    IconShape.valueOf(shapeStr)
                } catch (_: Exception) {
                    IconShape.SQUIRCLE
                }
                _uiState.update { it.copy(iconShape = shape) }
            }
        }

        viewModelScope.launch {
            preferences.showDockSearchFlow.collect { show ->
                _uiState.update { it.copy(showDockSearch = show) }
            }
        }

        viewModelScope.launch {
            preferences.amoledModeFlow.collect { amoled ->
                _uiState.update { it.copy(isAmoled = amoled) }
            }
        }
    }

    fun onSearchQueryChanged(newQuery: String) {
        _uiState.update { current ->
            val filtered = applySearchFilter(current.allApps, newQuery)
            current.copy(
                searchQuery = newQuery,
                filteredApps = filtered,
                screenMode = if (newQuery.isNotEmpty() && current.screenMode == LauncherScreenMode.DESKTOP)
                    LauncherScreenMode.APP_DRAWER
                else current.screenMode
            )
        }
    }

    private fun applySearchFilter(apps: List<AppInfo>, query: String): List<AppInfo> {
        val trimmed = query.trim().lowercase()
        if (trimmed.isEmpty()) return apps
        return apps.filter {
            it.label.lowercase().contains(trimmed) || it.packageName.lowercase().contains(trimmed)
        }
    }

    fun setScreenMode(mode: LauncherScreenMode) {
        _uiState.update { it.copy(screenMode = mode) }
    }

    fun launchApp(app: AppInfo) {
        val result = appRepository.launchApp(app.packageName)
        if (result.isFailure) {
            _uiState.update {
                it.copy(errorMessage = "Не удалось открыть ${app.label}: ${result.exceptionOrNull()?.message}")
            }
        } else {
            // Close app drawer on successful launch
            _uiState.update {
                it.copy(
                    screenMode = LauncherScreenMode.DESKTOP,
                    searchQuery = "",
                    filteredApps = it.allApps,
                    selectedAppForDialog = null
                )
            }
        }
    }

    fun toggleFavorite(app: AppInfo) {
        viewModelScope.launch {
            preferences.toggleFavorite(app.packageName)
        }
    }

    fun openAppDetails(app: AppInfo) {
        appRepository.openAppDetails(app.packageName)
        _uiState.update { it.copy(selectedAppForDialog = null) }
    }

    fun requestUninstall(app: AppInfo) {
        appRepository.requestUninstall(app.packageName)
        _uiState.update { it.copy(selectedAppForDialog = null) }
    }

    fun selectAppForOptions(app: AppInfo?) {
        _uiState.update { it.copy(selectedAppForDialog = app) }
    }

    fun toggleDesktopContextMenu(show: Boolean) {
        _uiState.update { it.copy(showDesktopContextMenu = show) }
    }

    fun refreshApps() {
        appRepository.refreshApps()
    }

    fun clearError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    // Settings mutations
    fun updateDrawerColumns(cols: Int) {
        viewModelScope.launch { preferences.setDrawerColumns(cols) }
    }

    fun updateHomeColumns(cols: Int) {
        viewModelScope.launch { preferences.setHomeColumns(cols) }
    }

    fun updateIconShape(shape: IconShape) {
        viewModelScope.launch { preferences.setIconShape(shape.name) }
    }

    fun updateShowDockSearch(show: Boolean) {
        viewModelScope.launch { preferences.setShowDockSearch(show) }
    }

    fun updateAmoledMode(enabled: Boolean) {
        viewModelScope.launch { preferences.setAmoledMode(enabled) }
    }

    class Factory(
        private val repository: AppRepository,
        private val prefs: LauncherPreferences,
        private val aiBridge: MarsAiBridge
    ) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            return HomeViewModel(repository, prefs, aiBridge) as T
        }
    }
}
