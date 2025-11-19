import React, { useState, useEffect, useRef } from 'react';
import { WindowState, AppDefinition } from '../types';
import { Battery, Wifi, Volume2, ChevronUp, Bluetooth, Moon, Sun, Accessibility, Settings, Monitor, Bell, X } from 'lucide-react';
import AppIcon from './AppIcon';

interface TaskbarProps {
  apps: AppDefinition[];
  windows: WindowState[];
  onAppClick: (app: AppDefinition) => void;
  toggleStartMenu: () => void;
  startMenuOpen: boolean;
  onShowDesktop: () => void;
  centerTaskbar?: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ apps, windows, onAppClick, toggleStartMenu, startMenuOpen, onShowDesktop, centerTaskbar = true }) => {
  const [time, setTime] = useState(new Date());
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);
  
  // Simple toggle states
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [blueLightOn, setBlueLightOn] = useState(false);

  const quickSettingsRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close popups when clicking outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (quickSettingsRef.current && !quickSettingsRef.current.contains(event.target as Node) && !(event.target as Element).closest('#quick-settings-trigger')) {
              setQuickSettingsOpen(false);
          }
          if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && !(event.target as Element).closest('#calendar-trigger')) {
              setCalendarOpen(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Start button icon (Windows logo simplified)
  const StartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 87.3 87.6" className="fill-blue-500">
        <path d="M0 12.3h39.5v38.3H0V12.3zm44.3 0h43v38.3h-43V12.3zm-44.3 43h39.5v32.3H0V55.3zm44.3 0h43v32.3h-43V55.3z"/>
    </svg>
  );

  return (
    <>
        {/* Quick Settings Panel */}
        {quickSettingsOpen && (
            <div ref={quickSettingsRef} className="fixed bottom-14 right-4 w-80 bg-[#f3f3f3]/90 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 p-4 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-200 select-none">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <QuickToggle icon={<Wifi size={18} />} label="Wi-Fi" active={wifiOn} onClick={() => setWifiOn(!wifiOn)} />
                    <QuickToggle icon={<Bluetooth size={18} />} label="Bluetooth" active={btOn} onClick={() => setBtOn(!btOn)} />
                    <QuickToggle icon={<Monitor size={18} />} label="Cast" />
                    <QuickToggle icon={<Battery size={18} />} label="Saver" />
                    <QuickToggle icon={<Moon size={18} />} label="Night Light" active={blueLightOn} onClick={() => setBlueLightOn(!blueLightOn)} />
                    <QuickToggle icon={<Accessibility size={18} />} label="Access" />
                </div>
                
                <div className="space-y-6 mb-6">
                    <div className="flex items-center gap-3">
                        <Sun size={20} className="text-slate-500" />
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={brightness} 
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                     <div className="flex items-center gap-3">
                        <Volume2 size={20} className="text-slate-500" />
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={volume} 
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="flex-1 h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-300/30">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Battery size={14} />
                        <span>76% • 2h 15m remaining</span>
                    </div>
                    <div className="flex gap-3 text-slate-600">
                        <Settings size={16} className="cursor-pointer hover:text-slate-900 transition" />
                    </div>
                </div>
            </div>
        )}

        {/* Notification Center & Calendar Panel */}
        {calendarOpen && (
            <div ref={calendarRef} className="fixed bottom-14 right-4 w-80 sm:w-96 h-[calc(100vh-70px)] max-h-[700px] bg-[#f3f3f3]/90 backdrop-blur-3xl rounded-xl shadow-2xl border border-white/20 flex flex-col z-[9999] animate-in slide-in-from-right-10 fade-in duration-200 select-none overflow-hidden">
                 
                 {/* Notifications Section */}
                 <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                     <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#f3f3f3]/0 z-10">
                        <h3 className="font-semibold text-slate-700 text-sm">Notifications</h3>
                        {/* Clear button is mock */}
                     </div>
                     
                     <div className="space-y-3">
                         {/* Notification Item */}
                         <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-white/50 backdrop-blur-sm animate-in slide-in-from-right-2 hover:bg-white/90 transition group">
                             <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <Settings size={14} className="text-blue-500" />
                                    <span className="font-semibold text-xs text-slate-700">Settings</span>
                                </div>
                                <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition"><X size={14}/></button>
                             </div>
                             <p className="text-sm text-slate-800 font-medium">Windows Update</p>
                             <p className="text-xs text-slate-600 mt-0.5">Updates are available. Restart to install.</p>
                         </div>

                         <div className="bg-white/70 p-4 rounded-lg shadow-sm border border-white/50 backdrop-blur-sm animate-in slide-in-from-right-2 delay-75 hover:bg-white/90 transition group">
                             <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <Bell size={14} className="text-orange-500" />
                                    <span className="font-semibold text-xs text-slate-700">Focus Assist</span>
                                </div>
                                <span className="text-[10px] text-slate-500">10:00 AM</span>
                             </div>
                             <p className="text-sm text-slate-800 font-medium">Focus session ended</p>
                             <p className="text-xs text-slate-600 mt-0.5">You completed 25 minutes of focus time.</p>
                         </div>
                     </div>
                 </div>

                 {/* Calendar Section */}
                 <div className="p-4 border-t border-slate-300/30 bg-white/40">
                     <div className="flex justify-between items-center mb-4 px-1">
                         <span className="text-sm font-semibold text-slate-700">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                         <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-white/50 rounded transition"><ChevronUp className="rotate-180 text-slate-600" size={14}/></button>
                            <button className="p-1.5 hover:bg-white/50 rounded transition"><ChevronUp className="text-slate-600" size={14}/></button>
                         </div>
                     </div>
                     <div className="grid grid-cols-7 gap-y-2 text-center text-xs mb-2">
                         {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="font-medium text-slate-500">{d}</div>)}
                         {/* Render Days */}
                         {Array.from({length: 35}, (_, i) => {
                             const day = i - 2; // Offset to start approx correctly for visual
                             const isToday = day === time.getDate();
                             return (
                                 <div key={i} className="flex items-center justify-center">
                                    {day > 0 && day <= 31 ? (
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-default ${isToday ? 'bg-blue-600 text-white font-semibold shadow-md' : 'hover:bg-white/50 hover:border border-slate-200 text-slate-700'}`}>
                                            {day}
                                        </div>
                                    ) : (
                                        <div className="text-slate-300">{ day <= 0 ? 30 + day : day - 31}</div>
                                    )}
                                 </div>
                             )
                         })}
                     </div>
                 </div>
            </div>
        )}

        <div className="fixed bottom-0 w-full h-12 bg-[#f3f3f3]/85 backdrop-blur-2xl border-t border-white/30 flex items-center justify-between px-2 z-[9998] shadow-lg select-none">
        {/* Left spacer / or Start Menu depending on align */}
        {centerTaskbar ? (
            <div className="w-40 hidden sm:block pointer-events-none"></div>
        ) : (
            <div className="w-1"></div>
        )}

        {/* Center App Dock */}
        <div className={`flex items-center gap-1 h-full ${!centerTaskbar ? 'mr-auto ml-1' : ''}`}>
            <button 
                onClick={toggleStartMenu} 
                className={`p-2.5 rounded hover:bg-white/50 transition duration-200 active:scale-95 ${startMenuOpen ? 'bg-white/40' : ''}`}
                title="Start"
            >
                <StartIcon />
            </button>

            {apps.map(app => {
                const isOpen = windows.some(w => w.appId === app.id && w.isOpen);
                const isActive = windows.some(w => w.appId === app.id && !w.isMinimized && w.zIndex === Math.max(...windows.map(win => win.zIndex)));
                
                return (
                    <button
                        key={app.id}
                        onClick={() => onAppClick(app)}
                        className={`relative group p-2 rounded hover:bg-white/40 transition active:scale-95 flex items-center justify-center ${isOpen ? 'bg-white/30' : ''}`}
                        title={app.title}
                    >
                        <div className={`w-6 h-6 flex items-center justify-center text-lg transition-transform duration-200 ${isOpen ? '-translate-y-0.5' : ''}`}>
                            <AppIcon iconName={app.icon} size={24} />
                        </div>
                        {/* Active Indicator */}
                        {isOpen && (
                            <div className={`absolute bottom-0.5 rounded-full transition-all duration-300 ${isActive ? 'w-3 bg-blue-500 h-1' : 'w-1.5 h-1.5 bg-slate-400'}`} />
                        )}
                    </button>
                )
            })}
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full gap-1">
            <button className="p-1 hover:bg-white/40 rounded mx-1 transition hidden sm:block"><ChevronUp size={16} className="text-slate-600" /></button>
            
            {/* Quick Settings Trigger */}
            <button 
                id="quick-settings-trigger"
                onClick={() => { setQuickSettingsOpen(!quickSettingsOpen); setCalendarOpen(false); }}
                className={`flex items-center gap-2 px-2 py-1 hover:bg-white/40 rounded-md transition h-[80%] my-auto ${quickSettingsOpen ? 'bg-white/40' : ''}`}
                title="Internet access, Speakers"
            >
                <Wifi size={16} className="text-slate-700" />
                <Volume2 size={16} className="text-slate-700" />
                <Battery size={16} className="text-slate-700" />
            </button>

            {/* Calendar/Date Trigger */}
            <button 
                id="calendar-trigger"
                onClick={() => { setCalendarOpen(!calendarOpen); setQuickSettingsOpen(false); }}
                className={`flex flex-col items-end justify-center px-2 py-1 hover:bg-white/40 hover:border-white/10 border border-transparent rounded-md transition duration-200 text-right min-w-[70px] h-[80%] my-auto mr-1 group ${calendarOpen ? 'bg-white/40 shadow-inner' : ''}`}
                title={time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
            >
                <span className="text-xs font-medium text-slate-800 leading-none mb-0.5">{time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</span>
                <span className="text-[11px] text-slate-600 leading-none">{time.toLocaleDateString()}</span>
            </button>
            
            {/* Notification Bell (Visual only, Win11 often hides this but useful for cue) */}
            <div className="h-full flex items-center justify-center w-8 sm:hidden">
                 <Bell size={16} className="text-slate-600"/>
            </div>

            {/* Show Desktop */}
             <div 
                onClick={onShowDesktop}
                className="h-full w-2 border-l border-slate-300/30 ml-1 hover:bg-white/50 cursor-pointer group relative" 
                title="Show Desktop"
             >
                 <div className="absolute bottom-0 right-0 w-full h-full"></div>
             </div>
        </div>
        </div>
    </>
  );
};

const QuickToggle: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-2 transition group ${!onClick ? 'cursor-default' : ''}`}
    >
        <div className={`w-full h-12 rounded-2xl flex items-center justify-center border border-transparent transition ${active ? 'bg-blue-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
            {icon}
        </div>
        <span className="text-xs text-slate-700 truncate max-w-full font-medium">{label}</span>
    </button>
);

export default Taskbar;