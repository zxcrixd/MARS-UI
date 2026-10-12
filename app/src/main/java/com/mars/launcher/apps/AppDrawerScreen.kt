package com.mars.launcher.apps

import androidx.compose.foundation.background
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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.mars.launcher.home.HomeUiState
import com.mars.launcher.home.HomeViewModel
import com.mars.launcher.home.LauncherScreenMode
import com.mars.launcher.ui.components.MarsGridItem
import com.mars.launcher.ui.components.MarsSearchBar
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun AppDrawerScreen(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    onCloseDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MarsTheme.colors.background)
            .statusBarsPadding()
    ) {
        // App Drawer Top Search Bar with Direct Settings Button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCloseDrawer) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Назад",
                    tint = MarsTheme.colors.textSecondary
                )
            }

            MarsSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.onSearchQueryChanged(it) },
                placeholderText = "Поиск или MARS AI...",
                modifier = Modifier.weight(1f)
            )

            // Direct Launcher Settings Gear Button
            IconButton(onClick = { viewModel.setScreenMode(LauncherScreenMode.SETTINGS) }) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Настройки",
                    tint = MarsTheme.colors.textSecondary
                )
            }
        }

        // App Grid Content
        Box(
            modifier = Modifier
                .fillMaxSize()
                .weight(1f),
            contentAlignment = Alignment.Center
        ) {
            when {
                uiState.isLoading -> {
                    CircularProgressIndicator(
                        color = MarsTheme.colors.accent,
                        modifier = Modifier.size(36.dp),
                        strokeWidth = 3.dp
                    )
                }
                uiState.filteredApps.isEmpty() -> {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Text(
                            text = "Приложения не найдены",
                            fontFamily = FontFamily.SansSerif,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            color = MarsTheme.colors.textPrimary
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "По запросу «${uiState.searchQuery}» ничего нет",
                            fontSize = 13.sp,
                            color = MarsTheme.colors.textSecondary
                        )
                    }
                }
                else -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(uiState.drawerColumns),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(uiState.filteredApps, key = { it.uniqueId }) { app ->
                            MarsGridItem(
                                app = app,
                                onClick = { viewModel.launchApp(app) },
                                onLongClick = { viewModel.selectAppForOptions(app) },
                                iconShape = uiState.iconShape
                            )
                        }
                    }
                }
            }
        }
    }

    // App Options Dialog (Add to Desktop, Info, Uninstall)
    uiState.selectedAppForDialog?.let { selectedApp ->
        val isOnDesktop = uiState.desktopApps.any { it.packageName == selectedApp.packageName }
        AppOptionsDialog(
            app = selectedApp,
            isOnDesktop = isOnDesktop,
            onDismiss = { viewModel.selectAppForOptions(null) },
            onToggleDesktop = {
                viewModel.toggleDesktopApp(selectedApp)
                viewModel.selectAppForOptions(null)
            },
            onOpenInfo = { viewModel.openAppDetails(selectedApp) },
            onUninstall = { viewModel.requestUninstall(selectedApp) }
        )
    }
}

@Composable
fun AppOptionsDialog(
    app: AppInfo,
    isOnDesktop: Boolean,
    onDismiss: () -> Unit,
    onToggleDesktop: () -> Unit,
    onOpenInfo: () -> Unit,
    onUninstall: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .padding(18.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = app.label,
                        fontFamily = FontFamily.SansSerif,
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = MarsTheme.colors.textPrimary
                    )
                    Text(
                        text = app.packageName,
                        fontFamily = FontFamily.SansSerif,
                        fontSize = 12.sp,
                        color = MarsTheme.colors.textTertiary
                    )
                }
            }

            // Option: Add / Remove from Desktop
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onToggleDesktop() }
                    .padding(vertical = 12.dp, horizontal = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (isOnDesktop) Icons.Default.Remove else Icons.Default.Add,
                    contentDescription = null,
                    tint = MarsTheme.colors.textPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = if (isOnDesktop) "Убрать с главного экрана" else "Добавить на главный экран",
                    color = MarsTheme.colors.textPrimary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 14.dp)
                )
            }

            // Option: App Info
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onOpenInfo() }
                    .padding(vertical = 12.dp, horizontal = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = null,
                    tint = MarsTheme.colors.textPrimary,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "О приложении",
                    color = MarsTheme.colors.textPrimary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 14.dp)
                )
            }

            // Option: Uninstall
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onUninstall() }
                    .padding(vertical = 12.dp, horizontal = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = null,
                    tint = MarsTheme.colors.accent,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "Удалить",
                    color = MarsTheme.colors.accent,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 14.dp)
                )
            }
        }
    }
}
