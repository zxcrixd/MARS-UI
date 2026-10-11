package com.mars.launcher.ai

import com.mars.launcher.apps.AppInfo

/**
 * Result returned by natural language command parsing.
 */
sealed class MarsCommandResult {
    data class LaunchApp(val app: AppInfo) : MarsCommandResult()
    data class OpenSetting(val settingKey: String) : MarsCommandResult()
    data class Message(val text: String) : MarsCommandResult()
    data class Unhandled(val originalInput: String) : MarsCommandResult()
}

/**
 * AI-ranked app recommendation based on context or semantic query.
 */
data class AiAppRecommendation(
    val app: AppInfo,
    val relevanceScore: Float,
    val explanation: String
)

/**
 * Daily briefing model for future Mars AI integrations.
 */
data class MarsBriefing(
    val title: String,
    val summary: String,
    val suggestedApps: List<AppInfo>
)

/**
 * Interface contract for MARS AI integration.
 * In this initial release, an offline rule-based provider is used.
 * Third-party and server-side models can implement this interface in future releases.
 */
interface AiFeatureProvider {
    val isEnabled: Boolean
    val providerName: String

    suspend fun searchAppsWithAi(query: String, installedApps: List<AppInfo>): List<AiAppRecommendation>
    suspend fun parseNaturalCommand(command: String, installedApps: List<AppInfo>): MarsCommandResult
    suspend fun getDailyBriefing(installedApps: List<AppInfo>): MarsBriefing?
}
