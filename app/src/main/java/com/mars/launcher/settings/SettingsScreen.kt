package com.mars.launcher.settings

import android.content.Context
import android.content.Intent
import android.provider.Settings
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Divider
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.home.HomeUiState
import com.mars.launcher.home.HomeViewModel
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun SettingsScreen(
    uiState: HomeUiState,
    viewModel: HomeViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MarsTheme.colors.background)
            .statusBarsPadding()
            .verticalScroll(scrollState)
            .padding(bottom = 32.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = MarsTheme.colors.primaryRed
                )
            }
            Text(
                text = "SYSTEM PROTOCOL // SETTINGS",
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                letterSpacing = 1.2.sp,
                color = MarsTheme.colors.textPrimary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Card: Set Default Launcher
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .border(1.dp, MarsTheme.colors.primaryRed, RoundedCornerShape(12.dp))
                .clickable {
                    openDefaultHomeSettings(context)
                }
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed,
                    modifier = Modifier.size(28.dp)
                )
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 14.dp)
                ) {
                    Text(
                        text = "Set as Default Home Launcher",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MarsTheme.colors.textPrimary
                    )
                    Text(
                        text = "Tap to open Android Home App settings and choose MARS Launcher",
                        fontSize = 12.sp,
                        color = MarsTheme.colors.textSecondary
                    )
                }
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed
                )
            }
        }

        // Section: Interface Settings
        SettingsSectionHeader(title = "INTERFACE CONFIGURATION")

        SettingsSwitchRow(
            title = "Martian Sol Date Calculation",
            description = "Display time in Martian Sol coordinates (Chryse Planitia)",
            checked = uiState.martianSolMode,
            onCheckedChange = { viewModel.updateMartianSolMode(it) }
        )

        SettingsSwitchRow(
            title = "Precise Clock Seconds",
            description = "Real-time second tick on the AMOLED main clock",
            checked = uiState.showSeconds,
            onCheckedChange = { viewModel.updateShowSeconds(it) }
        )

        SettingsSwitchRow(
            title = "Orbital HUD Telemetry",
            description = "Draw geometric HUD brackets and coordinate telemetry",
            checked = uiState.showHudTelemetry,
            onCheckedChange = { viewModel.updateShowHud(it) }
        )

        // Column selector
        SettingsOptionRow(
            title = "App Drawer Columns",
            description = "Number of grid columns in app drawer (${uiState.gridColumns} cols)"
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(3, 4, 5).forEach { cols ->
                    val isSelected = uiState.gridColumns == cols
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isSelected) MarsTheme.colors.primaryRed else MarsTheme.colors.surface)
                            .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(6.dp))
                            .clickable { viewModel.updateGridColumns(cols) }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "${cols}X",
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) MarsTheme.colors.background else MarsTheme.colors.textPrimary
                        )
                    }
                }
            }
        }

        // Theme Intensity
        SettingsOptionRow(
            title = "MARS RED Glow Mode",
            description = "Accent radiation level (${uiState.themeIntensity})"
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("STEALTH", "BALANCED", "HIGH").forEach { mode ->
                    val isSelected = uiState.themeIntensity == mode
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (isSelected) MarsTheme.colors.primaryRed else MarsTheme.colors.surface)
                            .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(6.dp))
                            .clickable { viewModel.updateThemeIntensity(mode) }
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = mode,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) MarsTheme.colors.background else MarsTheme.colors.textPrimary
                        )
                    }
                }
            }
        }

        // Section: Future AI Integration
        SettingsSectionHeader(title = "MARS AI ARCHITECTURE")

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(12.dp))
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Psychology,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed,
                    modifier = Modifier.size(24.dp)
                )
                Column(modifier = Modifier.padding(start = 12.dp)) {
                    Text(
                        text = "Neural Bridge Provider: OFFLINE LOCAL",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MarsTheme.colors.textPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Zero remote telemetry or cloud requirements. Standalone heuristic parsing is active. Ready to plug into MARS AI via AiFeatureProvider contract.",
                        fontSize = 12.sp,
                        color = MarsTheme.colors.textSecondary
                    )
                }
            }
        }

        // Section: Maintenance
        SettingsSectionHeader(title = "MAINTENANCE")

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(12.dp))
                .clickable { viewModel.refreshApps() }
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = null,
                    tint = MarsTheme.colors.primaryRed
                )
                Text(
                    text = "Force Rescan Installed Applications",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = MarsTheme.colors.textPrimary,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }
        }

        // About MARS Launcher
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "MARS LAUNCHER v1.0.0",
                fontFamily = FontFamily.Monospace,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = MarsTheme.colors.primaryRed
            )
            Text(
                text = "Package: com.mars.launcher • Native Jetpack Compose",
                fontSize = 11.sp,
                color = MarsTheme.colors.textTertiary,
                modifier = Modifier.padding(top = 2.dp)
            )
        }
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        text = title,
        fontFamily = FontFamily.Monospace,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.2.sp,
        color = MarsTheme.colors.textTertiary,
        modifier = Modifier.padding(start = 20.dp, top = 20.dp, bottom = 8.dp)
    )
}

@Composable
fun SettingsSwitchRow(
    title: String,
    description: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onCheckedChange(!checked) }
            .padding(horizontal = 20.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MarsTheme.colors.textPrimary
            )
            Text(
                text = description,
                fontSize = 12.sp,
                color = MarsTheme.colors.textSecondary
            )
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = MarsTheme.colors.primaryRed,
                checkedTrackColor = MarsTheme.colors.primaryRed.copy(alpha = 0.3f),
                uncheckedThumbColor = MarsTheme.colors.textSecondary,
                uncheckedTrackColor = MarsTheme.colors.surfaceVariant
            )
        )
    }
}

@Composable
fun SettingsOptionRow(
    title: String,
    description: String,
    content: @Composable () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MarsTheme.colors.textPrimary
            )
            Text(
                text = description,
                fontSize = 12.sp,
                color = MarsTheme.colors.textSecondary
            )
        }
        content()
    }
}

private fun openDefaultHomeSettings(context: Context) {
    val intent = try {
        Intent(Settings.ACTION_HOME_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
    } catch (_: Exception) {
        Intent(Settings.ACTION_SETTINGS).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
    }
    try {
        context.startActivity(intent)
    } catch (_: Exception) {
        try {
            val fallback = Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(fallback)
        } catch (_: Exception) {}
    }
}
