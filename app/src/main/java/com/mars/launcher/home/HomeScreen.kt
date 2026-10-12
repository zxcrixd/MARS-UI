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
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.GridOn
import androidx.compose.material.icons.filled.Schedule
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
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
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

            // Error notice
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
                            modifier = Modifier.padding(8.dp).clickable { viewModel.clearError() }
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
            Spacer(modifier = Modifier.height(12.dp))

            // Removable At a Glance Clock Widget
            if (uiState.showClockWidget) {
                MarsClock(
                    onClick = null,
                    onLongClick = { viewModel.toggleClockWidgetDialog(true) }
                )
            } else {
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Desktop App Grid (User-Curated Desktop Apps!)
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

            // Bottom Dock & Search Pill with super-mars.ai.studio
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

    // Long press Clock Widget Context Dialog
    if (uiState.showClockWidgetDialog) {
        Dialog(onDismissRequest = { viewModel.toggleClockWidgetDialog(false) }) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(MarsTheme.colors.surfaceVariant)
                    .padding(18.dp)
            ) {
                Text(
                    text = "Виджет часов и даты",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MarsTheme.colors.textPrimary,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable {
                            viewModel.setShowClockWidget(false)
                            viewModel.toggleClockWidgetDialog(false)
                        }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = null,
                        tint = MarsTheme.colors.accent,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "Удалить виджет с экрана",
                        color = MarsTheme.colors.accent,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(start = 12.dp)
                    )
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable {
                            viewModel.toggleClockWidgetDialog(false)
                            viewModel.setScreenMode(LauncherScreenMode.SETTINGS)
                        }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = null,
                        tint = MarsTheme.colors.textPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "Настройки виджетов и темы",
                        color = MarsTheme.colors.textPrimary,
                        fontSize = 14.sp,
                        modifier = Modifier.padding(start = 12.dp)
                    )
                }
            }
        }
    }

    // Long press Empty Space Context Menu (Lawnchair style)
    if (uiState.showDesktopContextMenu) {
        Dialog(onDismissRequest = { viewModel.toggleDesktopContextMenu(false) }) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(22.dp))
                    .background(MarsTheme.colors.surfaceVariant)
                    .padding(18.dp)
            ) {
                Text(
                    text = "Главный экран MARS",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MarsTheme.colors.textPrimary,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                // Option: Settings
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable {
                            viewModel.toggleDesktopContextMenu(false)
                            viewModel.setScreenMode(LauncherScreenMode.SETTINGS)
                        }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = null,
                        tint = MarsTheme.colors.accent,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "Настройки лаунчера",
                        fontSize = 14.sp,
                        color = MarsTheme.colors.textPrimary,
                        modifier = Modifier.padding(start = 12.dp)
                    )
                }

                // Option: Re-add clock widget if hidden
                if (!uiState.showClockWidget) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                viewModel.setShowClockWidget(true)
                                viewModel.toggleDesktopContextMenu(false)
                            }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = null,
                            tint = MarsTheme.colors.textPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "Добавить виджет часов и даты",
                            fontSize = 14.sp,
                            color = MarsTheme.colors.textPrimary,
                            modifier = Modifier.padding(start = 12.dp)
                        )
                    }
                }

                // Option: All apps
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable {
                            viewModel.toggleDesktopContextMenu(false)
                            viewModel.setScreenMode(LauncherScreenMode.APP_DRAWER)
                        }
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.GridOn,
                        contentDescription = null,
                        tint = MarsTheme.colors.textPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = "Меню приложений",
                        fontSize = 14.sp,
                        color = MarsTheme.colors.textPrimary,
                        modifier = Modifier.padding(start = 12.dp)
                    )
                }
            }
        }
    }
}
