cat <<EOF > src/data/songs.ts
import { Song } from '../types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Serana',
    artist: 'For Revenge',
    album: 'Perayaan Patah Hati',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/17/audio_19990a424a.mp3', 
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
    isLiked: false
  }
];
EOF
