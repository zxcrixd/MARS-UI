package com.mars.launcher.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.ui.theme.MarsTheme

@Composable
fun MarsHudOverlay(
    showTelemetry: Boolean = true,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize()
    ) {
        val glowColor = MarsTheme.colors.borderGlow

        // Corner futuristic bracket canvas
        Canvas(modifier = Modifier.fillMaxSize()) {
            val strokeWidth = 1.5.dp.toPx()
            val bracketSize = 24.dp.toPx()
            val pad = 12.dp.toPx()

            // Top Left Bracket
            drawLine(
                color = glowColor,
                start = Offset(pad, pad),
                end = Offset(pad + bracketSize, pad),
                strokeWidth = strokeWidth
            )
            drawLine(
                color = glowColor,
                start = Offset(pad, pad),
                end = Offset(pad, pad + bracketSize),
                strokeWidth = strokeWidth
            )

            // Top Right Bracket
            drawLine(
                color = glowColor,
                start = Offset(size.width - pad, pad),
                end = Offset(size.width - pad - bracketSize, pad),
                strokeWidth = strokeWidth
            )
            drawLine(
                color = glowColor,
                start = Offset(size.width - pad, pad),
                end = Offset(size.width - pad, pad + bracketSize),
                strokeWidth = strokeWidth
            )
        }

        if (showTelemetry) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "ARES-IV // 22.4°N 49.9°W",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = MarsTheme.colors.textTertiary
                )
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = "STATUS // NOMINAL",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp,
                    color = MarsTheme.colors.primaryRed
                )
            }
        }
    }
}
