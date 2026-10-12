package com.mars.launcher.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.ui.theme.MarsTheme
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Lawnchair / At-a-Glance smart clock and date widget with long-press management.
 */
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun MarsClock(
    onClick: (() -> Unit)? = null,
    onLongClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    var currentTime by remember { mutableStateOf(Date()) }

    LaunchedEffect(Unit) {
        while (true) {
            currentTime = Date()
            delay(1000L)
        }
    }

    val timeFormat = remember { SimpleDateFormat("HH:mm", Locale.getDefault()) }
    val dayOfWeekFormat = remember { SimpleDateFormat("EEEE", Locale.getDefault()) }
    val dateFormat = remember { SimpleDateFormat("d MMMM", Locale.getDefault()) }

    val formattedTime = timeFormat.format(currentTime)
    val formattedDay = dayOfWeekFormat.format(currentTime)
    val formattedDate = dateFormat.format(currentTime)

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .combinedClickable(
                onClick = { onClick?.invoke() },
                onLongClick = { onLongClick?.invoke() }
            )
            .padding(horizontal = 24.dp, vertical = 12.dp),
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            text = formattedTime,
            fontSize = 54.sp,
            fontWeight = FontWeight.Normal,
            fontFamily = FontFamily.SansSerif,
            letterSpacing = (-1.5).sp,
            color = MarsTheme.colors.textPrimary
        )

        Spacer(modifier = Modifier.height(2.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "$formattedDay, $formattedDate",
                fontSize = 15.sp,
                fontFamily = FontFamily.SansSerif,
                fontWeight = FontWeight.Medium,
                color = MarsTheme.colors.textSecondary
            )
        }
    }
}
