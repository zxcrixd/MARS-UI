package com.mars.launcher.home

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Snackbar
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.mars.launcher.apps.AppDrawerScreen
import com.mars.launcher.settings.SettingsScreen
import com.mars.launcher.ui.components.MarsClock
import com.mars.launcher.ui.components.MarsDock
import com.mars.launcher.ui.components.MarsGridItem
import com.mars.launcher.ui.theme.MarsLauncherTheme
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()

    // Android back button handling
    BackHandler(enabled = uiState.screenMode != LauncherScreenMode.DESKTOP) {
        viewModel.setScreenMode(LauncherScreenMode.DESKTOP)
    }

    MarsLauncherTheme(isAmoled = uiState.isAmoled) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(MarsTheme.colors.background)
        ) {
            AnimatedContent(
                targetState = uiState.screenMode,
                transitionSpec = {
                    if (targetState == LauncherScreenMode.APP_DRAWER) {
                        (slideInVertically { height -> height / 2 } + fadeIn())
                            .togetherWith(fadeOut())
                    } else if (targetState == LauncherScreenMode.SETTINGS) {
                        (slideInVertically { height -> height / 3 } + fadeIn())
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

            // Error notice if launch failed
            uiState.errorMessage?.let { errorMsg ->
                Snackbar(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(16.dp),
                    action = {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Закрыть",
                            tint = MarsTheme.colors.accent,
                            modifier = Modifier.padding(8.dp)
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

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun DesktopView(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .combinedClickable(
                onClick = {},
                onLongClick = { viewModel.toggleDesktopContextMenu(true) }
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Clean At a Glance Clock & Date (One UI / Lawnchair style)
            MarsClock()

            // Desktop App Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(uiState.homeColumns),
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(uiState.desktopApps, key = { it.uniqueId }) { app ->
                    MarsGridItem(
                        app = app,
                        onClick = { viewModel.launchApp(app) },
                        onLongClick = { viewModel.selectAppForOptions(app) },
                        iconShape = uiState.iconShape
                    )
                }
            }

            // Bottom Dock & Search Bar (Pixel / Lawnchair / One UI style)
            MarsDock(
                dockApps = uiState.dockApps,
                onAppClick = { viewModel.launchApp(it) },
                onAppLongClick = { viewModel.selectAppForOptions(it) },
                iconShape = uiState.iconShape,
                showSearchInDock = uiState.showDockSearch,
                onOpenSearch = { viewModel.setScreenMode(LauncherScreenMode.APP_DRAWER) }
            )
        }
    }

    // Long press empty desktop context dialog (One UI style)
    if (uiState.showDesktopContextMenu) {
        Dialog(onDismissRequest = { viewModel.toggleDesktopContextMenu(false) }) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(MarsTheme.colors.surfaceVariant)
                    .padding(18.dp)
            ) {
                Text(
                    text = "Главный экран",
                    fontSize = 16.sp,
                    color = MarsTheme.colors.textPrimary,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0x18FFFFFF))
                        .combinedClickable(onClick = {
                            viewModel.toggleDesktopContextMenu(false)
                            viewModel.setScreenMode(LauncherScreenMode.SETTINGS)
                        })
                        .padding(14.dp)
                ) {
                    Text(
                        text = "Настройки лаунчера",
                        fontSize = 14.sp,
                        color = MarsTheme.colors.textPrimary
                    )
                }
            }
        }
    }
}
