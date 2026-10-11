package com.mars.launcher.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.ui.theme.MarsTheme
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

@Composable
fun MarsClock(
    showSeconds: Boolean = true,
    showMartianSol: Boolean = true,
    modifier: Modifier = Modifier
) {
    var currentTime by remember { mutableStateOf(Date()) }

    LaunchedEffect(Unit) {
        while (true) {
            currentTime = Date()
            delay(1000L)
        }
    }

    val timeFormat = remember(showSeconds) {
        if (showSeconds) SimpleDateFormat("HH:mm:ss", Locale.US)
        else SimpleDateFormat("HH:mm", Locale.US)
    }

    val dateFormat = remember {
        SimpleDateFormat("EEE, MMM dd, yyyy", Locale.US)
    }

    // Mars Sol Date calculation approximation:
    // MSD = (JD - 2451549.5) / 1.027491252 + 44796.0 - 0.00096
    val currentMillis = currentTime.time
    val julianDate = (currentMillis / 86400000.0) + 2440587.5
    val marsSolDate = ((julianDate - 2451549.5) / 1.027491252 + 44796.0).toLong()

    val formattedTime = timeFormat.format(currentTime)
    val formattedDate = dateFormat.format(currentTime)

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseAlpha"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        horizontalAlignment = Alignment.Start
    ) {
        // Futuristic badge indicator
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Box(
                modifier = Modifier
                    .width(8.dp)
                    .height(8.dp)
                    .background(MarsTheme.colors.primaryRed, RoundedCornerShape(2.dp))
                    .alpha(pulseAlpha)
            )
            Text(
                text = if (showMartianSol) "SOL $marsSolDate • CHRYSE PLANITIA" else "PLANET EARTH BASE",
                style = MarsTheme.colors.let {
                    androidx.compose.ui.text.TextStyle(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.6.sp,
                        color = it.primaryRed
                    )
                }
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        // Large Digital Clock
        Text(
            text = formattedTime,
            fontSize = if (showSeconds) 54.sp else 62.sp,
            fontWeight = FontWeight.ExtraBold,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = (-1.5).sp,
            color = MarsTheme.colors.textPrimary
        )

        Spacer(modifier = Modifier.height(2.dp))

        // Subtitle Date & System Status
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                text = formattedDate.uppercase(Locale.US),
                fontSize = 12.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = 1.sp,
                color = MarsTheme.colors.textSecondary
            )
            Box(
                modifier = Modifier
                    .border(1.dp, MarsTheme.colors.borderGlow, RoundedCornerShape(4.dp))
                    .background(Color(0x221A1A24), RoundedCornerShape(4.dp))
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = "SYNCED",
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    color = MarsTheme.colors.primaryRed
                )
            }
        }
    }
}
