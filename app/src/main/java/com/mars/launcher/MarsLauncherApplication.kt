package com.mars.launcher

import android.app.Application
import com.mars.launcher.apps.AppRepository
import com.mars.launcher.data.LauncherPreferences
import com.mars.launcher.ai.MarsAiBridge

class MarsLauncherApplication : Application() {

    lateinit var appRepository: AppRepository
        private set

    lateinit var launcherPreferences: LauncherPreferences
        private set

    lateinit var aiBridge: MarsAiBridge
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this

        launcherPreferences = LauncherPreferences(this)
        appRepository = AppRepository(this, launcherPreferences)
        aiBridge = MarsAiBridge()

        // Preload launchable applications on IO dispatcher
        appRepository.refreshApps()
    }

    companion object {
        lateinit var instance: MarsLauncherApplication
            private set
    }
}
