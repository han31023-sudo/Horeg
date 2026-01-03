import React, { useRef } from 'react';
import { Home, Search, Library, Heart, Sparkles, Upload, FolderOpen } from 'lucide-react';
import { ViewType, Playlist } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  playlists: Playlist[];
  onSelectPlaylist: (playlist: Playlist) => void;
  onImportFiles: (files: FileList) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, playlists, onSelectPlaylist, onImportFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImportFiles(e.target.files);
    }
  };

  return (
    <div className="w-64 bg-black h-full flex flex-col gap-2 p-2 hidden md:flex text-horeg-text">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*" 
        multiple 
        className="hidden"
      />

      {/* Main Nav */}
      <div className="bg-horeg-black rounded-lg p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-horeg-primary flex items-center justify-center">
                <span className="text-black font-bold text-xl">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tighter">HOREG</span>
        </div>
        
        <button 
          onClick={() => onChangeView('HOME')}
          className={`flex items-center gap-4 px-2 font-semibold transition hover:text-white ${currentView === 'HOME' ? 'text-white' : ''}`}
        >
          <Home size={24} />
          <span>Home</span>
        </button>
        <button 
          onClick={() => onChangeView('SEARCH')}
          className={`flex items-center gap-4 px-2 font-semibold transition hover:text-white ${currentView === 'SEARCH' ? 'text-white' : ''}`}
        >
          <Search size={24} />
          <span>Search</span>
        </button>
      </div>

      {/* Library Area */}
      <div className="bg-horeg-black rounded-lg flex-1 overflow-hidden flex flex-col">
        <div className="p-4 shadow-md z-10">
          <div className="flex items-center justify-between mb-4">
             <button 
                onClick={() => onChangeView('LIBRARY')}
                className={`flex items-center gap-2 font-semibold transition hover:text-white ${currentView === 'LIBRARY' ? 'text-white' : ''}`}
              >
              <Library size={24} />
              <span>Your Library</span>
            </button>
          </div>
          
          {/* AI Feature Button */}
          <button 
            onClick={() => onChangeView('AI_GENERATOR')}
            className="w-full bg-gradient-to-r from-horeg-primary to-green-300 text-black font-bold p-3 rounded-md flex items-center justify-center gap-2 mb-3 hover:scale-105 transition-transform"
          >
            <Sparkles size={20} />
            <span>AI DJ Generator</span>
          </button>

          {/* Add Local Music Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white/10 text-white font-bold p-3 rounded-md flex items-center justify-center gap-2 mb-2 hover:bg-white/20 transition-colors border border-white/5"
          >
            <Upload size={20} />
            <span>Add Local Music</span>
          </button>
          
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
           {/* Liked Songs Entry */}
           <div className="flex items-center gap-3 p-2 rounded-md hover:bg-horeg-light cursor-pointer transition mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-700 to-blue-300 rounded-md flex items-center justify-center">
                  <Heart size={20} className="text-white fill-white" />
              </div>
              <div className="flex flex-col">
                  <span className="text-white font-medium truncate">Liked Songs</span>
                  <span className="text-sm truncate">Pin</span>
              </div>
           </div>

           {/* Playlist List */}
           {playlists.map(pl => (
             <div 
                key={pl.id} 
                onClick={() => onSelectPlaylist(pl)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-horeg-light cursor-pointer transition group"
            >
                {pl.id === 'local-files' ? (
                   <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-white">
                      <FolderOpen size={24} />
                   </div>
                ) : (
                  <img src={pl.coverUrl} alt={pl.name} className="w-12 h-12 rounded-md object-cover" />
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-white font-medium truncate group-hover:text-horeg-primary transition-colors">{pl.name}</span>
                    <span className="text-sm truncate">{pl.id === 'local-files' ? 'On This Device' : 'Playlist • Horeg User'}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
