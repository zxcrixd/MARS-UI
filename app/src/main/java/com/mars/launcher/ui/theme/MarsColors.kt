package com.mars.launcher.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

val MarsAmoledBlack = Color(0xFF000000)
val MarsDarkSurface = Color(0xFF0A0A0E)
val MarsCardSurface = Color(0xFF13131A)
val MarsCardElevated = Color(0xFF1B1B24)

// Mars Red Variations
val MarsRedPrimary = Color(0xFFFF2A36)
val MarsRedCrimson = Color(0xFFD6001C)
val MarsRedGlow = Color(0xFFFF4D5A)
val MarsRedDim = Color(0xFF661016)
val MarsRedSubtleBorder = Color(0x33FF2A36)
val MarsRedOverlay = Color(0x1AFF2A36)

// Text and neutral tones
val MarsTextPrimary = Color(0xFFFFFFFF)
val MarsTextSecondary = Color(0xFF8F93A0)
val MarsTextTertiary = Color(0xFF5A5E6B)
val MarsDivider = Color(0x22FFFFFF)
val MarsSuccess = Color(0xFF00E676)
val MarsWarning = Color(0xFFFFB300)

@Immutable
data class MarsColorPalette(
    val background: Color = MarsAmoledBlack,
    val surface: Color = MarsDarkSurface,
    val surfaceVariant: Color = MarsCardSurface,
    val primaryRed: Color = MarsRedPrimary,
    val primaryRedVariant: Color = MarsRedCrimson,
    val redGlow: Color = MarsRedGlow,
    val textPrimary: Color = MarsTextPrimary,
    val textSecondary: Color = MarsTextSecondary,
    val textTertiary: Color = MarsTextTertiary,
    val borderGlow: Color = MarsRedSubtleBorder,
    val isAmoled: Boolean = true
)
