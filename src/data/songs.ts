import { Song } from '../types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Serana',
    artist: 'For Revenge',
    album: 'Perayaan Patah Hati',
    // Link MP3 ini mendukung CORS (bisa di-proses Equalizer)
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/17/audio_19990a424a.mp3', 
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    isLiked: false
  },
  {
    id: '2',
    title: 'Horeg Bass Check',
    artist: 'Audio Test',
    album: 'Brewog Style',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73a56.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isLiked: true
  },
  {
    id: '3',
    title: 'Midnight Coding',
    artist: 'Lofi Vibes',
    album: 'Beat Session',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/05/05/audio_517d47226d.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop',
    isLiked: false
  }
];
