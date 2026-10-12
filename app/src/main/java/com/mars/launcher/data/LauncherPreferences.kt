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
        val KEY_DOCK_PACKAGES = stringSetPreferencesKey("dock_packages_set")
        val KEY_DRAWER_COLUMNS = intPreferencesKey("drawer_columns")
        val KEY_HOME_COLUMNS = intPreferencesKey("home_columns")
        val KEY_ICON_SHAPE = stringPreferencesKey("icon_shape")
        val KEY_SHOW_DOCK_SEARCH = booleanPreferencesKey("show_dock_search")
        val KEY_AMOLED_MODE = booleanPreferencesKey("amoled_mode")
    }

    val favoritesFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[KEY_FAVORITES] ?: emptySet()
    }

    val dockPackagesFlow: Flow<Set<String>> = context.dataStore.data.map { preferences ->
        preferences[KEY_DOCK_PACKAGES] ?: emptySet()
    }

    val drawerColumnsFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[KEY_DRAWER_COLUMNS] ?: 4
    }

    val homeColumnsFlow: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[KEY_HOME_COLUMNS] ?: 4
    }

    val iconShapeFlow: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[KEY_ICON_SHAPE] ?: "SQUIRCLE"
    }

    val showDockSearchFlow: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_SHOW_DOCK_SEARCH] ?: true
    }

    val amoledModeFlow: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[KEY_AMOLED_MODE] ?: false
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

    suspend fun setDrawerColumns(columns: Int) {
        context.dataStore.edit { preferences ->
            preferences[KEY_DRAWER_COLUMNS] = columns.coerceIn(3, 5)
        }
    }

    suspend fun setHomeColumns(columns: Int) {
        context.dataStore.edit { preferences ->
            preferences[KEY_HOME_COLUMNS] = columns.coerceIn(3, 5)
        }
    }

    suspend fun setIconShape(shape: String) {
        context.dataStore.edit { preferences ->
            preferences[KEY_ICON_SHAPE] = shape
        }
    }

    suspend fun setShowDockSearch(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_SHOW_DOCK_SEARCH] = show
        }
    }

    suspend fun setAmoledMode(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[KEY_AMOLED_MODE] = enabled
        }
    }
}
