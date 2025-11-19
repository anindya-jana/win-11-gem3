import React, { useRef } from 'react';
import { X, Minus, Square, Minimize2 } from 'lucide-react';
import { WindowState } from '../types';
import { useDraggable } from '../hooks/useDraggable';
import AppIcon from './AppIcon';

interface WindowProps {
  windowState: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, pos: { x: number; y: number }) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ windowState, onClose, onMinimize, onMaximize, onFocus, onMove, children }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  
  const { position, handleMouseDown, isDragging } = useDraggable(
    windowRef,
    windowState.position,
    windowState.isMaximized,
    (pos) => onMove(windowState.id, pos)
  );

  // Instead of returning null, we return the component with display: none
  // This preserves the internal state of the app (e.g. Calculator memory, Browser history)
  if (!windowState.isOpen) return null;

  const baseStyle = windowState.isMaximized
    ? "fixed inset-0 w-full h-full rounded-none"
    : "fixed rounded-lg shadow-2xl border border-slate-300/50";
    
  const style: React.CSSProperties = {
      ...(windowState.isMaximized ? { zIndex: windowState.zIndex } : {
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${windowState.size.width}px`,
          height: `${windowState.size.height}px`,
          zIndex: windowState.zIndex,
      }),
      display: windowState.isMinimized ? 'none' : 'flex'
  };

  return (
    <div
      ref={windowRef}
      className={`${baseStyle} flex-col bg-slate-100 overflow-hidden transition-shadow duration-200 ${isDragging ? 'shadow-none select-none ring-2 ring-blue-400/50' : ''}`}
      style={style}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Title Bar */}
      <div 
        className="window-drag-handle h-9 flex items-center justify-between px-3 select-none cursor-default bg-white border-b border-slate-200"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 pointer-events-none">
            <AppIcon iconName={windowState.icon} size={14} />
            <span>{windowState.title}</span>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }} className="p-2 hover:bg-slate-200 rounded transition"><Minus size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }} className="p-2 hover:bg-slate-200 rounded transition">
                {windowState.isMaximized ? <Minimize2 size={12} /> : <Square size={10} />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }} className="p-2 hover:bg-red-500 hover:text-white rounded transition"><X size={12} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {children}
      </div>
    </div>
  );
};

export default Window;