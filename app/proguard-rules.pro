# ProGuard rules for MARS Launcher
# Keep Compose and DataStore classes
-keepclassmembers class * extends androidx.lifecycle.ViewModel {
    <init>(...);
}
-keepattributes *Annotation*
-dontwarn java.lang.invoke.**
