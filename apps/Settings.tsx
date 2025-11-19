import React, { useState } from 'react';
import { AppProps } from '../types';
import { Monitor, Image, Layout, User, Volume2, Wifi, Battery, Info, Check } from 'lucide-react';

const wallpapers = [
    "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop", // Dark Mountains
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop", // Alpine
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop", // Yosemite
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop", // Abstract Fluid
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1974&auto=format&fit=crop", // Abstract Lines
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop", // Gradient
];

const Settings: React.FC<AppProps> = ({ systemState, setSystemState }) => {
  const [activeTab, setActiveTab] = useState('personalization');

  const SidebarItem = ({ id, icon, label }: { id: string, icon: React.ReactNode, label: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-2 py-2 rounded-md mb-1 transition text-sm font-medium ${activeTab === id ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
      >
          <div className="text-slate-500">{icon}</div>
          {label}
      </button>
  );

  return (
    <div className="h-full flex bg-[#f3f3f3] text-slate-900 font-sans select-none">
      {/* Sidebar */}
      <div className="w-60 p-4 pt-6 flex flex-col gap-1 border-r border-slate-200/60 bg-[#f0f3f9]/50">
        <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">U</div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">User</span>
                <span className="text-xs text-slate-500">Local Account</span>
            </div>
        </div>
        
        <div className="relative mb-2">
             <input type="text" placeholder="Find a setting" className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>

        <SidebarItem id="system" icon={<Monitor size={18}/>} label="System" />
        <SidebarItem id="bluetooth" icon={<Wifi size={18}/>} label="Bluetooth & devices" />
        <SidebarItem id="personalization" icon={<Image size={18}/>} label="Personalization" />
        <SidebarItem id="apps" icon={<Layout size={18}/>} label="Apps" />
        <SidebarItem id="accounts" icon={<User size={18}/>} label="Accounts" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#f9f9f9]">
          <h1 className="text-2xl font-semibold mb-6 capitalize">{activeTab === 'bluetooth' ? 'Bluetooth & devices' : activeTab}</h1>
          
          {activeTab === 'personalization' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="font-semibold">Background</h2>
                          <span className="text-xs text-slate-500">Select a background to customize your desktop</span>
                      </div>
                      
                      {/* Preview */}
                      <div className="w-full h-48 rounded-lg bg-slate-200 mb-4 overflow-hidden relative shadow-inner border border-slate-300">
                          <img src={systemState.wallpaper} className="w-full h-full object-cover transition-all duration-500" alt="Current Wallpaper" />
                          
                          {/* Mock Desktop UI in Preview */}
                          <div className={`absolute bottom-2 ${systemState.centerTaskbar ? 'left-1/2 -translate-x-1/2' : 'left-2'} flex gap-1 p-1 rounded bg-white/40 backdrop-blur-md`}>
                              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                              <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                              <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                          </div>
                      </div>

                      <h3 className="text-sm font-medium mb-3">Recent images</h3>
                      <div className="grid grid-cols-3 gap-3">
                          {wallpapers.map((wp, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setSystemState({ wallpaper: wp })}
                                className={`relative aspect-video rounded-md overflow-hidden border-2 transition group hover:opacity-90 ${systemState.wallpaper === wp ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-slate-300'}`}
                              >
                                  <img src={wp} className="w-full h-full object-cover" alt={`Wallpaper ${idx + 1}`} />
                                  {systemState.wallpaper === wp && (
                                      <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-0.5 rounded-full">
                                          <Check size={10} />
                                      </div>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 rounded-md"><Layout size={20} /></div>
                             <div>
                                 <h3 className="font-medium text-sm">Taskbar alignment</h3>
                                 <p className="text-xs text-slate-500">Choose where to align the taskbar icons</p>
                             </div>
                         </div>
                         <div className="flex bg-slate-100 rounded p-1 border border-slate-200">
                             <button 
                                onClick={() => setSystemState({ centerTaskbar: false })}
                                className={`px-3 py-1 text-xs rounded transition ${!systemState.centerTaskbar ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:bg-white/50'}`}
                             >
                                 Left
                             </button>
                             <button 
                                onClick={() => setSystemState({ centerTaskbar: true })}
                                className={`px-3 py-1 text-xs rounded transition ${systemState.centerTaskbar ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:bg-white/50'}`}
                             >
                                 Center
                             </button>
                         </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'system' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
                            <Monitor size={48} className="text-slate-400" />
                            <div>
                                <h2 className="text-lg font-semibold">DESKTOP-GEMINI-WEB</h2>
                                <p className="text-sm text-slate-500">Win11 Web Clone • {navigator.hardwareConcurrency} vCores • 16 GB RAM</p>
                                <div className="flex gap-2 mt-2">
                                    <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Rename</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-slate-200 p-0 overflow-hidden">
                         <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                             <div className="flex items-center gap-3">
                                 <Monitor size={18} className="text-slate-500" />
                                 <div className="flex flex-col">
                                     <span className="text-sm font-medium">Display</span>
                                     <span className="text-xs text-slate-500">Monitors, brightness, night light, display profile</span>
                                 </div>
                             </div>
                             <span className="text-slate-400">›</span>
                         </div>
                         <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                             <div className="flex items-center gap-3">
                                 <Volume2 size={18} className="text-slate-500" />
                                 <div className="flex flex-col">
                                     <span className="text-sm font-medium">Sound</span>
                                     <span className="text-xs text-slate-500">Volume, speakers, input devices</span>
                                 </div>
                             </div>
                             <span className="text-slate-400">›</span>
                         </div>
                         <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                             <div className="flex items-center gap-3">
                                 <Battery size={18} className="text-slate-500" />
                                 <div className="flex flex-col">
                                     <span className="text-sm font-medium">Power & battery</span>
                                     <span className="text-xs text-slate-500">Sleep, battery usage, battery saver</span>
                                 </div>
                             </div>
                             <span className="text-slate-400">›</span>
                         </div>
                    </div>

                     <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <Info size={20} className="text-blue-500" />
                            <div>
                                <h3 className="text-sm font-medium">About this project</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    This is a web-based clone of Windows 11 built with React, Tailwind CSS, and Google Gemini API.
                                    It features a functional window manager, file system simulation, and AI integration.
                                </p>
                            </div>
                        </div>
                     </div>
               </div>
          )}
      </div>
    </div>
  );
};

export default Settings;