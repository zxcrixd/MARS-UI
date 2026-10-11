package com.mars.launcher.home

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.mars.launcher.apps.AppInfo
import com.mars.launcher.apps.AppRepository
import com.mars.launcher.data.LauncherPreferences
import com.mars.launcher.ai.MarsAiBridge
import com.mars.launcher.ai.MarsCommandResult
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
        // Observe applications and repository loading state
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
                    current.copy(
                        allApps = apps,
                        filteredApps = filtered,
                        favoriteApps = favorites,
                        isLoading = loading,
                        errorMessage = error
                    )
                }
            }
        }

        // Observe user preferences
        viewModelScope.launch {
            preferences.gridColumnsFlow.collect { cols ->
                _uiState.update { it.copy(gridColumns = cols) }
            }
        }
        viewModelScope.launch {
            preferences.themeIntensityFlow.collect { intensity ->
                _uiState.update { it.copy(themeIntensity = intensity) }
            }
        }
        viewModelScope.launch {
            preferences.showClockSecondsFlow.collect { show ->
                _uiState.update { it.copy(showSeconds = show) }
            }
        }
        viewModelScope.launch {
            preferences.martianSolModeFlow.collect { sol ->
                _uiState.update { it.copy(martianSolMode = sol) }
            }
        }
        viewModelScope.launch {
            preferences.showHudTelemetryFlow.collect { hud ->
                _uiState.update { it.copy(showHudTelemetry = hud) }
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
                it.copy(errorMessage = "Could not launch ${app.label}: ${result.exceptionOrNull()?.message}")
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

    fun refreshApps() {
        appRepository.refreshApps()
    }

    fun clearError() {
        _uiState.update { it.copy(errorMessage = null) }
    }

    // Preferences mutations
    fun updateGridColumns(cols: Int) {
        viewModelScope.launch { preferences.setGridColumns(cols) }
    }

    fun updateThemeIntensity(intensity: String) {
        viewModelScope.launch { preferences.setThemeIntensity(intensity) }
    }

    fun updateShowSeconds(show: Boolean) {
        viewModelScope.launch { preferences.setShowClockSeconds(show) }
    }

    fun updateMartianSolMode(enabled: Boolean) {
        viewModelScope.launch { preferences.setMartianSolMode(enabled) }
    }

    fun updateShowHud(enabled: Boolean) {
        viewModelScope.launch { preferences.setShowHudTelemetry(enabled) }
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
