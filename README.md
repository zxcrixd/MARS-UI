# 🚀 MARS Launcher (`com.mars.launcher`)

**MARS Launcher** is a native Android home screen replacement built with **Kotlin** and **Jetpack Compose**. It delivers a high-performance **MARS RED** space-inspired cyberpunk aesthetic optimized for AMOLED displays, with real-time app discovery, zero telemetry, and an offline neural bridge architecture ready for future MARS AI integration.

---

## 🌌 Key Highlights & Features

- **True Android HOME Replacement**: Registered with `android.intent.category.HOME` and `android.intent.category.DEFAULT` intent filters.
- **Deep Black AMOLED (#000000)**: Maximum battery efficiency on OLED/AMOLED panels with electric crimson and glowing red accents.
- **Real App Discovery & Package Visibility**: Discovers launchable installed applications using least-privileged Android 11+ `<queries>` filtering—**no broad `QUERY_ALL_PACKAGES` permission requested**.
- **Real-Time Dynamic Synchronization**: Detects newly installed, updated, or removed applications via `PackageChangeReceiver` and lifecycle `onResume` sync.
- **Orbital Dock & Pinned Favorites**: Pin favorite applications to the desktop and quick dock via long-press menus.
- **Live Martian Sol Time Protocol**: Computes real Martian Sol Dates (MSD) for Chryse Planitia with animated seconds.
- **Persistent Preferences via Jetpack DataStore**: Grid column size (3x, 4x, 5x), theme intensity, seconds display, and Sol mode persist across reboots.
- **MARS AI Abstraction Bridge**: `AiFeatureProvider` and `MarsAiBridge` decouple the launcher from any hardcoded or fake AI backend. Standalone local heuristic matching runs offline with zero API keys required.

---

## 🛠️ Project Structure

```
MarsLauncher/
├── settings.gradle.kts                # Gradle multi-project settings
├── build.gradle.kts                   # Top-level build config
├── gradle.properties                  # AndroidX & JVM optimization args
├── gradle/
│   └── libs.versions.toml             # Gradle Version Catalog (AGP 8.7, Kotlin 2.0, Compose BOM)
├── app/
│   ├── build.gradle.kts               # App module build dependencies
│   ├── proguard-rules.pro             # ProGuard optimization rules
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml    # HOME launcher filters & package queries
│           ├── java/com/mars/launcher/
│           │   ├── MarsLauncherApplication.kt
│           │   ├── MainActivity.kt
│           │   ├── apps/
│           │   │   ├── AppInfo.kt               # App entity (package, activity, label, icon)
│           │   │   ├── AppRepository.kt         # IO query & Intent launch engine
│           │   │   ├── AppDrawerScreen.kt       # Scrollable LazyVerticalGrid drawer
│           │   │   └── PackageChangeReceiver.kt # BroadcastReceiver for pkg changes
│           │   ├── home/
│           │   │   ├── HomeUiState.kt           # Immutable UI state
│           │   │   ├── HomeViewModel.kt         # Architecture ViewModel
│           │   │   └── HomeScreen.kt            # Desktop & animated view transitions
│           │   ├── settings/
│           │   │   └── SettingsScreen.kt        # Launcher settings & default picker
│           │   ├── data/
│           │   │   └── LauncherPreferences.kt   # Jetpack Preferences DataStore
│           │   ├── ui/
│           │   │   ├── theme/
│           │   │   │   ├── MarsColors.kt        # MARS RED palette
│           │   │   │   ├── MarsType.kt          # Monospace / Sans typography
│           │   │   │   └── MarsTheme.kt         # Material3 / LocalMarsColors
│           │   │   └── components/
│           │   │       ├── MarsClock.kt         # Sol date & digital clock
│           │   │       ├── MarsSearchBar.kt     # Filter bar with clear action
│           │   │       ├── MarsDock.kt          # Floating bottom dock
│           │   │       ├── MarsGridItem.kt      # App icon renderer with badge
│           │   │       └── MarsHudOverlay.kt    # Space coordinate telemetry
│           │   └── ai/
│           │       ├── AiFeatureProvider.kt     # Interface contract
│           │       └── MarsAiBridge.kt          # Offline provider & coordination
│           └── res/
│               ├── values/
│               │   ├── strings.xml
│               │   ├── colors.xml
│               │   └── themes.xml
│               ├── drawable/
│               │   ├── ic_launcher_background.xml
│               │   └── ic_launcher_foreground.xml
│               └── mipmap-anydpi-v26/
│                   ├── ic_launcher.xml
│                   └── ic_launcher_round.xml
```

---

## ⚙️ Requirements & Toolchain

- **Android Studio**: Ladybug, Koala, Jellyfish, or newer.
- **JDK**: Java 17 or Java 21 (configured in Android Studio).
- **Target SDK**: Android 15 (API 35)
- **Minimum SDK**: Android 8.0 (API 26)
- **Kotlin**: 2.0.21
- **Compose**: Jetpack Compose BOM 2024.11.00

---

## 🔨 Build & Installation Instructions

### Method 1: Using Android Studio
1. Launch Android Studio.
2. Select **Open** and choose this project root folder (`MarsLauncher`).
3. Allow Gradle to sync dependencies (`Sync Project with Gradle Files`).
4. Select an Android device or emulator running API 26 or higher.
5. Click the green **Run** button (or press `Shift + F10`).

### Method 2: Command Line (Gradle)
Assemble the debug APK:
```bash
./gradlew assembleDebug
```
The compiled APK will be located at:
```
app/build/outputs/apk/debug/app-debug.apk
```

Install directly to a connected USB or Wi-Fi Android device via ADB:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 How to Select MARS Launcher as Default Home Screen

1. On your Android phone, press the physical or gesture **Home** button.
2. Android will prompt: **"Use MARS Launcher as Home"** -> tap **"Always"**.
3. Alternatively, open **MARS Launcher Settings**:
   - Tap the gear icon in the bottom dock.
   - Tap **"Set as Default Home Launcher"**.
   - This launches `Settings.ACTION_HOME_SETTINGS` directly.
   - Choose **MARS Launcher** under **Default Home app**.

---

## 🛡️ Security & Privacy Architecture

- **Least-Privileged Queries**: Uses explicit `<intent><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent></queries>` to discover only launchable apps on Android 11+.
- **Zero Sensitive Permissions**: Does not request camera, contacts, microphone, SMS, or location permissions.
- **Zero Telemetry**: No remote analytics, tracking pixels, or background data exfiltration.
- **Edge-to-Edge Compliance**: Uses Android 15 edge-to-edge system insets and transparent system bars.
