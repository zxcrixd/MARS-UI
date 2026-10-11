package com.mars.launcher.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Apps
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.mars.launcher.apps.AppInfo
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun MarsDock(
    favoriteApps: List<AppInfo>,
    isDrawerOpen: Boolean,
    onToggleDrawer: () -> Unit,
    onOpenSettings: () -> Unit,
    onAppClick: (AppInfo) -> Unit,
    onAppLongClick: (AppInfo) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        // Futuristic floating dock bar
        Row(
            modifier = Modifier
                .clip(RoundedCornerShape(24.dp))
                .background(MarsTheme.colors.surfaceVariant.copy(alpha = 0.95f))
                .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(24.dp))
                .padding(horizontal = 14.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Pinned favorite apps (up to 4)
            favoriteApps.take(4).forEach { app ->
                MarsGridItem(
                    app = app,
                    onClick = { onAppClick(app) },
                    onLongClick = { onAppLongClick(app) },
                    modifier = Modifier.size(52.dp)
                )
            }

            // Central Drawer Trigger Button
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(if (isDrawerOpen) MarsTheme.colors.primaryRed else MarsTheme.colors.surface)
                    .border(1.dp, MarsTheme.colors.primaryRed, RoundedCornerShape(14.dp))
                    .clickable { onToggleDrawer() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Apps,
                    contentDescription = "App Drawer",
                    tint = if (isDrawerOpen) MarsTheme.colors.background else MarsTheme.colors.primaryRed,
                    modifier = Modifier.size(24.dp)
                )
            }

            // Quick Settings Access Button
            Box(
                modifier = Modifier
                    .size(46.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(MarsTheme.colors.surface)
                    .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(14.dp))
                    .clickable { onOpenSettings() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = MarsTheme.colors.textSecondary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
