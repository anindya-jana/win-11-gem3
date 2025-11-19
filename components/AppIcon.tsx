import React, { useState } from 'react';
import { Globe, Folder, Calculator, Sparkles, Image, Gamepad2, FileText, Music, Video, FileType, Bomb, Activity, Settings, Shield } from 'lucide-react';

interface AppIconProps {
  iconName: string;
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ iconName, size = 24, className = "" }) => {
  const props = { size, className };
  
  // Map generic names to Lucide icons with Windows-like colors
  switch (iconName) {
    case 'chrome': 
    case 'browser':
      // Chrome colors - we can't do multi-color svg easily with Lucide, so we use Blue/Teal
      return <Globe {...props} className={`text-blue-500 ${className}`} />;
    case 'folder': 
    case 'explorer':
      return <Folder {...props} className={`text-yellow-400 fill-yellow-400 ${className}`} />;
    case 'calculator': 
      return <Calculator {...props} className={`text-cyan-600 ${className}`} />;
    case 'copilot': 
    case 'sparkles':
      return <Sparkles {...props} className={`text-purple-500 ${className}`} />;
    case 'image': 
    case 'photos':
      return <Image {...props} className={`text-sky-500 ${className}`} />;
    case 'gamepad-2': 
    case 'tictactoe':
      return <Gamepad2 {...props} className={`text-indigo-500 ${className}`} />;
    case 'file-text':
    case 'notepad':
        return <FileText {...props} className={`text-blue-400 ${className}`} />;
    case 'minesweeper':
        return <Bomb {...props} className={`text-red-500 ${className}`} />;
    case 'snake':
        return <Activity {...props} className={`text-green-500 ${className}`} />;
    case 'settings':
        return <Settings {...props} className={`text-gray-600 ${className}`} />;
    case 'security':
    case 'shield':
        return <Shield {...props} className={`text-emerald-500 ${className}`} />;
    default: 
      return <FileType {...props} className={`text-slate-500 ${className}`} />;
  }
};

export default AppIcon;