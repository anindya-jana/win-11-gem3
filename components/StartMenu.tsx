import React from 'react';
import { AppDefinition } from '../types';
import { Search, Power, User } from 'lucide-react';
import AppIcon from './AppIcon';

interface StartMenuProps {
    isOpen: boolean;
    apps: AppDefinition[];
    onLaunch: (app: AppDefinition) => void;
    onLaunchById: (id: string, params?: any) => void;
    onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onLaunch, onLaunchById, onClose }) => {
  if (!isOpen) return null;

  const handleLaunch = (id: string, params?: any) => {
      onLaunchById(id, params);
      onClose();
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[640px] h-[600px] max-h-[80vh] max-w-[95vw] bg-slate-100/85 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/40 flex flex-col z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-200 overflow-hidden">
      {/* Search Bar */}
      <div className="p-6 pb-4">
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="Search for apps, settings, and documents" 
                className="w-full bg-slate-50/80 border-b-2 border-transparent focus:border-blue-500 rounded-t-md py-3 pl-12 pr-4 text-sm focus:outline-none transition-colors shadow-sm"
            />
        </div>
      </div>

      {/* Pinned Apps */}
      <div className="flex-1 px-8 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Pinned</h3>
              <button className="text-xs text-slate-500 bg-white px-2 py-1 rounded border hover:bg-slate-50 transition">All apps &gt;</button>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
              {apps.map(app => (
                  <button 
                    key={app.id}
                    onClick={() => { onLaunch(app); onClose(); }}
                    className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/50 active:scale-95 transition group"
                    title={app.title}
                  >
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg text-xl group-hover:scale-105 transition shadow-sm bg-white/50">
                        <AppIcon iconName={app.icon} size={28} />
                      </div>
                      <span className="text-xs text-slate-700 font-medium truncate w-full text-center">{app.title}</span>
                  </button>
              ))}
          </div>

          <div className="mt-8">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Recommended</h3>
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleLaunch('notepad', { content: 'JOHN DOE\n\nFrontend Engineer\n...', title: 'Resume.txt' })}
                    className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer text-left transition group"
                  >
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-600 shadow-sm group-hover:shadow">
                        <AppIcon iconName="file-text" size={16} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-slate-800 font-medium">Resume.txt</span>
                          <span className="text-xs text-slate-500">Yesterday at 4:20 PM</span>
                      </div>
                  </button>
                   <button 
                    onClick={() => handleLaunch('photos', { url: 'https://picsum.photos/id/12/800/600' })}
                    className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer text-left transition group"
                   >
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-purple-600 shadow-sm group-hover:shadow">
                        <AppIcon iconName="image" size={16} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-slate-800 font-medium">Vacation.jpg</span>
                          <span className="text-xs text-slate-500">Just now</span>
                      </div>
                  </button>
                   <button 
                    onClick={() => handleLaunch('browser', { url: 'https://news.google.com' })}
                    className="flex items-center gap-3 p-2 hover:bg-white/50 rounded cursor-pointer text-left transition group"
                   >
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-500 shadow-sm group-hover:shadow">
                        <AppIcon iconName="browser" size={16} />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-sm text-slate-800 font-medium">Daily News</span>
                          <span className="text-xs text-slate-500">10 min ago</span>
                      </div>
                  </button>
              </div>
          </div>
      </div>

      {/* Bottom User Bar */}
      <div className="h-14 bg-slate-200/50 border-t border-slate-300/30 flex items-center justify-between px-8 rounded-b-lg backdrop-blur-md">
          <button className="flex items-center gap-3 p-2 hover:bg-white/50 rounded transition">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full text-white flex items-center justify-center shadow-inner ring-2 ring-white/50"><User size={16} /></div>
              <span className="text-sm font-medium text-slate-700">User</span>
          </button>
          <button className="p-2 hover:bg-white/50 rounded transition text-slate-700 hover:text-red-600">
              <Power size={18} />
          </button>
      </div>
    </div>
  );
};

export default StartMenu;