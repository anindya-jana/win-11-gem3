import React, { useState, useRef, useEffect } from 'react';
import { AppProps } from '../types';
import { createChatSession } from '../services/gemini';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const Copilot: React.FC<AppProps> = () => {
  const [messages, setMessages] = useState<Message[]>([
      { id: 'init', role: 'model', text: "Hi! I'm your Windows Copilot powered by Gemini. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatSession = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isStreaming) return;

      const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsStreaming(true);

      try {
        const result = await chatSession.current.sendMessageStream({ message: userMsg.text });
        
        const botMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

        let fullText = '';
        for await (const chunk of result) {
             const c = chunk as GenerateContentResponse;
             const text = c.text || '';
             fullText += text;
             setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
        }
      } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I encountered an error connecting to Gemini." }]);
      } finally {
          setIsStreaming(false);
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/80 backdrop-blur-xl">
        <div className="p-4 border-b bg-white/50 flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">Copilot (Preview)</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'}`}>
                        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}`}>
                        <div className="whitespace-pre-wrap font-sans">
                            {m.text}
                        </div>
                    </div>
                </div>
            ))}
            {isStreaming && (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shrink-0">
                        <Bot size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <Loader2 className="animate-spin text-blue-600" size={16} />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white/80 border-t backdrop-blur-md">
            <div className="relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-slate-100 border-0 rounded-full pl-4 pr-12 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Send size={16} />
                </button>
            </div>
        </form>
    </div>
  );
};

export default Copilot;