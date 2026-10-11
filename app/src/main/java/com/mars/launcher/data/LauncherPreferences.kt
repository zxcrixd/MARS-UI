package com.mars.launcher.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
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

    val favoritesFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[KEY_FAVORITES] ?: emptySet()
    }

    val gridColumnsFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[KEY_GRID_COLUMNS] ?: 4
    }

    val themeIntensityFlow: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[KEY_THEME_INTENSITY] ?: "BALANCED"
    }

    val showClockSecondsFlow: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_SHOW_SECONDS] ?: true
    }

    val martianSolModeFlow: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_MARTIAN_SOL_MODE] ?: true
    }

    val showHudTelemetryFlow: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_SHOW_HUD] ?: true
    }

    val dockPackagesFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[KEY_DOCK_PACKAGES] ?: emptySet()
    }

    suspend fun toggleFavorite(packageName: String) {
        context.dataStore.edit { preferences ->
            val current = preferences[KEY_FAVORITES]?.toMutableSet() ?: mutableSetOf()
            if (current.contains(packageName)) {
                current.remove(packageName)
            } else {
                current.add(packageName)
            }
            preferences[KEY_FAVORITES] = current
        }
    }

    suspend fun setGridColumns(columns: Int) {
        context.dataStore.edit { preferences ->
            preferences[KEY_GRID_COLUMNS] = columns.coerceIn(3, 6)
        }
    }

    suspend fun setThemeIntensity(intensity: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_THEME_INTENSITY] = intensity
        }
    }

    suspend fun setShowClockSeconds(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_SHOW_SECONDS] = show
        }
    }

    suspend fun setMartianSolMode(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_MARTIAN_SOL_MODE] = enabled
        }
    }

    suspend fun setShowHudTelemetry(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_SHOW_HUD] = show
        }
    }

    suspend fun setDockPackages(packages: Set<String>) {
        context.dataStore.edit { preferences ->
            preferences[KEY_DOCK_PACKAGES] = packages
        }
    }
}
