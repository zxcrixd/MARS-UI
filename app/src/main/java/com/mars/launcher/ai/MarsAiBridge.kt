package com.mars.launcher.ai

import com.mars.launcher.apps.AppInfo
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Offline, standalone implementation of AiFeatureProvider that requires no external API keys
 * and works completely offline without network dependencies.
 */
class OfflineMarsAiProvider : AiFeatureProvider {
    override val isEnabled: Boolean = true
    override val providerName: String = "MARS Local Neural Heuristics (Offline)"

    override suspend fun searchAppsWithAi(
        query: String,
        installedApps: List<AppInfo>
    ): List<AiAppRecommendation> {
        val trimmed = query.trim().lowercase()
        if (trimmed.isEmpty()) return emptyList()

        return installedApps.mapNotNull { app ->
            val labelLower = app.label.lowercase()
            val pkgLower = app.packageName.lowercase()

            val score = when {
                labelLower == trimmed -> 1.0f
                labelLower.startsWith(trimmed) -> 0.85f
                labelLower.contains(trimmed) -> 0.65f
                pkgLower.contains(trimmed) -> 0.40f
                else -> 0.0f
            }

            if (score > 0.0f) {
                AiAppRecommendation(
                    app = app,
                    relevanceScore = score,
                    explanation = "Direct heuristic match on device"
                )
            } else null
        }.sortedByDescending { it.relevanceScore }
    }

    override suspend fun parseNaturalCommand(
        command: String,
        installedApps: List<AppInfo>
    ): MarsCommandResult {
        val lower = command.trim().lowercase()

        // Match commands like "open camera", "launch youtube", "start chrome"
        val openPrefixes = listOf("open ", "launch ", "start ", "run ")
        for (prefix in openPrefixes) {
            if (lower.startsWith(prefix)) {
                val targetName = lower.removePrefix(prefix).trim()
                val matchedApp = installedApps.firstOrNull {
                    it.label.lowercase().contains(targetName)
                }
                if (matchedApp != null) {
                    return MarsCommandResult.LaunchApp(matchedApp)
                }
            }
        }

        if (lower.contains("settings") || lower.contains("preferences")) {
            return MarsCommandResult.OpenSetting("general")
        }

        return MarsCommandResult.Unhandled(command)
    }

    override suspend fun getDailyBriefing(installedApps: List<AppInfo>): MarsBriefing {
        return MarsBriefing(
            title = "ARES-IV OPERATIONAL CYCLE",
            summary = "All onboard navigation systems running on nominal parameters.",
            suggestedApps = installedApps.filter { it.isFavorite }.take(3)
        )
    }
}

/**
 * Coordination bridge for MARS AI capabilities.
 */
class MarsAiBridge(
    initialProvider: AiFeatureProvider = OfflineMarsAiProvider()
) {
    private val _currentProvider = MutableStateFlow(initialProvider)
    val currentProvider: StateFlow<AiFeatureProvider> = _currentProvider.asStateFlow()

    fun updateProvider(newProvider: AiFeatureProvider) {
        _currentProvider.value = newProvider
    }

    suspend fun processQuery(query: String, apps: List<AppInfo>): List<AiAppRecommendation> {
        return _currentProvider.value.searchAppsWithAi(query, apps)
    }

    suspend fun executeCommand(command: String, apps: List<AppInfo>): MarsCommandResult {
        return _currentProvider.value.parseNaturalCommand(command, apps)
    }
}
