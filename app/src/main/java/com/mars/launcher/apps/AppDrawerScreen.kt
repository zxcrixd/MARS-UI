package com.mars.launcher.apps

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
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
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
        // App Drawer Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onCloseDrawer) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = MarsTheme.colors.primaryRed
                )
            }

            MarsSearchBar(
                query = uiState.searchQuery,
                onQueryChange = { viewModel.onSearchQueryChanged(it) },
                modifier = Modifier.weight(1f)
            )
        }

        // Subheader count
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "INDEXED APPS: ${uiState.filteredApps.size}",
                fontFamily = FontFamily.Monospace,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = MarsTheme.colors.textSecondary
            )
            Text(
                text = "GRID // ${uiState.gridColumns}X",
                fontFamily = FontFamily.Monospace,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MarsTheme.colors.primaryRed
            )
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
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        CircularProgressIndicator(
                            color = MarsTheme.colors.primaryRed,
                            modifier = Modifier.size(36.dp),
                            strokeWidth = 3.dp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "SCANNING FIRMWARE PACKAGES...",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            color = MarsTheme.colors.textSecondary
                        )
                    }
                }
                uiState.filteredApps.isEmpty() -> {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier.padding(24.dp)
                    ) {
                        Text(
                            text = "NO MATCHING PACKAGES",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = MarsTheme.colors.primaryRed
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "No applications match query '${uiState.searchQuery}'",
                            fontSize = 13.sp,
                            color = MarsTheme.colors.textSecondary
                        )
                    }
                }
                else -> {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(uiState.gridColumns),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        items(uiState.filteredApps, key = { it.uniqueId }) { app ->
                            MarsGridItem(
                                app = app,
                                onClick = { viewModel.launchApp(app) },
                                onLongClick = { viewModel.selectAppForOptions(app) }
                            )
                        }
                    }
                }
            }
        }
    }

    // Long press options dialog
    uiState.selectedAppForDialog?.let { selectedApp ->
        AppOptionsDialog(
            app = selectedApp,
            onDismiss = { viewModel.selectAppForOptions(null) },
            onToggleFavorite = {
                viewModel.toggleFavorite(selectedApp)
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
    onDismiss: () -> Unit,
    onToggleFavorite: () -> Unit,
    onOpenInfo: () -> Unit,
    onUninstall: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(16.dp))
                .padding(20.dp)
        ) {
            Text(
                text = app.label,
                fontFamily = FontFamily.SansSerif,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MarsTheme.colors.textPrimary
            )
            Text(
                text = app.packageName,
                fontFamily = FontFamily.Monospace,
                fontSize = 11.sp,
                color = MarsTheme.colors.textSecondary,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Option 1: Favorite Toggle
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onToggleFavorite() }
                    .padding(vertical = 12.dp, horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (app.isFavorite) Icons.Default.Star else Icons.Outlined.StarBorder,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = if (app.isFavorite) "Remove from Orbital Dock" else "Pin to Orbital Dock",
                    color = MarsTheme.colors.textPrimary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }

            // Option 2: App Details Info
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onOpenInfo() }
                    .padding(vertical = 12.dp, horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = null,
                    tint = MarsTheme.colors.textSecondary,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "App Info / Permissions",
                    color = MarsTheme.colors.textPrimary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }

            // Option 3: Uninstall
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onUninstall() }
                    .padding(vertical = 12.dp, horizontal = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed,
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "Uninstall Application",
                    color = MarsTheme.colors.primaryRed,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }
        }
    }
}
