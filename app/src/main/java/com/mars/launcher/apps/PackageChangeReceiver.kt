package com.mars.launcher.apps

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.mars.launcher.MarsLauncherApplication

/**
 * Listens for package addition, removal, and updates to keep the app drawer synchronized.
 */
class PackageChangeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent == null) return
        when (intent.action) {
            Intent.ACTION_PACKAGE_ADDED,
            Intent.ACTION_PACKAGE_REMOVED,
            Intent.ACTION_PACKAGE_REPLACED,
            Intent.ACTION_PACKAGE_CHANGED -> {
                try {
                    MarsLauncherApplication.instance.appRepository.refreshApps()
                } catch (_: Exception) {}
            }
        }
    }
}
