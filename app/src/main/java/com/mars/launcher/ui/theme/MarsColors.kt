package com.mars.launcher.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

// One UI & Lawnchair inspired clean palette
val LauncherBackgroundDark = Color(0xFF0F0F12)
val LauncherSurfaceDark = Color(0xFF18181F)
val LauncherCardDark = Color(0xFF22222C)
val LauncherCardElevated = Color(0xFF2C2C38)
val LauncherDockBg = Color(0x33FFFFFF)

// Restrained, elegant MARS Crimson accent (One UI style)
val LauncherAccent = Color(0xFFE53935)
val LauncherAccentDark = Color(0xFFC62828)
val LauncherAccentLight = Color(0xFFFF5252)

// Text tones
val TextPrimaryDark = Color(0xFFFFFFFF)
val TextSecondaryDark = Color(0xFFA0A3BD)
val TextTertiaryDark = Color(0xFF71758A)

// Icon shape styles
enum class IconShape {
    SQUIRCLE, // One UI style
    CIRCLE,   // Pixel style
    ROUNDED   // Classic style
}

@Immutable
data class MarsColorPalette(
    val background: Color = LauncherBackgroundDark,
    val surface: Color = LauncherSurfaceDark,
    val surfaceVariant: Color = LauncherCardDark,
    val accent: Color = LauncherAccent,
    val textPrimary: Color = TextPrimaryDark,
    val textSecondary: Color = TextSecondaryDark,
    val textTertiary: Color = TextTertiaryDark,
    val dockBackground: Color = LauncherDockBg,
    val isDark: Boolean = true
)
