
import React, { useState, useEffect, useRef } from 'react';
import { AppProps } from '../types';
import { Settings, Plus, X } from 'lucide-react';

const Notepad: React.FC<AppProps> = ({ initialState }) => {
  const [content, setContent] = useState(initialState?.content || '');
  const [fileName, setFileName] = useState(initialState?.title || 'Untitled.txt');
  const [isDirty, setIsDirty] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleNew = () => {
    if (isDirty && content.length > 0) {
       if (!confirm("You have unsaved changes. Are you sure you want to create a new file?")) return;
    }
    setContent('');
    setFileName('Untitled.txt');
    setIsDirty(false);
    setShowFileMenu(false);
  };

  const downloadFile = (name: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDirty(false);
  };

  const handleSave = () => {
    downloadFile(fileName);
    setShowFileMenu(false);
  };

  const handleSaveAs = () => {
    const name = prompt("Enter file name:", fileName);
    if (name) {
        setFileName(name.endsWith('.txt') ? name : `${name}.txt`);
        downloadFile(name.endsWith('.txt') ? name : `${name}.txt`);
    }
    setShowFileMenu(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#ffffff] text-slate-900 relative">
      {/* Windows 11 Notepad Header Style */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f3f3f3] border-b border-gray-200 select-none">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-200">
                <span className="text-xs font-medium truncate max-w-[150px]">{isDirty ? '*' : ''}{fileName}</span>
                <X size={12} className="text-gray-400 cursor-pointer hover:text-gray-700" onClick={handleNew} />
             </div>
             <button className="p-1.5 hover:bg-gray-200 rounded transition text-gray-500">
                <Plus size={16} />
             </button>
          </div>
          <div className="flex gap-2">
              <button className="p-1.5 hover:bg-gray-200 rounded transition text-gray-500">
                  <Settings size={16} />
              </button>
          </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-gray-100 text-xs text-gray-700 bg-white select-none relative z-20">
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setShowFileMenu(!showFileMenu)}
                className={`px-3 py-1 rounded transition ${showFileMenu ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
                File
            </button>
            {showFileMenu && (
                <div className="absolute top-full left-0 w-56 bg-[#f9f9f9] backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-200 rounded-lg py-1 mt-1 flex flex-col text-sm animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={handleNew} className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex justify-between group">
                        <span>New Tab</span>
                        <span className="text-gray-400 group-hover:text-white/80 text-xs">Ctrl+N</span>
                    </button>
                    <button className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex justify-between group">
                        <span>New Window</span>
                        <span className="text-gray-400 group-hover:text-white/80 text-xs">Ctrl+Shift+N</span>
                    </button>
                    <div className="h-px bg-gray-200 my-1 mx-2" />
                    <button onClick={handleSave} className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex justify-between group">
                        <span>Save</span>
                        <span className="text-gray-400 group-hover:text-white/80 text-xs">Ctrl+S</span>
                    </button>
                    <button onClick={handleSaveAs} className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex justify-between group">
                        <span>Save As...</span>
                        <span className="text-gray-400 group-hover:text-white/80 text-xs">Ctrl+Shift+S</span>
                    </button>
                    <div className="h-px bg-gray-200 my-1 mx-2" />
                    <button className="text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors">Exit</button>
                </div>
            )}
        </div>
        <button className="hover:bg-gray-100 px-3 py-1 rounded transition">Edit</button>
        <button className="hover:bg-gray-100 px-3 py-1 rounded transition">View</button>
      </div>
      
      {/* Editor Area */}
      <textarea 
        className="flex-1 w-full h-full resize-none p-6 focus:outline-none font-mono text-sm text-slate-800 leading-relaxed selection:bg-blue-200"
        value={content}
        onChange={handleContentChange}
        spellCheck={false}
        placeholder="Type something..."
        style={{ fontFamily: '"Consolas", "Monaco", "Courier New", monospace' }}
      />
      
      {/* Status Bar */}
      <div className="h-7 bg-[#f3f3f3] border-t border-gray-200 flex items-center px-4 text-[11px] text-gray-500 justify-end gap-6 select-none font-medium">
        <span>Ln {content.split('\n').length}, Col {content.length}</span>
        <span>100%</span>
        <span>Windows (CRLF)</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
};

export default Notepad;
