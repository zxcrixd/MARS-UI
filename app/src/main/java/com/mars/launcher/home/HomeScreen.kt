package com.mars.launcher.home

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
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.apps.AppDrawerScreen
import com.mars.launcher.settings.SettingsScreen
import com.mars.launcher.ui.components.MarsClock
import com.mars.launcher.ui.components.MarsDock
import com.mars.launcher.ui.components.MarsGridItem
import com.mars.launcher.ui.components.MarsHudOverlay
import com.mars.launcher.ui.components.MarsSearchBar
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
                    LauncherScreenMode.DESKTOP -> {
                        DesktopView(
                            uiState = uiState,
                            viewModel = viewModel
                        )
                    }
                    LauncherScreenMode.APP_DRAWER -> {
                        AppDrawerScreen(
                            uiState = uiState,
                            viewModel = viewModel,
                            onCloseDrawer = {
                                viewModel.setScreenMode(LauncherScreenMode.DESKTOP)
                            }
                        )
                    }
                    LauncherScreenMode.SETTINGS -> {
                        SettingsScreen(
                            uiState = uiState,
                            viewModel = viewModel,
                            onBack = {
                                viewModel.setScreenMode(LauncherScreenMode.DESKTOP)
                            }
                        )
                    }
                }
            }

            // Error banner if launch failed
            uiState.errorMessage?.let { errorMsg ->
                Snackbar(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp),
                    action = {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Dismiss",
                            tint = MarsTheme.colors.primaryRed,
                            modifier = Modifier.clickable { viewModel.clearError() }
                        )
                    },
                    containerColor = MarsTheme.colors.surfaceVariant,
                    contentColor = MarsTheme.colors.textPrimary
                ) {
                    Text(text = errorMsg, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
fun DesktopView(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        // Space HUD telemetry overlay
        MarsHudOverlay(showTelemetry = uiState.showHudTelemetry)

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            // Digital Clock and Martian Sol Date
            MarsClock(
                showSeconds = uiState.showSeconds,
                showMartianSol = uiState.martianSolMode
            )

            // Search Bar Trigger
            MarsSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.onSearchQueryChanged(it) },
                placeholderText = "SEARCH OR SCAN APPS // TAP TO EXPAND",
                modifier = Modifier
                    .padding(horizontal = 20.dp, vertical = 12.dp)
                    .clickable {
                        viewModel.setScreenMode(LauncherScreenMode.APP_DRAWER)
                    }
            )

            // Desktop Favorites Shelf
            if (uiState.favoriteApps.isNotEmpty()) {
                Text(
                    text = "PINNED ORBITAL APPS",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = MarsTheme.colors.textSecondary,
                    modifier = Modifier.padding(start = 22.dp, top = 8.dp, bottom = 4.dp)
                )

                LazyVerticalGrid(
                    columns = GridCells.Fixed(uiState.gridColumns),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 4.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(uiState.favoriteApps, key = { it.uniqueId }) { app ->
                        MarsGridItem(
                            app = app,
                            onClick = { viewModel.launchApp(app) },
                            onLongClick = { viewModel.selectAppForOptions(app) }
                        )
                    }
                }
            } else {
                // Empty orbital prompt encouraging user to pin apps
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(horizontal = 24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(MarsTheme.colors.surfaceVariant.copy(alpha = 0.5f))
                            .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(12.dp))
                            .padding(20.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.RocketLaunch,
                            contentDescription = null,
                            tint = MarsTheme.colors.primaryRed,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        Text(
                            text = "NO ORBITAL PINS YET",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = MarsTheme.colors.textPrimary
                        )
                        Text(
                            text = "Tap the app drawer below, long-press any app to pin it directly to your MARS Home Screen.",
                            fontSize = 12.sp,
                            color = MarsTheme.colors.textSecondary,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }

            // Bottom Navigation & Favorites Dock
            MarsDock(
                favoriteApps = uiState.favoriteApps,
                isDrawerOpen = uiState.screenMode == LauncherScreenMode.APP_DRAWER,
                onToggleDrawer = {
                    viewModel.setScreenMode(LauncherScreenMode.APP_DRAWER)
                },
                onOpenSettings = {
                    viewModel.setScreenMode(LauncherScreenMode.SETTINGS)
                },
                onAppClick = { viewModel.launchApp(it) },
                onAppLongClick = { viewModel.selectAppForOptions(it) }
            )
        }
    }
}
