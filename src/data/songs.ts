import { Song } from '../types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Serana',
    artist: 'For Revenge',
    album: 'Perayaan Patah Hati',
    // Link audio langsung (.mp3) agar bisa diproses EQ
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73a56.mp3', 
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    isLiked: false
  },
  {
    id: '2',
    title: 'HOREG Brewog Audio',
    artist: 'DJ Horeg',
    album: 'Check Sound',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/11/23/audio_098b8c575a.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isLiked: true
  },
  {
    id: '3',
    title: 'Late Night Coding',
    artist: 'Lofi Girl',
    album: 'Study Session',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1bab.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
    isLiked: false
  }
];
