import React, { useState, useEffect, useRef } from 'react';
import { AppProps } from '../types';
import { generateWebsiteContent } from '../services/gemini';
import { ArrowLeft, ArrowRight, RotateCw, Search, Home, Globe, Lock, Star } from 'lucide-react';

const Browser: React.FC<AppProps> = ({ initialState }) => {
  const [input, setInput] = useState('https://google.com');
  const [url, setUrl] = useState('https://google.com');
  const [history, setHistory] = useState<string[]>(['https://google.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);

  // Load initial page only once or when initialState explicitly changes to a new URL
  useEffect(() => {
      if (!mounted.current) {
          mounted.current = true;
          if (initialState?.url) {
              const startUrl = initialState.url;
              setInput(startUrl);
              loadPage(startUrl);
          } else {
              loadPage('https://google.com');
          }
      } else if (initialState?.url && initialState.url !== url) {
          // If prop changes while mounted (e.g. opening a link from another app while browser is open)
          const startUrl = initialState.url;
          setInput(startUrl);
          loadPage(startUrl);
      }
  }, [initialState]);

  const loadPage = async (targetUrl: string) => {
      setLoading(true);
      setUrl(targetUrl);
      // Update input if it differs (unless user is typing, but here we assume navigation)
      setInput(targetUrl);
      
      const content = await generateWebsiteContent(targetUrl);
      setHtmlContent(content);
      setLoading(false);
  };

  const handleNavigate = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      let target = input.trim();
      
      if (!target.includes('.') && !target.includes('://')) {
          // Treat as search
          target = `Google Search: ${target}`;
      } else if (!target.startsWith('http')) {
          target = `https://${target}`;
      }

      const newHistory = [...history.slice(0, historyIndex + 1), target];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      loadPage(target);
  };

  const goBack = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const prevUrl = history[newIndex];
          setInput(prevUrl.startsWith('Google Search:') ? prevUrl.replace('Google Search: ', '') : prevUrl);
          loadPage(prevUrl);
      }
  };

  const goForward = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const nextUrl = history[newIndex];
          setInput(nextUrl.startsWith('Google Search:') ? nextUrl.replace('Google Search: ', '') : nextUrl);
          loadPage(nextUrl);
      }
  };

  const refresh = () => {
      loadPage(url);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="flex flex-col bg-[#f9f9f9] border-b border-gray-300 pt-2 pb-2">
        {/* Top Bar: Tabs would go here, simplifying to just nav */}
        <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1 text-gray-600">
                <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 hover:bg-gray-200 rounded-full disabled:opacity-30 transition"><ArrowLeft size={16} /></button>
                <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-gray-200 rounded-full disabled:opacity-30 transition"><ArrowRight size={16} /></button>
                <button onClick={refresh} className="p-1.5 hover:bg-gray-200 rounded-full transition"><RotateCw size={14} className={`${loading ? 'animate-spin' : ''}`} /></button>
            </div>
            
            <form onSubmit={handleNavigate} className="flex-1">
                <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500`}>
                        {url.startsWith('https') ? <Lock size={12} className="text-green-600" /> : <Globe size={12} />}
                    </div>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full pl-8 pr-8 py-1.5 bg-[#ececec] hover:bg-[#e6e6e6] focus:bg-white border-2 border-transparent focus:border-blue-500/50 rounded-full text-sm focus:outline-none transition-all shadow-sm text-slate-700 placeholder-gray-500"
                        placeholder="Search Google or type a URL"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                        <Star size={14} className="hover:text-blue-500 cursor-pointer" />
                    </div>
                </div>
            </form>

            <div className="flex items-center gap-2 px-1 text-gray-600">
                <button className="p-1.5 hover:bg-gray-200 rounded-full"><Home size={18} /></button>
            </div>
        </div>
        
        {/* Bookmarks Bar (Static) */}
        <div className="flex gap-4 px-4 pt-2 text-xs text-gray-600 overflow-hidden">
            <button onClick={() => loadPage('https://gmail.com')} className="hover:bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1"><img src="https://www.google.com/s2/favicons?domain=gmail.com" className="w-3 h-3"/> Gmail</button>
            <button onClick={() => loadPage('https://youtube.com')} className="hover:bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1"><img src="https://www.google.com/s2/favicons?domain=youtube.com" className="w-3 h-3"/> YouTube</button>
            <button onClick={() => loadPage('https://github.com')} className="hover:bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1"><img src="https://www.google.com/s2/favicons?domain=github.com" className="w-3 h-3"/> GitHub</button>
            <button onClick={() => loadPage('https://news.google.com')} className="hover:bg-gray-200 px-2 py-0.5 rounded flex items-center gap-1"><img src="https://www.google.com/s2/favicons?domain=news.google.com" className="w-3 h-3"/> News</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-4">
                 <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                 <p className="text-gray-500 animate-pulse font-medium">Loading {url}...</p>
            </div>
        )}
        
        <iframe 
            title="browser-view"
            srcDoc={htmlContent}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-forms allow-same-origin allow-presentation"
        />
      </div>
    </div>
  );
};

export default Browser;