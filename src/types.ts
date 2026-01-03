// src/data/songs.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  audioUrl: string;
  coverUrl: string;
  isLiked?: boolean;
}

export const songs: Song[] = [
  {
    id: '1',
    title: 'Serana',
    artist: 'For Revenge',
    album: 'Perayaan Patah Hati',
    // LINK INI HARUS BISA DIBUKA DI BROWSER
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/17/audio_19990a424a.mp3', 
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    isLiked: false
  }
];
