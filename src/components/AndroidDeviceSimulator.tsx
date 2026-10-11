import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, X, Grid, Settings as SettingsIcon, Star, Info, 
  Trash2, RefreshCw, Smartphone, Radio, Compass, ArrowLeft,
  Terminal, ShieldCheck, Flame, Bell, Check, ChevronRight,
  ExternalLink
} from 'lucide-react';

export interface SimulatedApp {
  id: string;
  name: string;
  packageName: string;
  iconBg: string;
  glyph: string;
  isFavorite: boolean;
  category: 'system' | 'tools' | 'media' | 'social';
}

const DEFAULT_APPS: SimulatedApp[] = [
  { id: 'phone', name: 'Dialer Comms', packageName: 'com.android.dialer', iconBg: '#1e3a29', glyph: '📞', isFavorite: true, category: 'system' },
  { id: 'messages', name: 'Secure Signal', packageName: 'com.mars.messages', iconBg: '#1e293b', glyph: '💬', isFavorite: true, category: 'system' },
  { id: 'chrome', name: 'DeepWeb Browser', packageName: 'com.android.chrome', iconBg: '#312e81', glyph: '🌐', isFavorite: true, category: 'tools' },
  { id: 'camera', name: 'Orbital Optics', packageName: 'com.android.camera2', iconBg: '#451a03', glyph: '📷', isFavorite: true, category: 'media' },
  { id: 'maps', name: 'Mars Rover Nav', packageName: 'com.google.android.apps.maps', iconBg: '#701a75', glyph: '🗺️', isFavorite: false, category: 'tools' },
  { id: 'terminal', name: 'Ares CLI', packageName: 'com.mars.terminal', iconBg: '#172554', glyph: '💻', isFavorite: false, category: 'tools' },
  { id: 'gallery', name: 'Spectral Vault', packageName: 'com.android.gallery3d', iconBg: '#3b0764', glyph: '🖼️', isFavorite: false, category: 'media' },
  { id: 'settings_sys', name: 'Android System', packageName: 'com.android.settings', iconBg: '#18181b', glyph: '⚙️', isFavorite: false, category: 'system' },
  { id: 'spotify', name: 'Sonic Beacon', packageName: 'com.spotify.music', iconBg: '#064e3b', glyph: '🎵', isFavorite: false, category: 'media' },
  { id: 'calculator', name: 'Delta-V Calc', packageName: 'com.android.calculator2', iconBg: '#7f1d1d', glyph: '🔢', isFavorite: false, category: 'tools' },
  { id: 'notes', name: 'Mission Log', packageName: 'com.mars.notes', iconBg: '#365314', glyph: '📝', isFavorite: false, category: 'tools' },
  { id: 'clock_sys', name: 'Universal Time', packageName: 'com.android.deskclock', iconBg: '#1e1b4b', glyph: '⏱️', isFavorite: false, category: 'system' }
];

interface Props {
  onNotify?: (msg: string) => void;
}

export const AndroidDeviceSimulator: React.FC<Props> = () => {
  const [apps, setApps] = useState<SimulatedApp[]>(DEFAULT_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [screenMode, setScreenMode] = useState<'desktop' | 'drawer' | 'settings'>('desktop');
  const [activeRunningApp, setActiveRunningApp] = useState<SimulatedApp | null>(null);
  const [selectedDialogApp, setSelectedDialogApp] = useState<SimulatedApp | null>(null);
  
  // Launcher Preferences State
  const [gridCols, setGridCols] = useState<number>(4);
  const [themeIntensity, setThemeIntensity] = useState<'STEALTH' | 'BALANCED' | 'HIGH'>('BALANCED');
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [martianSolMode, setMartianSolMode] = useState<boolean>(true);
  const [showHud, setShowHud] = useState<boolean>(true);
  const [isDefaultLauncherSet, setIsDefaultLauncherSet] = useState<boolean>(false);
  const [showDefaultDialog, setShowDefaultDialog] = useState<boolean>(false);

  // Time & Martian Sol calculation
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const julianDate = useMemo(() => {
    return (currentTime.getTime() / 86400000.0) + 2440587.5;
  }, [currentTime]);

  const marsSolDate = useMemo(() => {
    return Math.floor((julianDate - 2451549.5) / 1.027491252 + 44796.0);
  }, [julianDate]);

  const formattedTime = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const h = pad(currentTime.getHours());
    const m = pad(currentTime.getMinutes());
    const s = pad(currentTime.getSeconds());
    return showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  }, [currentTime, showSeconds]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  }, [currentTime]);

  // Filtering
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const q = searchQuery.toLowerCase().trim();
    return apps.filter(a => a.name.toLowerCase().includes(q) || a.packageName.toLowerCase().includes(q));
  }, [apps, searchQuery]);

  const favoriteApps = useMemo(() => {
    return apps.filter(a => a.isFavorite);
  }, [apps]);

  const toggleFavorite = (appId: string) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, isFavorite: !a.isFavorite } : a));
    setSelectedDialogApp(null);
  };

  const uninstallApp = (appId: string) => {
    setApps(prev => prev.filter(a => a.id !== appId));
    setSelectedDialogApp(null);
  };

  const launchApp = (app: SimulatedApp) => {
    setActiveRunningApp(app);
  };

  const closeRunningApp = () => {
    setActiveRunningApp(null);
    setScreenMode('desktop');
  };

  // Theme styling based on intensity
  const glowBorder = themeIntensity === 'HIGH' 
    ? 'rgba(255, 42, 54, 0.45)' 
    : themeIntensity === 'STEALTH' 
    ? 'rgba(255, 42, 54, 0.15)' 
    : 'rgba(255, 42, 54, 0.28)';

  const primaryRed = themeIntensity === 'STEALTH' ? '#d6001c' : '#ff2a36';

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center p-2 lg:p-6 select-none">
      {/* Device Body */}
      <div className="relative w-[360px] sm:w-[390px] h-[780px] bg-black rounded-[46px] p-3 shadow-2xl border-4 border-neutral-800 ring-1 ring-red-950/40 flex flex-col overflow-hidden">
        
        {/* Hardware Frame Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex items-center justify-center">
          {/* Front Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 ring-1 ring-neutral-700/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
          </div>
        </div>

        {/* AMOLED Inner Screen */}
        <div className="relative w-full h-full bg-[#000000] rounded-[36px] overflow-hidden flex flex-col font-sans text-white border border-neutral-900">
          
          {/* Android Status Bar */}
          <div className="w-full h-8 pt-1 px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400 z-40 bg-black/80 backdrop-blur-sm">
            <span>{formattedTime.slice(0, 5)}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-red-500 font-bold tracking-wider">MARS-5G</span>
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              <div className="w-4 h-2.5 border border-neutral-400 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-red-500 rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* ACTIVE RUNNING APP MODAL (Simulated Activity launch) */}
          {activeRunningApp && (
            <div className="absolute inset-0 z-50 bg-[#0a0a0f] flex flex-col animate-in fade-in duration-200">
              {/* App Bar */}
              <div className="h-14 px-4 bg-[#14141d] border-b border-red-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{activeRunningApp.glyph}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{activeRunningApp.name}</h3>
                    <p className="text-[10px] font-mono text-neutral-400">{activeRunningApp.packageName}</p>
                  </div>
                </div>
                <button 
                  onClick={closeRunningApp}
                  className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition"
                  title="Return to MARS Home"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* App Content Placeholder */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-neutral-900 border border-red-500/30 flex items-center justify-center text-4xl mb-4 shadow-lg shadow-red-950/30">
                  {activeRunningApp.glyph}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{activeRunningApp.name}</h4>
                <p className="text-xs text-neutral-400 max-w-[260px] mb-6">
                  Simulated native Android Activity launched with <code className="text-red-400 font-mono text-[11px]">FLAG_ACTIVITY_NEW_TASK</code>.
                </p>
                <button
                  onClick={closeRunningApp}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  RETURN TO MARS HOME
                </button>
              </div>

              {/* Android Navigation Bar */}
              <div className="h-10 bg-black flex items-center justify-around text-neutral-500 border-t border-neutral-900">
                <button onClick={closeRunningApp} className="p-2 hover:text-white transition">◀</button>
                <button onClick={closeRunningApp} className="p-2 hover:text-white transition">●</button>
                <button onClick={closeRunningApp} className="p-2 hover:text-white transition">■</button>
              </div>
            </div>
          )}

          {/* MAIN LAUNCHER VIEWPORT */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            
            {/* HUD Telemetry Corner Brackets */}
            {showHud && (
              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="absolute top-2 left-3 w-5 h-5 border-t-2 border-l-2 border-red-500/30" />
                <div className="absolute top-2 right-3 w-5 h-5 border-t-2 border-r-2 border-red-500/30" />
                <div className="absolute bottom-16 left-3 w-5 h-5 border-b-2 border-l-2 border-red-500/30" />
                <div className="absolute bottom-16 right-3 w-5 h-5 border-b-2 border-r-2 border-red-500/30" />
                
                <div className="flex justify-between px-5 text-[9px] font-mono text-neutral-500 mt-1">
                  <span>ARES-IV // 22.4°N 49.9°W</span>
                  <span className="text-red-500 font-bold">STATUS // NOMINAL</span>
                </div>
              </div>
            )}

            {/* SCREEN CONTENT */}
            {screenMode === 'desktop' && (
              <div className="flex-1 flex flex-col px-4 pt-3 pb-2 justify-between overflow-y-auto">
                {/* Sol & Clock Section */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-sm bg-red-600 animate-pulse" />
                    <span className="font-mono text-[10px] font-bold tracking-widest text-red-500">
                      {martianSolMode ? `SOL ${marsSolDate} • CHRYSE PLANITIA` : 'PLANET EARTH STATION'}
                    </span>
                  </div>

                  <div className="text-5xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_12px_rgba(255,42,54,0.3)]">
                    {formattedTime}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] text-neutral-400 tracking-wider">
                      {formattedDate}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-red-950/60 text-red-400 border border-red-800/40">
                      SYNCED
                    </span>
                  </div>
                </div>

                {/* Quick Search Bar trigger */}
                <div 
                  onClick={() => setScreenMode('drawer')}
                  className="my-3 px-3.5 py-2.5 rounded-xl bg-[#13131b] border flex items-center gap-3 cursor-pointer hover:border-red-500/50 transition group shadow-inner"
                  style={{ borderColor: glowBorder }}
                >
                  <Search className="w-4 h-4 text-red-500 group-hover:scale-110 transition" />
                  <span className="text-xs font-mono text-neutral-400 tracking-wide">
                    SEARCH PROTOCOL // APPS
                  </span>
                </div>

                {/* Orbital Pins / Favorite Shelf */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400">
                      PINNED ORBITAL APPS ({favoriteApps.length})
                    </span>
                    <span className="text-[9px] font-mono text-red-500">HOLD TO MANAGE</span>
                  </div>

                  {favoriteApps.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 py-2">
                      {favoriteApps.map(app => (
                        <div
                          key={app.id}
                          onClick={() => launchApp(app)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div 
                            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-[#14141e] border transition transform group-hover:scale-105 group-active:scale-95 shadow-md shadow-black"
                            style={{ borderColor: glowBorder }}
                          >
                            <span>{app.glyph}</span>
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-black font-bold">
                              ★
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-300 mt-1.5 text-center truncate max-w-[64px]">
                            {app.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-red-900/40 bg-red-950/10 text-center text-xs text-neutral-400">
                      No orbital apps pinned yet. Tap the drawer and long-press an app to pin here.
                    </div>
                  )}
                </div>

                {/* Bottom Orbital Floating Dock */}
                <div className="mt-auto pt-2 pb-1">
                  <div 
                    className="w-full px-3 py-2 rounded-2xl bg-[#14141c]/90 backdrop-blur-md border flex items-center justify-between shadow-xl shadow-black/80"
                    style={{ borderColor: glowBorder }}
                  >
                    {/* Up to 3 quick favorite apps in dock */}
                    <div className="flex items-center gap-2">
                      {favoriteApps.slice(0, 3).map(app => (
                        <button
                          key={app.id}
                          onClick={() => launchApp(app)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                          className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-red-950 flex items-center justify-center text-lg hover:border-red-500/60 transition"
                          title={app.name}
                        >
                          {app.glyph}
                        </button>
                      ))}
                    </div>

                    {/* Central App Drawer Launcher */}
                    <button
                      onClick={() => setScreenMode('drawer')}
                      className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-black flex items-center justify-center shadow-lg shadow-red-600/40 font-bold transition transform active:scale-90"
                      title="Open App Drawer"
                    >
                      <Grid className="w-5 h-5 text-black" />
                    </button>

                    {/* Quick Settings Action */}
                    <button
                      onClick={() => setScreenMode('settings')}
                      className="w-10 h-10 rounded-xl bg-[#0a0a0f] border border-red-950 flex items-center justify-center text-neutral-400 hover:text-red-400 hover:border-red-500/60 transition"
                      title="Launcher Protocol Settings"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* APP DRAWER SCREEN */}
            {screenMode === 'drawer' && (
              <div className="flex-1 flex flex-col px-4 pt-3 pb-2 bg-black overflow-hidden animate-in slide-in-from-bottom-8 duration-200">
                {/* Drawer Header & Real Search Input */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => { setSearchQuery(''); setScreenMode('desktop'); }}
                    className="p-2 rounded-xl bg-neutral-900 text-red-500 hover:bg-neutral-800 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-3 w-4 h-4 text-red-500" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="SEARCH FIRMWARE PACKAGES…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#13131b] border border-red-900/50 rounded-xl pl-9 pr-8 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 p-1 text-neutral-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-bar stats */}
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 px-1 mb-2">
                  <span>INDEXED: {filteredApps.length} PACKAGES</span>
                  <span className="text-red-500 font-bold">{gridCols}X GRID LAYOUT</span>
                </div>

                {/* App Grid */}
                <div className="flex-1 overflow-y-auto pr-1">
                  {filteredApps.length > 0 ? (
                    <div 
                      className="grid gap-3 py-2"
                      style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
                    >
                      {filteredApps.map(app => (
                        <div
                          key={app.id}
                          onClick={() => launchApp(app)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedDialogApp(app); }}
                          className="flex flex-col items-center p-1.5 rounded-xl hover:bg-neutral-900/50 cursor-pointer group transition"
                        >
                          <div 
                            className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-[#14141e] border transition transform group-hover:scale-105 group-active:scale-95 shadow-md shadow-black"
                            style={{ borderColor: app.isFavorite ? primaryRed : glowBorder }}
                          >
                            <span>{app.glyph}</span>
                            {app.isFavorite && (
                              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-black font-bold">
                                ★
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-300 mt-1.5 text-center truncate w-full px-1">
                            {app.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center p-4">
                      <Terminal className="w-8 h-8 text-red-500 mb-2 opacity-60" />
                      <p className="text-xs font-mono text-red-400 font-bold">NO MATCHING PACKAGES</p>
                      <p className="text-[11px] text-neutral-500 mt-1">No apps match &quot;{searchQuery}&quot;</p>
                    </div>
                  )}
                </div>

                {/* Close Drawer Button */}
                <button
                  onClick={() => { setSearchQuery(''); setScreenMode('desktop'); }}
                  className="w-full py-2.5 mt-2 rounded-xl bg-[#111118] border border-red-950 text-neutral-400 hover:text-white font-mono text-xs tracking-wider flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
                  RETURN TO HOME
                </button>
              </div>
            )}

            {/* SETTINGS PROTOCOL SCREEN */}
            {screenMode === 'settings' && (
              <div className="flex-1 flex flex-col px-4 pt-3 pb-2 bg-black overflow-y-auto animate-in slide-in-from-right-8 duration-200">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setScreenMode('desktop')}
                    className="p-2 rounded-xl bg-neutral-900 text-red-500 hover:bg-neutral-800 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white">
                    SYSTEM PROTOCOL // SETTINGS
                  </h3>
                </div>

                {/* Default Launcher Banner */}
                <div 
                  onClick={() => setShowDefaultDialog(true)}
                  className="p-3 mb-4 rounded-xl bg-red-950/20 border border-red-600/50 flex items-center gap-3 cursor-pointer hover:bg-red-950/30 transition shadow-lg shadow-red-950/20"
                >
                  <ShieldCheck className="w-6 h-6 text-red-500 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Set as Default Launcher
                      {isDefaultLauncherSet && <Check className="w-3.5 h-3.5 text-green-400" />}
                    </h4>
                    <p className="text-[10px] text-neutral-400 leading-tight">
                      {isDefaultLauncherSet ? 'MARS Launcher is your primary home screen' : 'Fires Android ACTION_HOME_SETTINGS'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </div>

                {/* Settings Options */}
                <div className="space-y-3 pb-4">
                  <div className="text-[9px] font-mono font-bold text-neutral-500 tracking-wider">
                    DISPLAY & THEME
                  </div>

                  {/* Martian Sol Mode Toggle */}
                  <div className="p-2.5 rounded-xl bg-[#101017] border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Martian Sol Date Calculation</div>
                      <div className="text-[10px] text-neutral-400">Compute true MSD for Chryse Planitia</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={martianSolMode}
                      onChange={(e) => setMartianSolMode(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Precise Seconds Toggle */}
                  <div className="p-2.5 rounded-xl bg-[#101017] border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Precise Clock Seconds</div>
                      <div className="text-[10px] text-neutral-400">Real-time ticker on AMOLED clock</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showSeconds}
                      onChange={(e) => setShowSeconds(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* HUD Telemetry Toggle */}
                  <div className="p-2.5 rounded-xl bg-[#101017] border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">Orbital HUD Telemetry</div>
                      <div className="text-[10px] text-neutral-400">Cyber brackets and coordinates</div>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showHud}
                      onChange={(e) => setShowHud(e.target.checked)}
                      className="accent-red-600 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Drawer Columns */}
                  <div className="p-2.5 rounded-xl bg-[#101017] border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">App Drawer Columns</div>
                      <div className="text-[10px] text-neutral-400">{gridCols} columns per row</div>
                    </div>
                    <div className="flex gap-1">
                      {[3, 4, 5].map(cols => (
                        <button
                          key={cols}
                          onClick={() => setGridCols(cols)}
                          className={`px-2 py-1 text-[10px] font-mono rounded font-bold transition ${gridCols === cols ? 'bg-red-600 text-black' : 'bg-neutral-800 text-neutral-300'}`}
                        >
                          {cols}X
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Glow Mode */}
                  <div className="p-2.5 rounded-xl bg-[#101017] border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-white">MARS RED Glow Mode</div>
                      <div className="text-[10px] text-neutral-400">{themeIntensity} radiation level</div>
                    </div>
                    <div className="flex gap-1">
                      {(['STEALTH', 'BALANCED', 'HIGH'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setThemeIntensity(mode)}
                          className={`px-1.5 py-1 text-[9px] font-mono rounded font-bold transition ${themeIntensity === mode ? 'bg-red-600 text-black' : 'bg-neutral-800 text-neutral-300'}`}
                        >
                          {mode[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-[9px] font-mono font-bold text-neutral-500 tracking-wider pt-2">
                    MARS AI ARCHITECTURE
                  </div>

                  <div className="p-3 rounded-xl bg-[#101017] border border-neutral-800">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 mb-1">
                      <Flame className="w-3.5 h-3.5" />
                      Neural Bridge: OFFLINE LOCAL
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      Zero cloud requirement or telemetry. Interface <code className="text-red-400">AiFeatureProvider</code> is ready for future MARS AI application hooks.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* APP CONTEXT DIALOG (Long press simulation) */}
          {selectedDialogApp && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div 
                className="w-full bg-[#12121b] border rounded-2xl p-4 shadow-2xl space-y-3"
                style={{ borderColor: glowBorder }}
              >
                <div className="flex items-center gap-3 pb-2 border-b border-neutral-800">
                  <span className="text-2xl">{selectedDialogApp.glyph}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedDialogApp.name}</h4>
                    <p className="text-[10px] font-mono text-neutral-400">{selectedDialogApp.packageName}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(selectedDialogApp.id)}
                  className="w-full py-2 px-3 rounded-xl bg-[#1a1a26] hover:bg-neutral-800 text-white text-xs flex items-center gap-2.5 transition"
                >
                  <Star className={`w-4 h-4 ${selectedDialogApp.isFavorite ? 'text-red-500 fill-red-500' : 'text-neutral-400'}`} />
                  <span>{selectedDialogApp.isFavorite ? 'Remove from Orbital Dock' : 'Pin to Orbital Dock'}</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Package Details:\nID: ${selectedDialogApp.packageName}\nTarget: android.intent.action.MAIN\nCategory: android.intent.category.LAUNCHER`);
                    setSelectedDialogApp(null);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#1a1a26] hover:bg-neutral-800 text-white text-xs flex items-center gap-2.5 transition"
                >
                  <Info className="w-4 h-4 text-neutral-400" />
                  <span>Application Details & Permissions</span>
                </button>

                <button
                  onClick={() => uninstallApp(selectedDialogApp.id)}
                  className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/40 text-red-400 text-xs flex items-center gap-2.5 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Simulate Uninstall Application</span>
                </button>

                <button
                  onClick={() => setSelectedDialogApp(null)}
                  className="w-full py-1.5 text-center text-xs text-neutral-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* DEFAULT LAUNCHER SIMULATION DIALOG */}
          {showDefaultDialog && (
            <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full bg-[#14141e] border border-red-500/60 rounded-2xl p-5 text-center space-y-3 shadow-2xl">
                <ShieldCheck className="w-10 h-10 text-red-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Select Default Home App</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Android system triggers <code className="text-red-400 font-mono text-[11px]">Settings.ACTION_HOME_SETTINGS</code> allowing the user to select MARS Launcher as default home screen.
                </p>
                <div className="p-3 bg-black rounded-xl border border-neutral-800 text-left space-y-2">
                  <div 
                    onClick={() => { setIsDefaultLauncherSet(true); setShowDefaultDialog(false); }}
                    className="flex items-center justify-between p-2 rounded-lg bg-red-950/40 border border-red-600/60 cursor-pointer hover:bg-red-900/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">🚀</span>
                      <span className="text-xs font-bold text-white">MARS Launcher</span>
                    </div>
                    <span className="text-[10px] font-mono text-red-400">SET DEFAULT</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 text-neutral-500 opacity-60">
                    <span className="text-xs">Quickstep / Pixel Launcher</span>
                    <span className="text-[10px] font-mono">SYSTEM</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDefaultDialog(false)}
                  className="w-full py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Android Bottom Navigation Bar */}
          <div className="w-full h-8 bg-black flex items-center justify-around text-neutral-600 text-xs border-t border-neutral-900">
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

      {/* Simulator Control Panel (Right Side on Desktop) */}
      <div className="max-w-md w-full bg-[#0d0d13] border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-bold text-white tracking-wide">MARS Launcher Live Simulator</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-400 border border-red-800/40">
            Jetpack Compose 1:1
          </span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Interact with the live AMOLED device to test the real-time Sol clock ticker, search bar, orbital dock pinning, app drawer scrolling, and theme intensity modes.
        </p>

        {/* Quick Simulation Actions */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => setScreenMode('drawer')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center gap-2 transition"
          >
            <Grid className="w-4 h-4 text-red-500" />
            <span>Open App Drawer</span>
          </button>
          <button
            onClick={() => setScreenMode('settings')}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center gap-2 transition"
          >
            <SettingsIcon className="w-4 h-4 text-red-500" />
            <span>Open Protocol Settings</span>
          </button>
          <button
            onClick={() => setShowDefaultDialog(true)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Test Default Picker</span>
          </button>
          <button
            onClick={() => setApps(DEFAULT_APPS)}
            className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 flex items-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4 text-red-500" />
            <span>Reset App State</span>
          </button>
        </div>

        {/* Real Android Spec Highlights */}
        <div className="p-3.5 rounded-xl bg-[#12121a] border border-neutral-800/80 space-y-2 text-xs">
          <div className="font-mono text-[10px] font-bold text-red-400 tracking-wider">
            NATIVE ANDROID INTEGRATION SPECS
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Package Name:</span>
            <span className="font-mono text-white">com.mars.launcher</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Home Intent Filters:</span>
            <span className="font-mono text-emerald-400">MAIN, HOME, DEFAULT</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Package Queries:</span>
            <span className="font-mono text-blue-400">Android 11+ Least-Privileged</span>
          </div>
          <div className="flex justify-between text-neutral-400 text-[11px]">
            <span>Target / Min SDK:</span>
            <span className="font-mono text-white">Android 15 (35) / Android 8.0 (26)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
