import { useState } from 'react';
import Player from './components/Player'; 
import { songs } from './data/songs';      
import { Song } from './types';

function App() {
  // State untuk lagu yang sedang diputar (default lagu pertama)
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  // Fungsi Play/Pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Fungsi Lagu Berikutnya (Next)
  const handleNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  // Fungsi Lagu Sebelumnya (Prev)
  const handlePrev = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Area Konten Utama */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-horeg-primary mb-6">Horeg Stream</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {songs.map((song) => (
            <div 
              key={song.id}
              onClick={() => { setCurrentSong(song); setIsPlaying(true); }}
              className={`p-4 rounded-lg cursor-pointer transition ${currentSong.id === song.id ? 'bg-horeg-light' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <img src={song.coverUrl} className="rounded-md mb-2" alt={song.title} />
              <p className="font-bold truncate">{song.title}</p>
              <p className="text-sm text-gray-400">{song.artist}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Mesin Player (Kodingan Pro Kamu) */}
      <Player 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
        toggleLyrics={() => setShowLyrics(!showLyrics)}
        showLyrics={showLyrics}
        eqSettings={{ bass: 80, mid: 50, treble: 50 }} // Setup Bass Horeg Otomatis
      />
    </div>
  );
}

export default App;
