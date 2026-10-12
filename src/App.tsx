import React, { useState } from 'react';
import { AndroidDeviceSimulator } from './components/AndroidDeviceSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureChecklist } from './components/ArchitectureChecklist';
import { exportAndroidProjectZip } from './utils/projectExporter';
import { 
  Home, Smartphone, FolderTree, ShieldCheck, 
  Download, Terminal, Copy, Check, ExternalLink,
  Flame, Radio, Compass, Layers, Github, Play
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
    <div className="min-h-screen bg-[#090a10] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0e1017]/90 backdrop-blur-md border-b border-neutral-800 px-4 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/30 flex items-center justify-center shadow-lg shadow-blue-900/30">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wide text-white">MARS Launcher</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-950 text-blue-400 border border-blue-800/40">
                One UI & Lawnchair Style
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Базовый Android-лаунчер на Jetpack Compose • <span className="text-blue-400 font-mono">com.mars.launcher</span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#151722] rounded-2xl border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition font-medium ${
              activeTab === 'simulator' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Симулятор</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition font-medium ${
              activeTab === 'code' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Исходный код</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition font-medium ${
              activeTab === 'audit' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Проверка Android</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition font-medium ${
              activeTab === 'guide' ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Сборка APK</span>
          </button>
        </div>

        {/* Action Button: Export ZIP */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide flex items-center gap-2 shadow-lg shadow-blue-600/30 transition transform active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Упаковка...' : 'Скачать проект (.ZIP)'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col">
        {activeTab === 'simulator' && <AndroidDeviceSimulator />}

        {activeTab === 'code' && <CodeExplorer />}

        {activeTab === 'audit' && <ArchitectureChecklist />}

        {activeTab === 'guide' && (
          <div className="w-full bg-[#10121b] border border-neutral-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-500" />
                Инструкция по сборке APK и установке
              </h2>
              <p className="text-sm text-neutral-400">
                Выберите наиболее удобный для вас способ собрать готовый установочный файл APK.
              </p>
            </div>

            {/* GitHub Actions Highlight (No PC needed) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Github className="w-4 h-4" />
                  <span>САМЫЙ ПРОСТОЙ СПОСОБ: БЕСПЛАТНАЯ СБОРКА В ОБЛАКЕ GITHUB ACTIONS</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600/30 text-blue-300 font-mono">
                  Без компьютера
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                В проект уже добавлен готовый сценарий <code className="text-blue-300 font-mono">.github/workflows/build.yml</code>.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-neutral-300">
                <li>Нажмите <strong>«Скачать проект (.ZIP)»</strong> и загрузите файлы в свой репозиторий на GitHub.</li>
                <li>Перейдите во вкладку <strong>Actions</strong> на GitHub — сборка начнется автоматически.</li>
                <li>Через 2 минуты скачайте готовый <strong>app-debug.apk</strong> прямо из раздела Artifacts на телефон!</li>
              </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method 1: Android Studio */}
              <div className="p-5 rounded-2xl bg-[#141622] border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  <span>СПОСОБ 2</span> • <span>ANDROID STUDIO</span>
                </div>
                <h3 className="text-base font-bold text-white">Через Android Studio на ПК</h3>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-300 leading-relaxed">
                  <li>Распакуйте скачанный ZIP-архив.</li>
                  <li>Откройте <strong>Android Studio</strong> (Ladybug, Koala или Jellyfish).</li>
                  <li>Нажмите <strong>Open</strong> и выберите папку проекта.</li>
                  <li>Синхронизация Gradle пройдет автоматически по <code className="text-blue-400 font-mono">libs.versions.toml</code>.</li>
                  <li>Нажмите <strong>Build → Build Bundle(s) / APK(s) → Build APK(s)</strong> или кнопку <strong>Run</strong>.</li>
                </ol>
              </div>

              {/* Method 2: Gradle CLI */}
              <div className="p-5 rounded-2xl bg-[#141622] border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  <span>СПОСОБ 3</span> • <span>КОНСОЛЬ GRADLE & ADB</span>
                </div>
                <h3 className="text-base font-bold text-white">Через терминал</h3>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[11px] text-neutral-400 mb-1">Сборка Debug APK:</div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 font-mono text-neutral-300 border border-neutral-800">
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
                    <div className="text-[11px] text-neutral-400 mb-1">Установка на телефон через USB:</div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 font-mono text-neutral-300 border border-neutral-800">
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

            {/* Default launcher guide */}
            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Как назначить лаунчер основным на телефоне
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                По правилам безопасности Android сторонний лаунчер не может назначить себя сам втихую — пользователь должен подтвердить выбор:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
                  <div className="font-bold text-white mb-1">1. Кнопка Домой</div>
                  <div className="text-neutral-400">Нажмите кнопку «Домой». Android спросит «Использовать MARS Launcher» → выберите <strong>Всегда</strong>.</div>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
                  <div className="font-bold text-white mb-1">2. В настройках лаунчера</div>
                  <div className="text-neutral-400">Откройте Настройки лаунчера → нажмите <strong>«Выбрать лаунчером по умолчанию»</strong>.</div>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-neutral-800">
                  <div className="font-bold text-white mb-1">3. Настройки телефона</div>
                  <div className="text-neutral-400">Настройки → Приложения → Приложения по умолчанию → Главный экран → <strong>MARS Launcher</strong>.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-4 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>MARS Launcher • Kotlin + Jetpack Compose • com.mars.launcher</span>
        </div>
        <div>
          <span>Стили: One UI / Lawnchair / МТС • SDK 26–35</span>
        </div>
      </footer>
    </div>
  );
}
