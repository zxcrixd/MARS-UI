package com.mars.launcher.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf

val LocalMarsColors = staticCompositionLocalOf { MarsColorPalette() }

object MarsTheme {
    val colors: MarsColorPalette
        @Composable
        @ReadOnlyComposable
        get() = LocalMarsColors.current
}

private val DarkColorScheme = darkColorScheme(
    primary = MarsRedPrimary,
    onPrimary = MarsTextPrimary,
    primaryContainer = MarsRedDim,
    onPrimaryContainer = MarsRedGlow,
    secondary = MarsRedGlow,
    onSecondary = MarsAmoledBlack,
    background = MarsAmoledBlack,
    onBackground = MarsTextPrimary,
    surface = MarsDarkSurface,
    onSurface = MarsTextPrimary,
    surfaceVariant = MarsCardSurface,
    onSurfaceVariant = MarsTextSecondary,
    outline = MarsRedSubtleBorder
)

@Composable
fun MarsLauncherTheme(
    intensity: String = "BALANCED",
    content: @Composable () -> Unit
) {
    val palette = when (intensity) {
        "HIGH" -> MarsColorPalette(
            primaryRed = MarsRedGlow,
            borderGlow = MarsRedPrimary.copy(alpha = 0.4f)
        )
        "STEALTH" -> MarsColorPalette(
            primaryRed = MarsRedCrimson,
            borderGlow = MarsRedSubtleBorder.copy(alpha = 0.15f)
        )
        else -> MarsColorPalette()
    }

    CompositionLocalProvider(LocalMarsColors provides palette) {
        MaterialTheme(
            colorScheme = DarkColorScheme,
            typography = MarsTypography,
            content = content
        )
    }
}
