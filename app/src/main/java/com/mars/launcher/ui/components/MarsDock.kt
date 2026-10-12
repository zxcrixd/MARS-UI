package com.mars.launcher.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.mars.launcher.apps.AppInfo
import com.mars.launcher.ui.theme.IconShape

/**
 * Standard Android favorites dock at the bottom of the home screen (One UI / Lawnchair style).
 */
@Composable
fun MarsDock(
    dockApps: List<AppInfo>,
    onAppClick: (AppInfo) -> Unit,
    onAppLongClick: (AppInfo) -> Unit,
    iconShape: IconShape = IconShape.SQUIRCLE,
    showSearchInDock: Boolean = true,
    searchQuery: String = "",
    onOpenSearch: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 6.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Optional Dock Search Pill (Lawnchair / Pixel style)
        if (showSearchInDock) {
            MarsSearchBar(
                query = searchQuery,
                onQueryChange = { onOpenSearch() },
                modifier = Modifier
                    .padding(bottom = 12.dp)
            )
        }

        // Clean Translucent Dock Bar (One UI blur style)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(24.dp))
                .background(Color(0x18FFFFFF))
                .padding(horizontal = 12.dp, vertical = 8.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                dockApps.take(5).forEach { app ->
                    MarsGridItem(
                        app = app,
                        onClick = { onAppClick(app) },
                        onLongClick = { onAppLongClick(app) },
                        iconShape = iconShape,
                        showLabel = false, // Clean dock without text labels
                        modifier = Modifier.size(56.dp)
                    )
                }
            }
        }
    }
}
