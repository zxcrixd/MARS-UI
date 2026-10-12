import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, Grid, Settings as SettingsIcon, Star, Info, 
  Trash2, RefreshCw, Smartphone, Radio, ArrowLeft,
  ShieldCheck, Check, ChevronRight, Mic, Plus, Minus,
  Layers, Palette, Sliders, Sparkles, ExternalLink,
  Clock, Move, GripVertical
} from 'lucide-react';

export interface SimulatedApp {
  id: string;
  name: string;
  packageName: string;
  color: string;
  glyph: string;
  isFavorite: boolean; // whether on desktop
  isDocked: boolean;   // whether in bottom dock
}

const INITIAL_APPS: SimulatedApp[] = [
  { id: 'phone', name: 'Телефон', packageName: 'com.android.dialer', color: '#16a34a', glyph: '📞', isFavorite: false, isDocked: true },
  { id: 'messages', name: 'Сообщения', packageName: 'com.android.messaging', color: '#2563eb', glyph: '💬', isFavorite: false, isDocked: true },
  { id: 'chrome', name: 'Браузер', packageName: 'com.android.chrome', color: '#ea580c', glyph: '🌐', isFavorite: false, isDocked: true },
  { id: 'camera', name: 'Камера', packageName: 'com.android.camera2', color: '#dc2626', glyph: '📷', isFavorite: false, isDocked: true },
  { id: 'gallery', name: 'Галерея', packageName: 'com.android.gallery3d', color: '#9333ea', glyph: '🖼️', isFavorite: true, isDocked: false },
  { id: 'music', name: 'Музыка', packageName: 'com.spotify.music', color: '#059669', glyph: '🎵', isFavorite: true, isDocked: false },
  { id: 'calc', name: 'Калькулятор', packageName: 'com.android.calculator2', color: '#d97706', glyph: '🔢', isFavorite: true, isDocked: false },
  { id: 'settings', name: 'Настройки', packageName: 'com.android.settings', color: '#475569', glyph: '⚙️', isFavorite: true, isDocked: false },
  { id: 'notes', name: 'Заметки', packageName: 'com.android.notes', color: '#ca8a04', glyph: '📝', isFavorite: false, isDocked: false },
  { id: 'clock', name: 'Часы', packageName: 'com.android.deskclock', color: '#0284c7', glyph: '⏱️', isFavorite: false, isDocked: false },
  { id: 'files', name: 'Файлы', packageName: 'com.android.documentsui', color: '#4f46e5', glyph: '📁', isFavorite: false, isDocked: false },
  { id: 'maps', name: 'Карты', packageName: 'com.google.android.apps.maps', color: '#0d9488', glyph: '🗺️', isFavorite: false, isDocked: false }
];

export const AndroidDeviceSimulator: React.FC = () => {
  const [apps, setApps] = useState<SimulatedApp[]>(INITIAL_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [screenMode, setScreenMode] = useState<'desktop' | 'drawer' | 'settings'>('desktop');
  const [activeRunningApp, setActiveRunningApp] = useState<SimulatedApp | null>(null);
  const [selectedDialogApp, setSelectedDialogApp] = useState<SimulatedApp | null>(null);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [showClockDialog, setShowClockDialog] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState('');

  // Lawnchair & Mars Settings
  const [showClockWidget, setShowClockWidget] = useState<boolean>(true);
  const [showDockSearch, setShowDockSearch] = useState<boolean>(true);
  const [iconStyle, setIconStyle] = useState<'squircle' | 'circle' | 'rounded'>('squircle');
  const [homeCols, setHomeCols] = useState<number>(4);
  const [drawerCols, setDrawerCols] = useState<number>(4);
  const [isAmoled, setIsAmoled] = useState<boolean>(false);
  const [showDefaultDialog, setShowDefaultDialog] = useState<boolean>(false);
  const [isDefaultLauncherSet, setIsDefaultLauncherSet] = useState<boolean>(false);

  // Drag and drop state
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Time & Date
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(currentTime.getHours())}:${pad(currentTime.getMinutes())}`;
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }, [currentTime]);

  // Filtering
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const q = searchQuery.toLowerCase().trim();
    return apps.filter(a => a.name.toLowerCase().includes(q) || a.packageName.toLowerCase().includes(q));
  }, [apps, searchQuery]);

  const desktopApps = useMemo(() => apps.filter(a => a.isFavorite && !a.isDocked), [apps]);
  const dockApps = useMemo(() => apps.filter(a => a.isDocked).slice(0, 5), [apps]);

  const toggleDesktopApp = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, isFavorite: !a.isFavorite } : a));
    setSelectedDialogApp(null);
  };

  const uninstallApp = (appId: string) => {
    setApps(prev => prev.filter(a => a.id !== appId));
    setSelectedDialogApp(null);
  };

  const getIconRadius = () => {
    switch (iconStyle) {
      case 'circle': return 'rounded-full';
      case 'squircle': return 'rounded-[18px]';
      case 'rounded': return 'rounded-xl';
    }
  };

  // Drag and Drop handlers for desktop
  const handleDragStart = (id: string) => {
    setDraggedAppId(id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggedAppId) return;
    
    // Find dragged app
    const appIndex = apps.findIndex(a => a.id === draggedAppId);
    if (appIndex === -1) return;

    // If app was dragged from drawer to desktop, make it favorite
    setApps(prev => {
      const updated = [...prev];
      const targetApp = updated[appIndex];
      if (!targetApp.isFavorite) {
        updated[appIndex] = { ...targetApp, isFavorite: true, isDocked: false };
      }
      return updated;
    });

    setDraggedAppId(null);
    setDragOverIndex(null);
  };

  const triggerMarsAiSearch = (queryToSearch: string) => {
    setAiQuery(queryToSearch);
    setShowAiModal(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 lg:p-6 select-none">
      {/* Device Body */}
      <div className="relative w-[360px] sm:w-[390px] h-[780px] bg-neutral-950 rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-red-950/40 flex flex-col overflow-hidden">
        
        {/* Punch-hole camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black z-50 flex items-center justify-center border border-neutral-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
        </div>

        {/* Inner Phone Screen */}
        <div 
          className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col font-sans text-white transition-colors duration-300 ${
            isAmoled ? 'bg-[#000000]' : 'bg-[#0d0f14]'
          }`}
          style={{
            backgroundImage: isAmoled 
              ? 'none' 
              : 'radial-gradient(circle at 50% 15%, #2a1114 0%, #12131a 60%, #0a0b0e 100%)'
          }}
        >
          {/* Status Bar */}
          <div className="w-full h-8 pt-1 px-6 flex items-center justify-between text-[12px] font-sans text-neutral-300 z-40 bg-transparent">
            <span className="font-medium">{formattedTime}</span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] text-red-400 font-bold">MARS 5G</span>
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <div className="w-4 h-2.5 border border-neutral-300 rounded-[2px] p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* MARS AI STUDIO INTEGRATION POPUP */}
          {showAiModal && (
            <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
              <div className="w-full bg-[#161822] border border-red-500/50 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">super-mars.ai.studio</h4>
                      <p className="text-[10px] text-neutral-400">Интегрированный AI ассистент лаунчера</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAiModal(false)} className="p-1 text-neutral-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-neutral-800 space-y-2">
                  <div className="text-[11px] text-neutral-400 font-mono">Ваш запрос:</div>
                  <div className="text-xs text-white font-medium bg-neutral-900/80 p-2 rounded-xl">
                    {aiQuery.trim() || 'Открыть главную страницу MARS AI Studio'}
                  </div>
                </div>

                <div className="text-xs text-neutral-300 leading-relaxed">
                  Поисковая строка напрямую связывается с <span className="text-red-400 font-mono">super-mars.ai.studio</span>. Нажмите кнопку ниже для перехода на сервис:
                </div>

                <div className="space-y-2">
                  <a
                    href={aiQuery.trim() ? `https://super-mars.ai.studio/?q=${encodeURIComponent(aiQuery.trim())}` : 'https://super-mars.ai.studio'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Перейти в super-mars.ai.studio</span>
                  </a>

                  <button
                    onClick={() => setShowAiModal(false)}
                    className="w-full py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium"
                  >
                    Вернуться в лаунчер
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE RUNNING APP MODAL */}
          {activeRunningApp && (
            <div className="absolute inset-0 z-50 bg-[#14151e] flex flex-col animate-in fade-in duration-150">
              <div className="h-14 px-4 bg-[#1c1e2b] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: activeRunningApp.color }}>
                    {activeRunningApp.glyph}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-tight">{activeRunningApp.name}</h3>
                    <p className="text-[10px] text-neutral-400 font-mono">{activeRunningApp.packageName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveRunningApp(null)}
                  className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 shadow-xl"
                  style={{ backgroundColor: activeRunningApp.color }}
                >
                  {activeRunningApp.glyph}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{activeRunningApp.name}</h4>
                <p className="text-xs text-neutral-400 max-w-[240px] mb-6">
                  Запущено нативное приложение через Android Intent.
                </p>
                <button
                  onClick={() => setActiveRunningApp(null)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  На главный экран
                </button>
              </div>

              {/* Navigation Bar */}
              <div className="h-10 bg-black/50 flex items-center justify-around text-neutral-400">
                <button onClick={() => setActiveRunningApp(null)} className="p-2 hover:text-white">◀</button>
                <button onClick={() => setActiveRunningApp(null)} className="p-2 hover:text-white">●</button>
                <button onClick={() => setScreenMode(screenMode === 'drawer' ? 'desktop' : 'drawer')} className="p-2 hover:text-white">■</button>
              </div>
            </div>
          )}

          {/* MAIN SCREEN VIEWPORT */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            
            {/* DESKTOP SCREEN */}
            {screenMode === 'desktop' && (
              <div 
                className="flex-1 flex flex-col px-4 pt-2 pb-2 justify-between overflow-y-auto"
                onContextMenu={(e) => { e.preventDefault(); setShowDesktopMenu(true); }}
              >
                {/* At a Glance Clock Widget (Removable on Long-Press!) */}
                {showClockWidget ? (
                  <div 
                    className="pt-2 px-2 cursor-pointer group relative rounded-2xl hover:bg-white/5 p-2 transition"
                    onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setShowClockDialog(true); }}
                    onClick={() => setShowClockDialog(true)}
                  >
                    <div className="text-5xl font-light tracking-tight text-white font-sans drop-shadow-sm">
                      {formattedTime}
                    </div>
                    <div className="text-sm font-medium text-neutral-300 capitalize mt-1 drop-shadow-sm flex items-center justify-between">
                      <span>{formattedDate}</span>
                      <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition">
                        Удерживайте для удаления
                      </span>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setShowClockWidget(true)}
                    className="p-2 text-center text-xs text-neutral-400 border border-dashed border-neutral-800 rounded-2xl cursor-pointer hover:border-red-500/50 transition my-2"
                  >
                    + Добавить виджет часов и даты
                  </div>
                )}

                {/* Desktop Apps Grid (User Controlled & Drag-and-Drop) */}
                <div 
                  className="flex-1 my-3 flex flex-col justify-start"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(desktopApps.length)}
                >
                  <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Рабочий стол ({desktopApps.length} прил.)
                    </span>
                    <span className="text-[10px] text-red-400 flex items-center gap-1">
                      <Move className="w-3 h-3" /> Перетаскивание активно
                    </span>
                  </div>

                  <div 
                    className="grid gap-y-4 gap-x-2 py-1"
                    style={{ gridTemplateColumns: `repeat(${homeCols}, minmax(0, 1fr))` }}
                  >
                    {desktopApps.map((app, idx) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={() => handleDragStart(app.id)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onClick={() => setActiveRunningApp(app)}
                        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedDialogApp(app); }}
                        className={`flex flex-col items-center cursor-grab active:cursor-grabbing group p-1 rounded-2xl transition ${
                          draggedAppId === app.id ? 'opacity-40 scale-95' : 'hover:bg-white/5'
                        }`}
                      >
                        <div 
                          className={`w-[52px] h-[52px] ${getIconRadius()} flex items-center justify-center text-2xl shadow-lg transition transform group-hover:scale-105 group-active:scale-95 border border-white/10`}
                          style={{ backgroundColor: app.color }}
                        >
                          {app.glyph}
                        </div>
                        <span className="text-[11px] text-neutral-200 mt-1.5 text-center truncate max-w-[70px] drop-shadow-sm font-normal">
                          {app.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {desktopApps.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-neutral-800 rounded-3xl text-neutral-400 text-xs">
                      <p className="font-medium text-white mb-1">Рабочий стол пуст</p>
                      <p className="text-[11px]">Откройте меню приложений снизу и добавьте нужные иконки.</p>
                    </div>
                  )}
                </div>

                {/* Bottom Dock Area (Lawnchair style with super-mars.ai.studio pill) */}
                <div className="mt-auto pt-2 pb-1 space-y-2">
                  {/* Lawnchair Dock Search Pill with MARS AI Studio button */}
                  {showDockSearch && (
                    <div className="w-full h-12 px-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-md">
                      <div 
                        onClick={() => setScreenMode('drawer')}
                        className="flex-1 flex items-center gap-2.5 text-neutral-300 text-xs cursor-pointer"
                      >
                        <Search className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-400">Поиск или MARS AI...</span>
                      </div>

                      {/* Direct MARS AI Studio Button */}
                      <button
                        onClick={() => triggerMarsAiSearch('')}
                        className="px-2.5 py-1 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-400 text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition"
                        title="Интеграция super-mars.ai.studio"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-red-400" />
                        <span>AI Studio</span>
                      </button>
                    </div>
                  )}

                  {/* Dock Apps Bar */}
                  <div className="w-full px-3 py-2 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-around shadow-lg">
                    {dockApps.map(app => (
                      <div
                        key={app.id}
                        onClick={() => setActiveRunningApp(app)}
                        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedDialogApp(app); }}
                        className={`w-11 h-11 ${getIconRadius()} flex items-center justify-center text-xl cursor-pointer hover:scale-105 active:scale-95 transition shadow-sm border border-white/10`}
                        style={{ backgroundColor: app.color }}
                        title={app.name}
                      >
                        {app.glyph}
                      </div>
                    ))}
                    
                    {/* App drawer toggle button */}
                    <div
                      onClick={() => setScreenMode('drawer')}
                      className="w-11 h-11 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center text-white cursor-pointer hover:bg-red-600/50 active:scale-95 transition"
                      title="Меню приложений"
                    >
                      <Grid className="w-5 h-5 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APP DRAWER SCREEN */}
            {screenMode === 'drawer' && (
              <div className="flex-1 flex flex-col px-4 pt-2 pb-2 bg-[#0c0d14]/95 backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-200">
                {/* Search Bar Top with Settings & AI Buttons */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => { setSearchQuery(''); setScreenMode('desktop'); }}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Поиск или MARS AI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          triggerMarsAiSearch(searchQuery);
                        }
                      }}
                      className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-20 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:bg-white/15"
                    />
                    
                    {/* super-mars.ai.studio quick trigger */}
                    <button
                      onClick={() => triggerMarsAiSearch(searchQuery)}
                      className="absolute right-2 px-2 py-0.5 rounded-full bg-red-600/40 border border-red-500/40 text-[10px] text-red-300 font-bold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-red-400" />
                      <span>AI</span>
                    </button>
                  </div>

                  {/* Direct Launcher Settings Gear */}
                  <button
                    onClick={() => setScreenMode('settings')}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-300"
                    title="Настройки лаунчера"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Subtitle count */}
                <div className="flex justify-between items-center text-[11px] text-neutral-400 px-2 mb-2 font-medium">
                  <span>Все приложения ({filteredApps.length})</span>
                  <span className="text-red-400 font-mono">Lawnchair + MARS</span>
                </div>

                {/* Drawer Grid (Can drag to desktop!) */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredApps.length > 0 ? (
                    <div 
                      className="grid gap-y-5 gap-x-2 py-2"
                      style={{ gridTemplateColumns: `repeat(${drawerCols}, minmax(0, 1fr))` }}
                    >
                      {filteredApps.map(app => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={() => handleDragStart(app.id)}
                          onClick={() => setActiveRunningApp(app)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                          className="flex flex-col items-center p-1.5 rounded-2xl hover:bg-white/5 cursor-pointer group transition"
                        >
                          <div 
                            className={`w-[50px] h-[50px] ${getIconRadius()} flex items-center justify-center text-2xl shadow-md transition transform group-hover:scale-105 group-active:scale-95 border border-white/10`}
                            style={{ backgroundColor: app.color }}
                          >
                            {app.glyph}
                          </div>
                          <span className="text-[11px] text-neutral-200 mt-1.5 text-center truncate w-full px-1">
                            {app.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                      <p className="text-sm text-neutral-300 font-medium">Приложений не найдено</p>
                      <button
                        onClick={() => triggerMarsAiSearch(searchQuery)}
                        className="mt-3 px-4 py-2 rounded-xl bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-red-400" />
                        <span>Спросить в super-mars.ai.studio</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Close Drawer Button */}
                <button
                  onClick={() => { setSearchQuery(''); setScreenMode('desktop'); }}
                  className="w-full py-2.5 mt-2 rounded-2xl bg-white/10 hover:bg-white/15 text-neutral-300 text-xs font-medium"
                >
                  Закрыть меню
                </button>
              </div>
            )}

            {/* SETTINGS SCREEN */}
            {screenMode === 'settings' && (
              <div className="flex-1 flex flex-col px-4 pt-2 pb-2 bg-[#0e1017] overflow-y-auto animate-in slide-in-from-right-6 duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setScreenMode('desktop')}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-semibold text-white">
                    Настройки MARS Launcher
                  </h3>
                </div>

                {/* Default Launcher Action Banner */}
                <div 
                  onClick={() => setShowDefaultDialog(true)}
                  className="p-3.5 mb-3 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center gap-3 cursor-pointer hover:bg-red-600/30 transition"
                >
                  <ShieldCheck className="w-6 h-6 text-red-400 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      Лаунчер по умолчанию
                      {isDefaultLauncherSet && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      {isDefaultLauncherSet ? 'Выбран основным домашним экраном' : 'Нажмите для перехода в настройки Android'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400" />
                </div>

                {/* MARS AI Studio Link Card */}
                <div 
                  onClick={() => triggerMarsAiSearch('')}
                  className="p-3.5 mb-3 rounded-2xl bg-gradient-to-r from-red-950/40 to-neutral-900 border border-red-500/40 flex items-center gap-3 cursor-pointer hover:border-red-400 transition"
                >
                  <Sparkles className="w-6 h-6 text-red-400 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1">
                      super-mars.ai.studio
                      <ExternalLink className="w-3 h-3 text-red-400" />
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      Прямая интеграция поисковой строки с AI ассистентом
                    </p>
                  </div>
                </div>

                {/* Settings list */}
                <div className="space-y-2.5 pb-4">
                  <div className="text-[11px] font-semibold text-neutral-400 px-1">
                    ГЛАВНЫЙ ЭКРАН И ВИДЖЕТЫ
                  </div>

                  {/* Clock Widget Toggle */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Виджет часов и даты</div>
                      <div className="text-[10px] text-neutral-400">Отображать время на рабочем столе</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showClockWidget}
                      onChange={(e) => setShowClockWidget(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Dock Search Toggle */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Строка поиска MARS AI в доке</div>
                      <div className="text-[10px] text-neutral-400">Стиль Lawnchair с кнопкой AI Studio</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showDockSearch}
                      onChange={(e) => setShowDockSearch(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Home Grid */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Сетка рабочего стола</div>
                      <div className="text-[10px] text-neutral-400">{homeCols}x5 колонок</div>
                    </div>
                    <div className="flex gap-1.5">
                      {[4, 5].map(cols => (
                        <button
                          key={cols}
                          onClick={() => setHomeCols(cols)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${homeCols === cols ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'}`}
                        >
                          {cols}x5
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drawer Grid */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Сетка меню приложений</div>
                      <div className="text-[10px] text-neutral-400">{drawerCols} колонки в ряду</div>
                    </div>
                    <div className="flex gap-1.5">
                      {[4, 5].map(cols => (
                        <button
                          key={cols}
                          onClick={() => setDrawerCols(cols)}
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${drawerCols === cols ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'}`}
                        >
                          {cols}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-400 px-1 pt-1">
                    ОФОРМЛЕНИЕ ИКОНОК
                  </div>

                  {/* Icon Shape */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Форма иконок</div>
                      <div className="text-[10px] text-neutral-400">Стиль Lawnchair</div>
                    </div>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'squircle', label: 'Сквиркл' },
                        { id: 'circle', label: 'Круг' },
                        { id: 'rounded', label: 'Квадрат' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setIconStyle(s.id as any)}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition ${iconStyle === s.id ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AMOLED */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Глубокий черный (AMOLED)</div>
                      <div className="text-[10px] text-neutral-400">Чистый черный цвет #000000</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={isAmoled}
                      onChange={(e) => setIsAmoled(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CLOCK WIDGET REMOVAL DIALOG */}
          {showClockDialog && (
            <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in">
              <div className="w-full bg-[#1c1d29] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-3">
                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                  <Clock className="w-5 h-5 text-red-400" />
                  <h4 className="text-sm font-bold text-white">Виджет часов и даты</h4>
                </div>

                <button
                  onClick={() => { setShowClockWidget(false); setShowClockDialog(false); }}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 text-xs flex items-center gap-3 transition font-medium"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Удалить виджет с главного экрана</span>
                </button>

                <button
                  onClick={() => { setShowClockDialog(false); setScreenMode('settings'); }}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-white/10 text-white text-xs flex items-center gap-3 transition"
                >
                  <SettingsIcon className="w-4 h-4 text-neutral-400" />
                  <span>Настройки лаунчера</span>
                </button>

                <button
                  onClick={() => setShowClockDialog(false)}
                  className="w-full py-2 text-center text-xs text-neutral-400 hover:text-white"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* APP CONTEXT DIALOG (Long press on app) */}
          {selectedDialogApp && (
            <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 animate-in fade-in">
              <div className="w-full bg-[#1e202c] border border-white/10 rounded-3xl p-4 shadow-2xl space-y-2">
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: selectedDialogApp.color }}>
                    {selectedDialogApp.glyph}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{selectedDialogApp.name}</h4>
                    <p className="text-[11px] text-neutral-400">{selectedDialogApp.packageName}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleDesktopApp(selectedDialogApp.id)}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-white/10 text-white text-xs flex items-center gap-3 transition"
                >
                  {selectedDialogApp.isFavorite ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-red-400" />}
                  <span>{selectedDialogApp.isFavorite ? 'Убрать с главного экрана' : 'Добавить на главный экран'}</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Информация о приложении:\nПакет: ${selectedDialogApp.packageName}\nActivity: android.intent.action.MAIN`);
                    setSelectedDialogApp(null);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-white/10 text-white text-xs flex items-center gap-3 transition"
                >
                  <Info className="w-4 h-4 text-neutral-400" />
                  <span>О приложении</span>
                </button>

                <button
                  onClick={() => uninstallApp(selectedDialogApp.id)}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-3 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Удалить</span>
                </button>

                <button
                  onClick={() => setSelectedDialogApp(null)}
                  className="w-full py-2 text-center text-xs text-neutral-400 hover:text-white pt-2 border-t border-white/10"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* DESKTOP CONTEXT MENU (Long press on empty desktop space) */}
          {showDesktopMenu && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end p-4 animate-in fade-in">
              <div className="w-full bg-[#1c1e29] rounded-3xl p-4 shadow-2xl space-y-2 border border-white/10">
                <h4 className="text-xs font-semibold text-neutral-400 px-2 pb-1">Главный экран MARS</h4>
                
                <button
                  onClick={() => { setShowDesktopMenu(false); setScreenMode('settings'); }}
                  className="w-full py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-3 transition font-medium"
                >
                  <SettingsIcon className="w-4 h-4 text-red-400" />
                  <span>Настройки лаунчера</span>
                </button>

                {!showClockWidget && (
                  <button
                    onClick={() => { setShowDesktopMenu(false); setShowClockWidget(true); }}
                    className="w-full py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-3 transition font-medium"
                  >
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>Добавить виджет часов и даты</span>
                  </button>
                )}

                <button
                  onClick={() => { setShowDesktopMenu(false); setScreenMode('drawer'); }}
                  className="w-full py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-3 transition font-medium"
                >
                  <Grid className="w-4 h-4 text-red-400" />
                  <span>Все приложения</span>
                </button>

                <button
                  onClick={() => setShowDesktopMenu(false)}
                  className="w-full py-2 text-center text-xs text-neutral-400 hover:text-white"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}

          {/* DEFAULT LAUNCHER SYSTEM DIALOG */}
          {showDefaultDialog && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
              <div className="w-full bg-[#181a24] border border-red-500/50 rounded-3xl p-5 text-center space-y-3 shadow-2xl">
                <ShieldCheck className="w-10 h-10 text-red-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Выбор основного лаунчера</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Android открывает окно <code className="text-red-300 font-mono text-[11px]">Settings.ACTION_HOME_SETTINGS</code>.
                </p>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-left space-y-2">
                  <div 
                    onClick={() => { setIsDefaultLauncherSet(true); setShowDefaultDialog(false); }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-red-600/30 border border-red-500 cursor-pointer hover:bg-red-600/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-bold">🚀</span>
                      <span className="text-xs font-semibold text-white">MARS Launcher</span>
                    </div>
                    <span className="text-[10px] text-red-300 font-medium">ВЫБРАТЬ</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-neutral-400">
                    <span className="text-xs">Lawnchair / One UI Home</span>
                    <span className="text-[10px]">СИСТЕМНЫЙ</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDefaultDialog(false)}
                  className="w-full py-2.5 rounded-xl bg-white/10 text-xs text-neutral-300 hover:text-white"
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}

          {/* Android Navigation Bar */}
          <div className="w-full h-8 bg-black/40 flex items-center justify-around text-neutral-400 text-xs">
            <button 
              onClick={() => {
                if (screenMode !== 'desktop') setScreenMode('desktop');
              }} 
              className="px-6 py-1 hover:text-white transition"
            >
              ◀
            </button>
            <button 
              onClick={() => {
                setScreenMode('desktop');
                setSearchQuery('');
              }} 
              className="px-6 py-1 hover:text-white transition"
            >
              ●
            </button>
            <button 
              onClick={() => setScreenMode(screenMode === 'drawer' ? 'desktop' : 'drawer')} 
              className="px-6 py-1 hover:text-white transition"
            >
              ■
            </button>
          </div>

        </div>
      </div>

      {/* Simulator Control & Features Panel */}
      <div className="max-w-md w-full bg-[#10121a] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-bold text-white tracking-wide">Панель управления MARS</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-red-950/80 text-red-400 border border-red-800/40">
            Lawnchair + MARS AI
          </span>
        </div>

        {/* super-mars.ai.studio Integration Callout */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/30 to-neutral-900 border border-red-500/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              Интеграция super-mars.ai.studio
            </span>
            <span className="text-[10px] text-green-400 font-mono font-bold">ПОДКЛЮЧЕНО</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            В поисковую строку встроен переход в <strong>super-mars.ai.studio</strong>. Нажмите кнопку «AI Studio» в поиске смартфона или введите любой запрос.
          </p>
          <button
            onClick={() => triggerMarsAiSearch('')}
            className="w-full py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Открыть диалог MARS AI</span>
          </button>
        </div>

        {/* Direct Actions */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setScreenMode('settings')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <SettingsIcon className="w-4 h-4 text-red-400" />
            <span>Настройки лаунчера</span>
          </button>
          <button
            onClick={() => setShowClockWidget(!showClockWidget)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <Clock className="w-4 h-4 text-red-400" />
            <span>{showClockWidget ? 'Скрыть виджет часов' : 'Показать виджет часов'}</span>
          </button>
          <button
            onClick={() => setScreenMode('drawer')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <Grid className="w-4 h-4 text-red-400" />
            <span>Меню приложений</span>
          </button>
          <button
            onClick={() => setShowDefaultDialog(true)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Лаунчер по умолчанию</span>
          </button>
        </div>

        {/* Features Checklist */}
        <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-2 text-xs">
          <div className="font-semibold text-neutral-300 text-xs">
            Реализованные функции:
          </div>
          <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span><strong>Интеграция super-mars.ai.studio</strong> прямо в строке поиска</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span><strong>Удаление виджета часов:</strong> долгое нажатие на часы или в настройках</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span><strong>Drag-and-Drop:</strong> перетаскивание иконок по экрану</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span><strong>Только выбранные приложения:</strong> каталог не сбрасывается скопом</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300 text-[11px]">
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span><strong>Настройки лаунчера:</strong> шестеренка в меню + долгий тап по экрану</span>
          </div>
        </div>
      </div>
    </div>
  );
};
