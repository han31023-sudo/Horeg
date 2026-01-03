import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2 } from 'lucide-react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  toggleLyrics: () => void;
  showLyrics: boolean;
}

const Player: React.FC<PlayerProps> = ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, toggleLyrics, showLyrics }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Fungsi Play/Pause
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          console.log("Klik layar dulu biar suara keluar!");
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const onTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#000000] border-t border-[#282828] flex items-center justify-between px-4 z-50">
      <audio 
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onNext}
        preload="auto"
      />

      {/* Info Lagu - Kiri */}
      <div className="flex items-center gap-4 w-[30%]">
        <img src={currentSong.coverUrl} className="h-14 w-14 rounded shadow-lg object-cover" alt="cover" />
        <div className="overflow-hidden">
          <div className="text-sm font-bold text-white truncate">{currentSong.title}</div>
          <div className="text-xs text-[#b3b3b3] truncate">{currentSong.artist}</div>
        </div>
      </div>

      {/* Control - Tengah */}
      <div className="flex flex-col items-center w-[40%] max-w-[600px]">
        <div className="flex items-center gap-6 mb-2">
          <button onClick={onPrev} className="text-[#b3b3b3] hover:text-white transition"><SkipBack size={20} /></button>
          <button 
            onClick={onPlayPause} 
            className="bg-white rounded-full p-2 text-black hover:scale-105 transition active:scale-95"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="pl-1" />}
          </button>
          <button onClick={onNext} className="text-[#b3b3b3] hover:text-white transition"><SkipForward size={20} /></button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[10px] text-[#b3b3b3] min-w-[30px] text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full relative group">
            <div 
              className="absolute h-full bg-white group-hover:bg-[#1DB954] rounded-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-[#b3b3b3] min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Fitur Lain - Kanan */}
      <div className="flex items-center gap-4 w-[30%] justify-end">
        <button 
          onClick={toggleLyrics} 
          className={`${showLyrics ? 'text-[#1DB954]' : 'text-[#b3b3b3]'} hover:text-white`}
        >
          <Mic2 size={18} />
        </button>
        <div className="flex items-center gap-2 w-24">
          <Volume2 size={18} text-[#b3b3b3] />
          <div className="flex-1 h-1 bg-[#4d4d4d] rounded-full">
            <div className="h-full bg-white rounded-full w-[70%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
