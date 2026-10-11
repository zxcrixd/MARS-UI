import React, { useState } from 'react';
import { AndroidDeviceSimulator } from './components/AndroidDeviceSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureChecklist } from './components/ArchitectureChecklist';
import { exportAndroidProjectZip } from './utils/projectExporter';
import { 
  Rocket, Smartphone, FolderTree, ShieldCheck, 
  Download, Terminal, Copy, Check, ExternalLink,
  Flame, Radio, Compass, Layers
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'audit' | 'guide'>('simulator');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAndroidProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Top Cyber Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#08080d]/90 backdrop-blur-md border-b border-red-950/60 px-4 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-950 border border-red-500/60 flex items-center justify-center shadow-lg shadow-red-950/60">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wider text-white">MARS LAUNCHER</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/60">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Native Android Jetpack Compose • <span className="text-red-400">com.mars.launcher</span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#101018] rounded-xl border border-neutral-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'simulator' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>AMOLED Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'code' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Code Tree</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'audit' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'guide' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-900/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build Guide</span>
          </button>
        </div>

        {/* Action Button: Export ZIP */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition transform active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'PACKAGING...' : 'EXPORT PROJECT ZIP'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col">
        {activeTab === 'simulator' && <AndroidDeviceSimulator />}

        {activeTab === 'code' && <CodeExplorer />}

        {activeTab === 'audit' && <ArchitectureChecklist />}

        {activeTab === 'guide' && (
          <div className="w-full bg-[#0a0a0f] border border-neutral-800 rounded-2xl p-6 lg:p-8 shadow-2xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-red-500" />
                Android Studio & Device Deployment Guide
              </h2>
              <p className="text-sm text-neutral-400">
                Follow these exact steps to compile MARS Launcher, deploy to your phone or emulator, and set it as the default home app.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method 1: Android Studio */}
              <div className="p-5 rounded-xl bg-[#0f0f18] border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <span>METHOD 1</span> • <span>ANDROID STUDIO (GUI)</span>
                </div>
                <h3 className="text-base font-bold text-white">Opening & Running in Android Studio</h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                  <li>Download and extract the <code className="text-red-400 font-mono">mars-launcher-android-project.zip</code>.</li>
                  <li>Open <strong>Android Studio</strong> (Ladybug, Koala, Jellyfish, or newer).</li>
                  <li>Click <strong>Open</strong> and choose the extracted root folder.</li>
                  <li>Gradle syncs automatically using the included <strong>Version Catalog</strong> (AGP 8.7, Kotlin 2.0.21).</li>
                  <li>Attach a physical device via USB debugging or start an Android Virtual Device (AVD).</li>
                  <li>Press <strong>Shift + F10</strong> or click the green <strong>Run</strong> button.</li>
                </ol>
              </div>

              {/* Method 2: Gradle & ADB CLI */}
              <div className="p-5 rounded-xl bg-[#0f0f18] border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <span>METHOD 2</span> • <span>GRADLE & ADB COMMAND LINE</span>
                </div>
                <h3 className="text-base font-bold text-white">Building & Installing via CLI</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[11px] text-neutral-400 mb-1">Assemble Debug APK:</div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-black font-mono text-neutral-300 border border-neutral-900">
                      <code>./gradlew assembleDebug</code>
                      <button 
                        onClick={() => copyToClipboard('./gradlew assembleDebug', 'build')}
                        className="text-neutral-500 hover:text-white"
                      >
                        {copiedCmd === 'build' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-neutral-400 mb-1">Install to Connected Android Device:</div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-black font-mono text-neutral-300 border border-neutral-900">
                      <code>adb install -r app/build/outputs/apk/debug/app-debug.apk</code>
                      <button 
                        onClick={() => copyToClipboard('adb install -r app/build/outputs/apk/debug/app-debug.apk', 'install')}
                        className="text-neutral-500 hover:text-white"
                      >
                        {copiedCmd === 'install' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selecting as Default Home Screen */}
            <div className="p-5 rounded-xl bg-red-950/20 border border-red-600/40 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                Selecting MARS Launcher as Your Default Home Screen
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                By Android design and security requirements, a launcher application cannot forcefully set itself as default. Android prompts the user or directs them to system settings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-black/60 rounded-lg border border-neutral-900">
                  <div className="font-bold text-white mb-1">1. Home Button Press</div>
                  <div className="text-neutral-400">Press Home gesture/button. Android prompts &quot;Use MARS Launcher as Home&quot; → tap <strong>Always</strong>.</div>
                </div>
                <div className="p-3 bg-black/60 rounded-lg border border-neutral-900">
                  <div className="font-bold text-white mb-1">2. In-App Launcher Settings</div>
                  <div className="text-neutral-400">Open MARS Launcher Settings → tap <strong>Set as Default Home Launcher</strong> to fire <code className="text-red-400">ACTION_HOME_SETTINGS</code>.</div>
                </div>
                <div className="p-3 bg-black/60 rounded-lg border border-neutral-900">
                  <div className="font-bold text-white mb-1">3. Android System Settings</div>
                  <div className="text-neutral-400">Settings → Apps → Default Apps → Home app → Select <strong>MARS Launcher</strong>.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cyber Footer */}
      <footer className="border-t border-neutral-900 px-6 py-4 text-center text-xs font-mono text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>MARS LAUNCHER CORE // KOTLIN + JETPACK COMPOSE // com.mars.launcher</span>
        </div>
        <div>
          <span>AMOLED BLACK #000000 • TARGET SDK 35 • MIN SDK 26</span>
        </div>
      </footer>
    </div>
  );
}
