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
    primary = LauncherAccent,
    onPrimary = TextPrimaryDark,
    primaryContainer = LauncherAccentDark,
    onPrimaryContainer = TextPrimaryDark,
    secondary = LauncherAccentLight,
    onSecondary = LauncherBackgroundDark,
    background = LauncherBackgroundDark,
    onBackground = TextPrimaryDark,
    surface = LauncherSurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = LauncherCardDark,
    onSurfaceVariant = TextSecondaryDark,
    outline = LauncherCardElevated
)

@Composable
fun MarsLauncherTheme(
    isAmoled: Boolean = false,
    content: @Composable () -> Unit
) {
    val palette = if (isAmoled) {
        MarsColorPalette(
            background = androidx.compose.ui.graphics.Color(0xFF000000),
            surface = androidx.compose.ui.graphics.Color(0xFF0C0C0E),
            surfaceVariant = androidx.compose.ui.graphics.Color(0xFF16161B)
        )
    } else {
        MarsColorPalette()
    }

    CompositionLocalProvider(LocalMarsColors provides palette) {
        MaterialTheme(
            colorScheme = DarkColorScheme,
            typography = MarsTypography,
            content = content
        )
    }
}
