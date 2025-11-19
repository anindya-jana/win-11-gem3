import React, { useState } from 'react';
import { AppProps, FileNode } from '../types';
import { Folder, FileText, Image, ChevronRight, ChevronDown, HardDrive, Music, Video, Code, Download, Monitor, Layout, Cpu } from 'lucide-react';

const initialFiles: FileNode[] = [
  {
    id: 'root',
    name: 'This PC',
    type: 'folder',
    children: [
      {
        id: 'c_drive',
        name: 'Local Disk (C:)',
        type: 'folder',
        children: [
            {
                id: 'program_files',
                name: 'Program Files',
                type: 'folder',
                children: [
                    { id: 'gemini_app', name: 'Gemini', type: 'folder', children: [] },
                    { id: 'chrome', name: 'Google', type: 'folder', children: [] },
                    { id: 'vs_code', name: 'Microsoft VS Code', type: 'folder', children: [] },
                ]
            },
            {
                id: 'windows',
                name: 'Windows',
                type: 'folder',
                children: [
                    { id: 'sys32', name: 'System32', type: 'folder', children: [
                         { id: 'kernel', name: 'kernel32.dll', type: 'file', content: '' },
                         { id: 'cmd', name: 'cmd.exe', type: 'file', content: '' },
                    ] },
                    { id: 'fonts', name: 'Fonts', type: 'folder', children: [] },
                ]
            },
            {
                id: 'users',
                name: 'Users',
                type: 'folder',
                children: [
                    {
                        id: 'user_folder',
                        name: 'User',
                        type: 'folder',
                        children: [
                            {
                                id: 'docs',
                                name: 'Documents',
                                type: 'folder',
                                children: [
                                  { id: 'resume', name: 'Resume.txt', type: 'text', content: 'JOHN DOE\n\nFrontend Engineer\n\nExperience:\n- Built Windows 11 Clone\n- React Expert\n\nSkills:\n- TypeScript, Tailwind, AI Integration' },
                                  { id: 'notes', name: 'Project Notes.txt', type: 'text', content: 'TODO:\n1. Fix Start Menu\n2. Improve dragging\n3. Add more apps' },
                                  { 
                                    id: 'projects', 
                                    name: 'Projects', 
                                    type: 'folder', 
                                    children: [
                                       { id: 'code1', name: 'main.tsx', type: 'text', content: 'console.log("Hello World");' },
                                       { id: 'code2', name: 'styles.css', type: 'text', content: 'body { background: #000; }' },
                                    ]
                                  }
                                ]
                              },
                              {
                                id: 'pics',
                                name: 'Pictures',
                                type: 'folder',
                                children: [
                                  { id: 'img1', name: 'Vacation.jpg', type: 'image', content: 'https://picsum.photos/id/20/800/600' },
                                  { id: 'img2', name: 'Setup.jpg', type: 'image', content: 'https://picsum.photos/id/36/800/600' },
                                  { id: 'img3', name: 'Nature.jpg', type: 'image', content: 'https://picsum.photos/id/28/800/600' },
                                  { id: 'img4', name: 'City.jpg', type: 'image', content: 'https://picsum.photos/id/43/800/600' },
                                  { id: 'img5', name: 'Abstract.jpg', type: 'image', content: 'https://picsum.photos/id/55/800/600' },
                                  { id: 'img6', name: 'Coffee.jpg', type: 'image', content: 'https://picsum.photos/id/63/800/600' },
                                ]
                              },
                              {
                                id: 'music',
                                name: 'Music',
                                type: 'folder',
                                children: [
                                    { id: 'song1', name: 'Chill Vibes.mp3', type: 'file', content: '' },
                                    { id: 'song2', name: 'Coding Focus.mp3', type: 'file', content: '' },
                                    { id: 'song3', name: 'Synthwave Mix.mp3', type: 'file', content: '' },
                                ]
                              },
                              {
                                id: 'videos',
                                name: 'Videos',
                                type: 'folder',
                                children: [
                                    { id: 'vid1', name: 'Demo.mp4', type: 'file', content: '' },
                                    { id: 'vid2', name: 'Tutorial.mp4', type: 'file', content: '' },
                                ]
                              },
                              {
                                id: 'downloads',
                                name: 'Downloads',
                                type: 'folder',
                                children: [
                                     { id: 'dl1', name: 'installer_v2.exe', type: 'file', content: '' },
                                     { id: 'dl2', name: 'archive.zip', type: 'file', content: '' },
                                ]
                              }
                        ]
                    }
                ]
            }
        ]
      },
    ]
  }
];

const Explorer: React.FC<AppProps> = ({ launchApp }) => {
  const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  
  // Default to Documents if path is empty, or Root if deeply navigated
  const rootNode = initialFiles[0];
  
  // Resolve current folder logic
  let currentFolder = rootNode;
  if (currentPath.length > 0) {
      currentFolder = currentPath[currentPath.length - 1];
  } else {
      // Start at "This PC" -> "C:" -> "Users" -> "User"
      // For simplicity, we just show "This PC" children (C:) at root, 
      // but let's make the default view the User folder for better UX
      // Or keep it at This PC which contains C:
  }

  const handleNavigate = (folder: FileNode) => {
    if (folder.type === 'folder') {
      if (folder.id === 'root') {
        setCurrentPath([]);
      } else {
        setCurrentPath([...currentPath, folder]);
      }
      setSelectedFile(null);
    }
  };

  const handleUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleFileOpen = (file: FileNode) => {
      if (file.type === 'text') {
          launchApp('notepad', { content: file.content, title: file.name });
      } else if (file.type === 'image') {
          launchApp('photos', { url: file.content, title: file.name });
      }
  };

  const getIcon = (file: FileNode) => {
      if (file.type === 'folder') {
          if (file.name.includes('Disk')) return <HardDrive size={48} className="text-gray-400 fill-gray-200" />;
          return <Folder size={48} className="text-yellow-400 fill-yellow-400" />;
      }
      if (file.type === 'image') return <Image size={48} className="text-sky-500" />;
      if (file.name.endsWith('.mp3')) return <Music size={48} className="text-pink-500" />;
      if (file.name.endsWith('.mp4')) return <Video size={48} className="text-purple-500" />;
      if (file.name.endsWith('.tsx') || file.name.endsWith('.css')) return <Code size={48} className="text-blue-500" />;
      if (file.name.endsWith('.exe') || file.name.endsWith('.zip')) return <Download size={48} className="text-green-600" />;
      if (file.name.endsWith('.dll')) return <Cpu size={48} className="text-gray-500" />;
      return <FileText size={48} className="text-blue-400" />;
  };

  return (
    <div className="h-full flex flex-col bg-white text-sm select-none">
      {/* Ribbon / Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex items-center gap-2 h-12">
         <button disabled={currentPath.length === 0} onClick={handleUp} className="px-2 py-1 hover:bg-gray-200 rounded disabled:opacity-50 text-gray-600 transition">↑ Up</button>
         <div className="flex-1 border px-3 py-1.5 bg-white rounded flex items-center text-gray-600 shadow-sm text-xs sm:text-sm">
            <Monitor size={14} className="mr-2 text-gray-500" />
            <span className="cursor-pointer hover:bg-gray-100 px-1 rounded" onClick={() => setCurrentPath([])}>This PC</span>
            {currentPath.map(p => (
                <React.Fragment key={p.id}>
                    <ChevronRight size={14} className="mx-1 text-gray-400"/>
                    <span className="cursor-pointer hover:bg-gray-100 px-1 rounded truncate max-w-[100px]" onClick={() => {
                        const idx = currentPath.indexOf(p);
                        setCurrentPath(currentPath.slice(0, idx + 1));
                    }}>{p.name}</span>
                </React.Fragment>
            ))}
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 bg-gray-50 border-r p-2 overflow-y-auto hidden md:block">
            <div className="text-xs font-semibold text-gray-500 mb-2 px-2">Quick Access</div>
            <SidebarItem node={rootNode} onNavigate={(n) => { if(n.id==='root') setCurrentPath([]); else setCurrentPath([n]); }} activePath={currentPath} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 overflow-y-auto bg-white" onClick={() => setSelectedFile(null)}>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {currentFolder.children?.map(child => (
                    <div 
                        key={child.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(child); }}
                        onDoubleClick={(e) => { e.stopPropagation(); child.type === 'folder' ? handleNavigate(child) : handleFileOpen(child); }}
                        className={`group flex flex-col items-center p-2 rounded-sm border border-transparent transition-all cursor-default ${selectedFile?.id === child.id ? 'bg-blue-100 border-blue-200' : 'hover:bg-blue-50'}`}
                    >
                        <div className="mb-2 transform transition-transform duration-200">
                            {getIcon(child)}
                        </div>
                        <span className="text-center truncate w-full text-xs px-1 rounded leading-tight">{child.name}</span>
                    </div>
                ))}
                {currentFolder.children?.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 mt-10 flex flex-col items-center">
                        <Folder size={48} className="mb-2 opacity-20" />
                        <span>This folder is empty.</span>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Info */}
        <div className="h-6 bg-gray-50 border-t flex items-center px-4 text-xs text-gray-500 gap-4">
            <span>{currentFolder.children?.length || 0} items</span>
            {selectedFile && <span>Selected: {selectedFile.name}</span>}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ node: FileNode, onNavigate: (n: FileNode) => void, activePath: FileNode[] }> = ({ node, onNavigate, activePath }) => {
    const [expanded, setExpanded] = useState(true);
    
    const getSidebarIcon = (n: FileNode) => {
         if (n.id === 'root') return <Monitor size={14} className="text-gray-500" />;
         if (n.name.includes('Disk')) return <HardDrive size={14} className="text-gray-500" />;
         if (n.name === 'Documents') return <FileText size={14} className="text-gray-500" />;
         if (n.name === 'Pictures') return <Image size={14} className="text-gray-500" />;
         if (n.name === 'Music') return <Music size={14} className="text-gray-500" />;
         if (n.name === 'Videos') return <Video size={14} className="text-gray-500" />;
         return <Folder size={14} className="text-yellow-400 fill-yellow-400" />;
    };

    return (
        <div className="ml-2 select-none">
            <div className="flex items-center gap-1 py-0.5 hover:bg-gray-200 rounded px-1 cursor-pointer text-gray-700" onClick={() => onNavigate(node)}>
                {node.children && node.children.length > 0 ? (
                    <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="hover:bg-gray-300 rounded p-0.5 text-gray-400">
                        {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </button>
                ) : <div className="w-4" />}
                {getSidebarIcon(node)}
                <span className="truncate text-xs">{node.name}</span>
            </div>
            {expanded && node.children?.filter(c => c.type === 'folder').map(child => (
                <SidebarItem key={child.id} node={child} onNavigate={onNavigate} activePath={activePath} />
            ))}
        </div>
    )
}

export default Explorer;