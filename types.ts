import React, { ReactNode } from 'react';

export interface AppDefinition {
  id: string;
  title: string;
  icon: string; // Lucide icon name or image URL
  component: React.FC<AppProps>;
  defaultWidth?: number;
  defaultHeight?: number;
}

export interface SystemState {
  wallpaper: string;
  isDark: boolean;
  centerTaskbar: boolean;
}

export interface AppProps {
  windowId: string;
  launchApp: (appId: string, params?: any) => void;
  initialState?: any;
  systemState: SystemState;
  setSystemState: (state: Partial<SystemState>) => void;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  initialState?: any;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'text';
  content?: string; // For text files or image URL
  children?: FileNode[];
}