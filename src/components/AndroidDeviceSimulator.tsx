import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, Grid, Settings as SettingsIcon, Star, Info, 
  Trash2, RefreshCw, Smartphone, Radio, ArrowLeft,
  ShieldCheck, Check, ChevronRight, Mic, Plus, Minus,
  Layers, Palette, Sliders
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

const DEFAULT_APPS: SimulatedApp[] = [
  { id: 'phone', name: 'Телефон', packageName: 'com.android.dialer', color: '#22c55e', glyph: '📞', isFavorite: true, isDocked: true },
  { id: 'messages', name: 'Сообщения', packageName: 'com.android.messaging', color: '#3b82f6', glyph: '💬', isFavorite: true, isDocked: true },
  { id: 'chrome', name: 'Браузер', packageName: 'com.android.chrome', color: '#ea580c', glyph: '🌐', isFavorite: true, isDocked: true },
  { id: 'camera', name: 'Камера', packageName: 'com.android.camera2', color: '#dc2626', glyph: '📷', isFavorite: true, isDocked: true },
  { id: 'gallery', name: 'Галерея', packageName: 'com.android.gallery3d', color: '#9333ea', glyph: '🖼️', isFavorite: true, isDocked: false },
  { id: 'settings', name: 'Настройки', packageName: 'com.android.settings', color: '#64748b', glyph: '⚙️', isFavorite: true, isDocked: false },
  { id: 'music', name: 'Музыка', packageName: 'com.spotify.music', color: '#10b981', glyph: '🎵', isFavorite: true, isDocked: false },
  { id: 'calc', name: 'Калькулятор', packageName: 'com.android.calculator2', color: '#f59e0b', glyph: '🔢', isFavorite: true, isDocked: false },
  { id: 'notes', name: 'Заметки', packageName: 'com.android.notes', color: '#eab308', glyph: '📝', isFavorite: false, isDocked: false },
  { id: 'clock', name: 'Часы', packageName: 'com.android.deskclock', color: '#0ea5e9', glyph: '⏱️', isFavorite: false, isDocked: false },
  { id: 'files', name: 'Файлы', packageName: 'com.android.documentsui', color: '#6366f1', glyph: '📁', isFavorite: false, isDocked: false },
  { id: 'maps', name: 'Карты', packageName: 'com.google.android.apps.maps', color: '#14b8a6', glyph: '🗺️', isFavorite: false, isDocked: false }
];

export const AndroidDeviceSimulator: React.FC = () => {
  const [apps, setApps] = useState<SimulatedApp[]>(DEFAULT_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [screenMode, setScreenMode] = useState<'desktop' | 'drawer' | 'settings'>('desktop');
  const [activeRunningApp, setActiveRunningApp] = useState<SimulatedApp | null>(null);
  const [selectedDialogApp, setSelectedDialogApp] = useState<SimulatedApp | null>(null);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  
  // Customization (Lawnchair / One UI options)
  const [iconStyle, setIconStyle] = useState<'squircle' | 'circle' | 'rounded'>('squircle');
  const [launcherPreset, setLauncherPreset] = useState<'oneui' | 'lawnchair' | 'mts'>('oneui');
  const [homeCols, setHomeCols] = useState<number>(4);
  const [drawerCols, setDrawerCols] = useState<number>(4);
  const [showDockSearch, setShowDockSearch] = useState<boolean>(true);
  const [isAmoled, setIsAmoled] = useState<boolean>(false);
  const [isDefaultLauncherSet, setIsDefaultLauncherSet] = useState<boolean>(false);
  const [showDefaultDialog, setShowDefaultDialog] = useState<boolean>(false);

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

  const toggleFavorite = (appId: string) => {
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

  // Preset switch
  const applyPreset = (preset: 'oneui' | 'lawnchair' | 'mts') => {
    setLauncherPreset(preset);
    if (preset === 'oneui') {
      setIconStyle('squircle');
      setShowDockSearch(false);
      setIsAmoled(false);
    } else if (preset === 'lawnchair') {
      setIconStyle('circle');
      setShowDockSearch(true);
      setIsAmoled(false);
    } else if (preset === 'mts') {
      setIconStyle('squircle');
      setShowDockSearch(true);
      setIsAmoled(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 lg:p-6 select-none">
      {/* Device Body */}
      <div className="relative w-[360px] sm:w-[390px] h-[780px] bg-neutral-950 rounded-[48px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50 flex flex-col overflow-hidden">
        
        {/* Punch-hole camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black z-50 flex items-center justify-center border border-neutral-800">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
        </div>

        {/* Inner Phone Screen */}
        <div 
          className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col font-sans text-white transition-colors duration-300 ${
            isAmoled ? 'bg-[#000000]' : 'bg-[#121319]'
          }`}
          style={{
            backgroundImage: isAmoled 
              ? 'none' 
              : 'radial-gradient(circle at 50% 20%, #1e2230 0%, #10121a 75%, #0d0f14 100%)'
          }}
        >
          {/* Status Bar */}
          <div className="w-full h-8 pt-1 px-6 flex items-center justify-between text-[12px] font-sans text-neutral-300 z-40 bg-transparent">
            <span className="font-medium">{formattedTime}</span>
            <div className="flex items-center gap-2 text-xs">
              <span>LTE</span>
              <Radio className="w-3.5 h-3.5" />
              <div className="w-4 h-2.5 border border-neutral-300 rounded-[2px] p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* ACTIVE RUNNING APP MODAL */}
          {activeRunningApp && (
            <div className="absolute inset-0 z-50 bg-[#161722] flex flex-col animate-in fade-in duration-150">
              <div className="h-14 px-4 bg-[#20212f] border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg`} style={{ backgroundColor: activeRunningApp.color }}>
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg transition"
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
                {/* At a Glance / One UI Clock Widget */}
                <div className="pt-2 px-2 cursor-pointer" onClick={() => setShowDesktopMenu(true)}>
                  <div className="text-5xl font-light tracking-tight text-white font-sans drop-shadow-sm">
                    {formattedTime}
                  </div>
                  <div className="text-sm font-medium text-neutral-300 capitalize mt-1 drop-shadow-sm">
                    {formattedDate}
                  </div>
                </div>

                {/* Desktop Apps Grid */}
                <div className="flex-1 my-4 flex flex-col justify-start">
                  <div 
                    className="grid gap-y-5 gap-x-2 py-2"
                    style={{ gridTemplateColumns: `repeat(${homeCols}, minmax(0, 1fr))` }}
                  >
                    {desktopApps.map(app => (
                      <div
                        key={app.id}
                        onClick={() => setActiveRunningApp(app)}
                        onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                        className="flex flex-col items-center cursor-pointer group"
                      >
                        <div 
                          className={`w-[52px] h-[52px] ${getIconRadius()} flex items-center justify-center text-2xl shadow-md transition transform group-hover:scale-105 group-active:scale-95`}
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
                </div>

                {/* Bottom Dock Area (Lawnchair / One UI style) */}
                <div className="mt-auto pt-2 pb-1 space-y-2.5">
                  {/* Dock Search Pill (Lawnchair / Pixel style) */}
                  {showDockSearch && (
                    <div 
                      onClick={() => setScreenMode('drawer')}
                      className="w-full h-11 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/15 transition shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 text-neutral-300 text-xs">
                        <Search className="w-4 h-4 text-neutral-300" />
                        <span>Поиск приложений...</span>
                      </div>
                      <Mic className="w-4 h-4 text-neutral-300" />
                    </div>
                  )}

                  {/* Dock Apps Bar */}
                  <div className="w-full px-3 py-2 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-around shadow-lg">
                    {dockApps.map(app => (
                      <div
                        key={app.id}
                        onClick={() => setActiveRunningApp(app)}
                        onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                        className={`w-11 h-11 ${getIconRadius()} flex items-center justify-center text-xl cursor-pointer hover:scale-105 active:scale-95 transition shadow-sm`}
                        style={{ backgroundColor: app.color }}
                        title={app.name}
                      >
                        {app.glyph}
                      </div>
                    ))}
                    
                    {/* App drawer toggle button */}
                    <div
                      onClick={() => setScreenMode('drawer')}
                      className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 active:scale-95 transition"
                      title="Меню приложений"
                    >
                      <Grid className="w-5 h-5 text-neutral-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APP DRAWER SCREEN (One UI & Lawnchair style) */}
            {screenMode === 'drawer' && (
              <div className="flex-1 flex flex-col px-4 pt-2 pb-2 bg-[#0d0e14]/95 backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-200">
                {/* Search Bar Top */}
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
                      placeholder="Поиск приложений..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-full pl-10 pr-9 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:bg-white/15"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtitle count */}
                <div className="flex justify-between items-center text-[11px] text-neutral-400 px-2 mb-2 font-medium">
                  <span>Все приложения ({filteredApps.length})</span>
                  <span>Сетка {drawerCols}x</span>
                </div>

                {/* Drawer Grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredApps.length > 0 ? (
                    <div 
                      className="grid gap-y-5 gap-x-2 py-2"
                      style={{ gridTemplateColumns: `repeat(${drawerCols}, minmax(0, 1fr))` }}
                    >
                      {filteredApps.map(app => (
                        <div
                          key={app.id}
                          onClick={() => setActiveRunningApp(app)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                          className="flex flex-col items-center p-1.5 rounded-2xl hover:bg-white/5 cursor-pointer group transition"
                        >
                          <div 
                            className={`w-[50px] h-[50px] ${getIconRadius()} flex items-center justify-center text-2xl shadow-md transition transform group-hover:scale-105 group-active:scale-95`}
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
                      <p className="text-sm text-neutral-300 font-medium">Ничего не найдено</p>
                      <p className="text-xs text-neutral-500 mt-1">По запросу «{searchQuery}» приложений нет</p>
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
              <div className="flex-1 flex flex-col px-4 pt-2 pb-2 bg-[#12131a] overflow-y-auto animate-in slide-in-from-right-6 duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setScreenMode('desktop')}
                    className="p-2 rounded-full hover:bg-white/10 text-neutral-300"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-semibold text-white">
                    Настройки главного экрана
                  </h3>
                </div>

                {/* Default Launcher Action Banner */}
                <div 
                  onClick={() => setShowDefaultDialog(true)}
                  className="p-3.5 mb-4 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center gap-3 cursor-pointer hover:bg-blue-600/30 transition"
                >
                  <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      Лаунчер по умолчанию
                      {isDefaultLauncherSet && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </h4>
                    <p className="text-[10px] text-neutral-400">
                      {isDefaultLauncherSet ? 'Выбран основным домашним экраном' : 'Нажмите для перехода в настройки Android'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>

                {/* Settings list */}
                <div className="space-y-3 pb-4">
                  <div className="text-[11px] font-semibold text-neutral-400 px-1">
                    СЕТКА И МАКЕТ
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
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${homeCols === cols ? 'bg-blue-600 text-white' : 'bg-white/10 text-neutral-300'}`}
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
                          className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${drawerCols === cols ? 'bg-blue-600 text-white' : 'bg-white/10 text-neutral-300'}`}
                        >
                          {cols}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dock Search Toggle */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Строка поиска в доке</div>
                      <div className="text-[10px] text-neutral-400">Стиль Lawnchair / Pixel</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showDockSearch}
                      onChange={(e) => setShowDockSearch(e.target.checked)}
                      className="accent-blue-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-neutral-400 px-1 pt-1">
                    СТИЛЬ ИКОНОК
                  </div>

                  {/* Icon Shape */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Форма иконок</div>
                      <div className="text-[10px] text-neutral-400">One UI / Pixel стиль</div>
                    </div>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'squircle', label: 'One UI' },
                        { id: 'circle', label: 'Круг' },
                        { id: 'rounded', label: 'Квадрат' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setIconStyle(s.id as any)}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition ${iconStyle === s.id ? 'bg-blue-600 text-white' : 'bg-white/10 text-neutral-300'}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AMOLED */}
                  <div className="p-3 rounded-2xl bg-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">AMOLED черный фон</div>
                      <div className="text-[10px] text-neutral-400">Глубокий черный цвет</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={isAmoled}
                      onChange={(e) => setIsAmoled(e.target.checked)}
                      className="accent-blue-600 w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* APP CONTEXT DIALOG (One UI long press popup) */}
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
                  onClick={() => toggleFavorite(selectedDialogApp.id)}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-white/10 text-white text-xs flex items-center gap-3 transition"
                >
                  {selectedDialogApp.isFavorite ? <Minus className="w-4 h-4 text-neutral-400" /> : <Plus className="w-4 h-4 text-blue-400" />}
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

          {/* DESKTOP CONTEXT MENU (Long press empty space) */}
          {showDesktopMenu && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end p-4 animate-in fade-in">
              <div className="w-full bg-[#1c1e29] rounded-3xl p-4 shadow-2xl space-y-2 border border-white/10">
                <h4 className="text-xs font-semibold text-neutral-400 px-2 pb-1">Главный экран</h4>
                
                <button
                  onClick={() => { setShowDesktopMenu(false); setScreenMode('settings'); }}
                  className="w-full py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-3 transition font-medium"
                >
                  <SettingsIcon className="w-4 h-4 text-blue-400" />
                  <span>Настройки лаунчера</span>
                </button>

                <button
                  onClick={() => { setShowDesktopMenu(false); setScreenMode('drawer'); }}
                  className="w-full py-3 px-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-3 transition font-medium"
                >
                  <Grid className="w-4 h-4 text-blue-400" />
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
              <div className="w-full bg-[#181a24] border border-blue-500/50 rounded-3xl p-5 text-center space-y-3 shadow-2xl">
                <ShieldCheck className="w-10 h-10 text-blue-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Выбор основного лаунчера</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Android открывает окно <code className="text-blue-300 font-mono text-[11px]">Settings.ACTION_HOME_SETTINGS</code>.
                </p>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10 text-left space-y-2">
                  <div 
                    onClick={() => { setIsDefaultLauncherSet(true); setShowDefaultDialog(false); }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600/30 border border-blue-500 cursor-pointer hover:bg-blue-600/40"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">🏠</span>
                      <span className="text-xs font-semibold text-white">MARS Launcher</span>
                    </div>
                    <span className="text-[10px] text-blue-300 font-medium">ВЫБРАТЬ</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-neutral-400">
                    <span className="text-xs">One UI Home / Quickstep</span>
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

      {/* Simulator Control & Style Preset Panel */}
      <div className="max-w-md w-full bg-[#10121a] border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-white tracking-wide">Симулятор лаунчера</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-950/80 text-blue-400 border border-blue-800/40">
            Jetpack Compose
          </span>
        </div>

        {/* Style Presets */}
        <div>
          <label className="text-xs font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            Стиль оформления:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'oneui', name: 'One UI', desc: 'Samsung стиль' },
              { id: 'lawnchair', name: 'Lawnchair', desc: 'Чистый Android' },
              { id: 'mts', name: 'МТС / Яндекс', desc: 'Поисковый док' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className={`p-2.5 rounded-2xl border text-left transition ${
                  launcherPreset === p.id 
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{p.name}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Simulator Controls */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setScreenMode('drawer')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <Grid className="w-4 h-4 text-blue-400" />
            <span>Меню приложений</span>
          </button>
          <button
            onClick={() => setScreenMode('settings')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <SettingsIcon className="w-4 h-4 text-blue-400" />
            <span>Настройки лаунчера</span>
          </button>
          <button
            onClick={() => setShowDefaultDialog(true)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Выбор по умолчанию</span>
          </button>
          <button
            onClick={() => setApps(DEFAULT_APPS)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>Сбросить иконки</span>
          </button>
        </div>

        {/* Specs summary */}
        <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 space-y-2 text-xs">
          <div className="font-semibold text-neutral-300 text-xs">
            Характеристики сборки Android:
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Тип лаунчера:</span>
            <span className="text-white font-medium">Стандартный домашний экран (HOME)</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Поиск пакетов:</span>
            <span className="text-blue-400 font-mono">PackageManager (Android 11-15)</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Хранилище настроек:</span>
            <span className="text-white font-medium">Jetpack DataStore</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>GitHub Actions APK:</span>
            <span className="text-emerald-400 font-mono">.github/workflows/build.yml</span>
          </div>
        </div>
      </div>
    </div>
  );
};
