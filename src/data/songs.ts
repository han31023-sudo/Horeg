import { Song } from '../types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Horeg Test 1',
    artist: 'Audio Check',
    album: 'System Test',
    // Link ini sangat stabil untuk testing
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isLiked: false
  },
  {
    id: '2',
    title: 'Horeg Test 2',
    artist: 'Bass Check',
    album: 'System Test',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    isLiked: true
  }
];
