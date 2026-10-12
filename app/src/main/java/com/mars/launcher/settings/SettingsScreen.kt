package com.mars.launcher.settings

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.compose.foundation.background
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.home.HomeUiState
import com.mars.launcher.home.HomeViewModel
import com.mars.launcher.ui.theme.IconShape
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
        // Top App Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Назад",
                    tint = MarsTheme.colors.textPrimary
                )
            }
            Text(
                text = "Настройки MARS Launcher",
                fontFamily = FontFamily.SansSerif,
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MarsTheme.colors.textPrimary
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Card: Set Default Launcher
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .clickable { openDefaultHomeSettings(context) }
                .padding(18.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = MarsTheme.colors.accent,
                    modifier = Modifier.size(26.dp)
                )
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 14.dp)
                ) {
                    Text(
                        text = "Выбрать лаунчером по умолчанию",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp,
                        color = MarsTheme.colors.textPrimary
                    )
                    Text(
                        text = "Открыть настройки Android для выбора домашнего экрана",
                        fontSize = 12.sp,
                        color = MarsTheme.colors.textSecondary
                    )
                }
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null,
                    tint = MarsTheme.colors.textSecondary
                )
            }
        }

        // Section: MARS AI Integration (super-mars.ai.studio)
        SettingsSectionHeader(title = "ИНТЕГРАЦИЯ MARS AI")

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 6.dp)
                .clip(RoundedCornerShape(18.dp))
                .background(Color(0x22E53935))
                .clickable {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://super-mars.ai.studio")).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    }
                    try { context.startActivity(intent) } catch (_: Exception) {}
                }
                .padding(18.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = MarsTheme.colors.accent,
                    modifier = Modifier.size(26.dp)
                )
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(horizontal = 14.dp)
                ) {
                    Text(
                        text = "super-mars.ai.studio",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MarsTheme.colors.textPrimary
                    )
                    Text(
                        text = "Подключен к поисковой строке лаунчера для быстрых AI запросов",
                        fontSize = 12.sp,
                        color = MarsTheme.colors.textSecondary
                    )
                }
                Icon(
                    imageVector = Icons.Default.OpenInNew,
                    contentDescription = null,
                    tint = MarsTheme.colors.accent
                )
            }
        }

        // Section: Главный экран
        SettingsSectionHeader(title = "ГЛАВНЫЙ ЭКРАН И ВИДЖЕТЫ")

        // Clock Widget Toggle
        SettingsSwitchRow(
            title = "Виджет часов и даты",
            description = "Отображать дату и время на рабочем столе (At a Glance)",
            checked = uiState.showClockWidget,
            onCheckedChange = { viewModel.setShowClockWidget(it) }
        )

        // Search Bar Toggle
        SettingsSwitchRow(
            title = "Строка поиска MARS AI в доке",
            description = "Поисковая строка Lawnchair внизу экрана",
            checked = uiState.showDockSearch,
            onCheckedChange = { viewModel.updateShowDockSearch(it) }
        )

        // Home Grid
        SettingsOptionRow(
            title = "Сетка рабочего стола",
            description = "Количество колонок на рабочем столе"
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(4, 5).forEach { cols ->
                    val isSelected = uiState.homeColumns == cols
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) MarsTheme.colors.accent else MarsTheme.colors.surface)
                            .clickable { viewModel.updateHomeColumns(cols) }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = "${cols}x5",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else MarsTheme.colors.textSecondary
                        )
                    }
                }
            }
        }

        // Section: Меню приложений
        SettingsSectionHeader(title = "МЕНЮ ПРИЛОЖЕНИЙ")

        SettingsOptionRow(
            title = "Сетка меню приложений",
            description = "Количество колонок в списке приложений"
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(4, 5).forEach { cols ->
                    val isSelected = uiState.drawerColumns == cols
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) MarsTheme.colors.accent else MarsTheme.colors.surface)
                            .clickable { viewModel.updateDrawerColumns(cols) }
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = "${cols}x",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color.White else MarsTheme.colors.textSecondary
                        )
                    }
                }
            }
        }

        // Section: Иконки и стиль
        SettingsSectionHeader(title = "ФОРМА ИКОНОК")

        SettingsOptionRow(
            title = "Стиль иконок",
            description = "Форма скругления (Lawnchair / One UI)"
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                listOf(
                    IconShape.SQUIRCLE to "Сквиркл",
                    IconShape.CIRCLE to "Круг",
                    IconShape.ROUNDED to "Квадрат"
                ).forEach { (shape, name) ->
                    val isSelected = uiState.iconShape == shape
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) MarsTheme.colors.accent else MarsTheme.colors.surface)
                            .clickable { viewModel.updateIconShape(shape) }
                            .padding(horizontal = 10.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = name,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (isSelected) Color.White else MarsTheme.colors.textSecondary
                        )
                    }
                }
            }
        }

        SettingsSwitchRow(
            title = "Глубокий черный (AMOLED)",
            description = "Черный фон #000000 для экономии энергии",
            checked = uiState.isAmoled,
            onCheckedChange = { viewModel.updateAmoledMode(it) }
        )

        // Rescan Apps
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(MarsTheme.colors.surfaceVariant)
                .clickable { viewModel.refreshApps() }
                .padding(16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = null,
                    tint = MarsTheme.colors.accent
                )
                Text(
                    text = "Обновить список приложений",
                    fontWeight = FontWeight.Medium,
                    fontSize = 14.sp,
                    color = MarsTheme.colors.textPrimary,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }
        }

        // Footer info
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "MARS Launcher • Версия 1.0.0",
                fontSize = 13.sp,
                color = MarsTheme.colors.textSecondary
            )
            Text(
                text = "Стиль Lawnchair + MARS AI • super-mars.ai.studio",
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
        fontFamily = FontFamily.SansSerif,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 0.8.sp,
        color = MarsTheme.colors.textSecondary,
        modifier = Modifier.padding(start = 20.dp, top = 20.dp, bottom = 6.dp)
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
                fontSize = 15.sp,
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
                checkedThumbColor = Color.White,
                checkedTrackColor = MarsTheme.colors.accent,
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
            .padding(horizontal = 20.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 15.sp,
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
    } catch (_: Exception) {}
}
