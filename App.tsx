import React, { useState, useEffect } from 'react';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import { AppDefinition, WindowState, SystemState } from './types';
import Calculator from './apps/Calculator';
import TicTacToe from './apps/TicTacToe';
import Browser from './apps/Browser';
import Explorer from './apps/Explorer';
import Photos from './apps/Photos';
import Copilot from './apps/Copilot';
import Notepad from './apps/Notepad';
import Minesweeper from './apps/Minesweeper';
import Snake from './apps/Snake';
import Settings from './apps/Settings';
import Security from './apps/Security';
import AppIcon from './components/AppIcon';

// App Registry
const apps: AppDefinition[] = [
  { id: 'browser', title: 'Chrome', icon: 'chrome', component: Browser, defaultWidth: 800, defaultHeight: 600 },
  { id: 'explorer', title: 'Explorer', icon: 'folder', component: Explorer, defaultWidth: 700, defaultHeight: 500 },
  { id: 'calculator', title: 'Calculator', icon: 'calculator', component: Calculator, defaultWidth: 320, defaultHeight: 480 },
  { id: 'notepad', title: 'Notepad', icon: 'notepad', component: Notepad, defaultWidth: 600, defaultHeight: 400 },
  { id: 'settings', title: 'Settings', icon: 'settings', component: Settings, defaultWidth: 900, defaultHeight: 600 },
  { id: 'security', title: 'Security Center', icon: 'shield', component: Security, defaultWidth: 850, defaultHeight: 600 },
  { id: 'copilot', title: 'Copilot', icon: 'copilot', component: Copilot, defaultWidth: 400, defaultHeight: 700 },
  { id: 'photos', title: 'Photos', icon: 'image', component: Photos, defaultWidth: 800, defaultHeight: 600 },
  { id: 'tictactoe', title: 'Tic Tac Toe', icon: 'gamepad-2', component: TicTacToe, defaultWidth: 400, defaultHeight: 450 },
  { id: 'minesweeper', title: 'Minesweeper', icon: 'minesweeper', component: Minesweeper, defaultWidth: 400, defaultHeight: 500 },
  { id: 'snake', title: 'Snake', icon: 'snake', component: Snake, defaultWidth: 500, defaultHeight: 550 },
];

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [zCounter, setZCounter] = useState(100);

  // Global System State
  const [systemState, setSystemState] = useState<SystemState>({
      wallpaper: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop',
      isDark: false,
      centerTaskbar: true,
  });

  const updateSystemState = (newState: Partial<SystemState>) => {
      setSystemState(prev => ({ ...prev, ...newState }));
  };

  // Initial boot: Open Explorer
  useEffect(() => {
     // Small delay to ensure render cycle is complete
     const timer = setTimeout(() => launchApp('explorer'), 500);
     return () => clearTimeout(timer);
  }, []);

  const launchApp = (appIdOrDef: string | AppDefinition, params?: any) => {
    let app: AppDefinition | undefined;
    
    if (typeof appIdOrDef === 'string') {
        app = apps.find(a => a.id === appIdOrDef);
    } else {
        app = appIdOrDef;
    }

    if (!app) {
        console.error('App not found:', appIdOrDef);
        return;
    }

    const existingWindow = windows.find(w => w.appId === app!.id && !params);
    
    if (existingWindow && !params) {
      focusWindow(existingWindow.id);
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w));
      }
    } else {
      const newWindow: WindowState = {
        id: Date.now().toString(),
        appId: app.id,
        title: params?.title || app.title,
        icon: app.icon,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: zCounter + 1,
        position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 30) },
        size: { width: app.defaultWidth || 600, height: app.defaultHeight || 500 },
        initialState: params
      };
      setWindows(prev => [...prev, newWindow]);
      setZCounter(prev => prev + 1);
    }
    setStartMenuOpen(false);
    setSelectedAppId(null);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zCounter + 1 } : w));
    setZCounter(prev => prev + 1);
  };

  const moveWindow = (id: string, pos: { x: number, y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: pos } : w));
  };

  const handleShowDesktop = () => {
      // If all windows are minimized, restore them. Otherwise, minimize all.
      const allMinimized = windows.every(w => w.isMinimized);
      
      if (allMinimized) {
          setWindows(prev => prev.map(w => ({ ...w, isMinimized: false })));
      } else {
          setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })));
      }
  };

  const toggleStartMenu = () => setStartMenuOpen(!startMenuOpen);

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-cover bg-center relative font-sans text-slate-900 select-none transition-all duration-500"
      style={{ backgroundImage: `url(${systemState.wallpaper})` }}
      onClick={() => { 
          if(startMenuOpen) setStartMenuOpen(false); 
          setSelectedAppId(null);
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-2 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 w-fit h-[calc(100%-48px)] content-start justify-items-center z-10">
         {apps.map(app => (
             <div 
                key={app.id} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedAppId(app.id);
                }}
                onDoubleClick={(e) => { 
                    e.stopPropagation(); 
                    launchApp(app); 
                }}
                className={`flex flex-col items-center gap-1 w-[84px] p-2 rounded border border-transparent cursor-pointer transition-all duration-100 group ${selectedAppId === app.id ? 'bg-white/20 border-white/30 backdrop-blur-sm' : 'hover:bg-white/10 hover:border-white/20'}`}
                title={app.title}
             >
                 <div className="w-12 h-12 flex items-center justify-center drop-shadow-lg transform group-hover:scale-105 transition-transform">
                    <AppIcon iconName={app.icon} size={48} />
                 </div>
                 <span className="text-white text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2 font-medium shadow-black">{app.title}</span>
             </div>
         ))}
      </div>

      {/* Windows */}
      {windows.map(w => {
        const appDef = apps.find(a => a.id === w.appId);
        if (!appDef) return null;
        const Component = appDef.component;
        return (
          <Window
            key={w.id}
            windowState={w}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onFocus={focusWindow}
            onMove={moveWindow}
          >
            <Component 
                windowId={w.id} 
                launchApp={(id, params) => launchApp(id, params)} 
                initialState={w.initialState}
                systemState={systemState}
                setSystemState={updateSystemState}
            />
          </Window>
        );
      })}

      {/* UI Layer */}
      <StartMenu 
        isOpen={startMenuOpen} 
        apps={apps} 
        onLaunch={launchApp} 
        onClose={() => setStartMenuOpen(false)}
        onLaunchById={launchApp}
      />
      <Taskbar 
        apps={apps} 
        windows={windows} 
        onAppClick={launchApp} 
        toggleStartMenu={toggleStartMenu} 
        startMenuOpen={startMenuOpen}
        onShowDesktop={handleShowDesktop}
        centerTaskbar={systemState.centerTaskbar}
      />
    </div>
  );
};

export default App;