package com.mars.launcher

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
}
