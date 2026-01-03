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
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  // 1. Inisialisasi Audio Engine (HOREG Engine)
  useEffect(() => {
    if (!audioRef.current || audioContextRef.current) return;

    const initAudio = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaElementSource(audioRef.current!);
        sourceNodeRef.current = source;

        // Create Filters
        const bass = ctx.createBiquadFilter();
        bass.type = "lowshelf";
        bass.frequency.value = 200;
        bassFilterRef.current = bass;

        const mid = ctx.createBiquadFilter();
        mid.type = "peaking";
        mid.frequency.value = 1500;
        mid.Q.value = 1;
        midFilterRef.current = mid;

        const treble = ctx.createBiquadFilter();
        treble.type = "highshelf";
        treble.frequency.value = 3000;
        trebleFilterRef.current = treble;

        // Connect Chain: Source -> Bass -> Mid -> Treble -> Destination
        source.connect(bass);
        bass.connect(mid);
        mid.connect(treble);
        treble.connect(ctx.destination);

      } catch (e) {
        console.warn("Web Audio API initialization failed:", e);
      }
    };

    initAudio();
  }, []);

  // 2. Update EQ (Settingan HOREG)
  useEffect(() => {
    if (eqSettings && bassFilterRef.current && midFilterRef.current && trebleFilterRef.current) {
        const bassGain = ((eqSettings.bass - 50) / 50) * 20; 
        const midGain = ((eqSettings.mid - 50) / 50) * 15;
        const trebleGain = ((eqSettings.treble - 50) / 50) * 15;

        const now = audioContextRef.current?.currentTime || 0;
        bassFilterRef.current.gain.setTargetAtTime(bassGain, now, 0.1);
        midFilterRef.current.gain.setTargetAtTime(midGain, now, 0.1);
        trebleFilterRef.current.gain.setTargetAtTime(trebleGain, now, 0.1);
    }
  }, [eqSettings]);

  // 3. Handle Playback & Bangunkan AudioContext
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (audioRef.current.src !== currentSong.audioUrl) {
        audioRef.current.src = currentSong.audioUrl || '';
        audioRef.current.load();
      }
      
      if (isPlaying) {
        // MEMBANGUNKAN AUDIO JIKA TIDUR (Klik User)
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
        audioRef.current.play().catch(e => console.log("Menunggu klik user..."));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  // 4. Media Session (Layar Kunci)
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: [{ src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }]
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
      if (total > 0) setProgress((current / total) * 100);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setProgress(newVal);
    if (audioRef.current) {
      audioRef.current.currentTime = (newVal / 100) * (audioRef.current.duration || 0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol / 100;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black border-t border-horeg-light flex items-center justify-between text-white z-[100] px-4">
      <audio 
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />
      
      {/* Info Lagu */}
      <div className="flex items-center gap-3 w-1/3 min-w-[150px]">
        <img src={currentSong.coverUrl} className="h-14 w-14 rounded-md object-cover" alt="cover" />
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-bold truncate">{currentSong.title}</span>
          <span className="text-xs text-gray
