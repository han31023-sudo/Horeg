cat <<EOF > src/data/songs.ts
import { Song } from '../types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Horeg Test',
    artist: 'Pixabay Audio',
    album: 'Check Sound',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/17/audio_19990a424a.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isLiked: false
  }
];
EOF
