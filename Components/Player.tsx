import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Mic2, Heart, Volume2, ChevronDown } from 'lucide-react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  toggleLyrics: () => void;
  showLyrics: boolean;
  eqSettings?: {
      bass: number;
      mid: number;
      treble: number;
  };
}

const Player: React.FC<PlayerProps> = ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, toggleLyrics, showLyrics, eqSettings }) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  
  // Audio Elements
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Web Audio API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioRef.current || audioContextRef.current) return;

    const initAudio = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaElementSource(audioRef.current!);
        sourceNodeRef.current = source;

        // ... kodingan filter bass, mid, treble kamu (tetap sama) ...
        
        // TAMBAHKAN INI: Pastikan context jalan saat user klik
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        source.connect(bass); // lanjut ke koneksi filter kamu
        // ... dst
      } catch (e) {
        console.warn("Web Audio API error:", e);
      }
    };

    // Jalankan init saat pertama kali komponen muncul
    initAudio();
  }, []);

        // Create Filters
        const bass = ctx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.value = 200; // Bass freq
        bassFilterRef.current = bass;

        const mid = ctx.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.value = 1500; // Mid freq
        mid.Q.value = 1;
        midFilterRef.current = mid;

        const treble = ctx.createBiquadFilter();
        treble.type = "highshelf";
        treble.frequency.value = 3000; // Treble freq
        trebleFilterRef.current = treble;

        // Connect Chain: Source -> Bass -> Mid -> Treble -> Destination
        source.connect(bass);
        bass.connect(mid);
        mid.connect(treble);
        treble.connect(ctx.destination);

    } catch (e) {
        console.warn("Web Audio API not supported or initialization failed:", e);
    }
  }, []);

  // Update EQ Values based on props
  useEffect(() => {
    if (eqSettings && bassFilterRef.current && midFilterRef.current && trebleFilterRef.current) {
        // Map 0-100 to Decibels
        // Bass: -10dB to +20dB (Heavy bass for HOREG)
        // Mid: -10dB to +10dB
        // Treble: -10dB to +10dB
        
        const bassGain = ((eqSettings.bass - 50) / 50) * 20; // range roughly -20 to +20
        const midGain = ((eqSettings.mid - 50) / 50) * 15;
        const trebleGain = ((eqSettings.treble - 50) / 50) * 15;

        bassFilterRef.current.gain.setTargetAtTime(bassGain, audioContextRef.current?.currentTime || 0, 0.1);
        midFilterRef.current.gain.setTargetAtTime(midGain, audioContextRef.current?.currentTime || 0, 0.1);
        trebleFilterRef.current.gain.setTargetAtTime(trebleGain, audioContextRef.current?.currentTime || 0, 0.1);
    }
  }, [eqSettings]);


  // Handle Song Changes and Playback
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl || '';
        audioRef.current.load();
        // Ensure AudioContext is running (browsers suspend it sometimes)
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
      }
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented or interrupted", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  // Setup Media Session API (Lock Screen Controls & Background Play)
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [
          { src: currentSong.coverUrl, sizes: '96x96', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '128x128', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '192x192', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '256x256', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '384x384', type: 'image/jpeg' },
          { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', onPlayPause);
      navigator.mediaSession.setActionHandler('pause', onPlayPause);
      navigator.mediaSession.setActionHandler('previoustrack', onPrev);
      navigator.mediaSession.setActionHandler('nexttrack', onNext);
    }
  }, [currentSong, onPlayPause, onNext, onPrev]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setDuration(total);
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setProgress(newVal);
    if (audioRef.current) {
      audioRef.current.currentTime = (newVal / 100) * audioRef.current.duration;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <>
      <audio 
  ref={audioRef}
  preload="auto"
  onTimeUpdate={handleTimeUpdate}
  onEnded={onNext}
  onLoadedMetadata={() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }}
/>
      
      {/* Changed pl-2/px-2 to pl-0 to force content to the absolute left edge */}
      <div className="h-24 bg-black border-t border-horeg-light pl-0 pr-2 flex items-center justify-between text-horeg-text z-[100] relative">
        
        {/* Song Info */}
        <div className="flex items-center gap-2 w-1/3 min-w-[180px] justify-start pl-2">
          <div className="relative group">
              <img src={currentSong.coverUrl} alt="cover" className="h-14 w-14 rounded-md object-cover shadow-lg transition duration-300" />
              {showLyrics && (
                  <button onClick={toggleLyrics} className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition">
                      <ChevronDown className="text-white" />
                  </button>
              )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-sm font-medium hover:underline cursor-pointer truncate">{currentSong.title}</span>
            <span className="text-xs hover:underline cursor-pointer hover:text-white transition truncate">{currentSong.artist}</span>
          </div>
          <button className="text-horeg-text hover:text-white ml-2 hidden sm:block">
              <Heart size={16} className={currentSong.isLiked ? "fill-horeg-primary text-horeg-primary" : ""} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-1/3 max-w-xl">
          <div className="flex items-center gap-6 mb-2">
            {/* Removed Shuffle */}
            <button onClick={onPrev} className="text-horeg-text hover:text-white transition"><SkipBack size={20} className="fill-current" /></button>
            <button 
              onClick={onPlayPause}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition active:scale-95"
            >
              {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="fill-black pl-0.5" />}
            </button>
            <button onClick={onNext} className="text-horeg-text hover:text-white transition"><SkipForward size={20} className="fill-current" /></button>
            
            {/* Lyrics Button - Placed next to controls */}
            <button 
                onClick={toggleLyrics}
                className={`transition ${showLyrics ? 'text-horeg-primary scale-110' : 'text-horeg-text hover:text-white'}`}
                title="Lyrics"
            >
                <Mic2 size={16} />
            </button>
            {/* Removed Repeat */}
          </div>

          <div className="w-full flex items-center gap-2 text-xs font-mono">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <div className="flex-1 h-1 bg-horeg-light rounded-full relative group cursor-pointer">
               <div className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-horeg-primary" style={{ width: `${progress}%` }}></div>
               <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress}
                  onChange={handleSliderChange}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
               />
            </div>
            <span>{formatTime(duration || 0)}</span>
          </div>
        </div>

        {/* Extra Controls */}
        <div className="flex items-center justify-end gap-3 w-1/3 min-w-[180px]">
          {/* Removed Queue and Speaker icons */}
          <div className="flex items-center gap-2 w-24 group">
              <Volume2 size={16} />
              <div className="h-1 bg-horeg-light rounded-full flex-1 relative overflow-hidden cursor-pointer">
                  <div className="h-full bg-white group-hover:bg-horeg-primary" style={{ width: `${volume}%` }}></div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
