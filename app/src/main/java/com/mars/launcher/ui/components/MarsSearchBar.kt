package com.mars.launcher.ui.components

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mars.launcher.ui.theme.MarsTheme
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

/**
 * Lawnchair-style search pill with direct super-mars.ai.studio integration.
 */
@Composable
fun MarsSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholderText: String = "Поиск или MARS AI...",
    onAiSearch: ((String) -> Unit)? = null
) {
    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    val launchMarsAiStudio: (String) -> Unit = { searchQuery ->
        val url = if (searchQuery.trim().isNotEmpty()) {
            val encoded = URLEncoder.encode(searchQuery.trim(), StandardCharsets.UTF_8.toString())
            "https://super-mars.ai.studio/?q=$encoded"
        } else {
            "https://super-mars.ai.studio"
        }
        try {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            context.startActivity(intent)
        } catch (_: Exception) {}
        onAiSearch?.invoke(searchQuery)
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(CircleShape)
            .background(Color(0x331F212D))
            .padding(horizontal = 14.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Поиск",
                tint = MarsTheme.colors.textSecondary,
                modifier = Modifier.size(20.dp)
            )

            Spacer(modifier = Modifier.width(10.dp))

            Box(modifier = Modifier.weight(1f)) {
                if (query.isEmpty()) {
                    Text(
                        text = placeholderText,
                        style = TextStyle(
                            fontFamily = FontFamily.SansSerif,
                            fontSize = 14.sp,
                            color = MarsTheme.colors.textTertiary
                        )
                    )
                }

                BasicTextField(
                    value = query,
                    onValueChange = onQueryChange,
                    singleLine = true,
                    textStyle = TextStyle(
                        fontFamily = FontFamily.SansSerif,
                        fontSize = 14.sp,
                        color = MarsTheme.colors.textPrimary
                    ),
                    cursorBrush = SolidColor(MarsTheme.colors.accent),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    keyboardActions = KeyboardActions(onSearch = {
                        focusManager.clearFocus()
                        if (query.trim().isNotEmpty()) {
                            launchMarsAiStudio(query)
                        }
                    }),
                    modifier = Modifier.fillMaxWidth()
                )
            }

            if (query.isNotEmpty()) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = "Очистить",
                    tint = MarsTheme.colors.textSecondary,
                    modifier = Modifier
                        .size(18.dp)
                        .clickable { onQueryChange("") }
                )
                Spacer(modifier = Modifier.width(8.dp))
            }

            // Direct super-mars.ai.studio button inside the search pill
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0x33E53935))
                    .clickable { launchMarsAiStudio(query) }
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = "MARS AI",
                    tint = MarsTheme.colors.accent,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "AI Studio",
                    fontSize = 11.sp,
                    fontFamily = FontFamily.SansSerif,
                    fontWeight = FontWeight.Bold,
                    color = MarsTheme.colors.accent
                )
            }
        }
    }
}
