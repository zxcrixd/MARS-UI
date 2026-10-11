package com.mars.launcher.apps

import android.graphics.drawable.Drawable

/**
 * Represents a launchable Android application.
 */
data class AppInfo(
    val packageName: String,
    val activityName: String,
    val label: String,
    val icon: Drawable?,
    val isFavorite: Boolean = false,
    val isDocked: Boolean = false,
    val installTime: Long = 0L
) {
    val uniqueId: String
        get() = "$packageName/$activityName"

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is AppInfo) return false
        return packageName == other.packageName && activityName == other.activityName
    }

    override fun hashCode(): Int {
        var result = packageName.hashCode()
        result = 31 * result + activityName.hashCode()
        return result
    }
}
