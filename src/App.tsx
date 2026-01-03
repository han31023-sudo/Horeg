// Pastikan ada lagu yang dipilih
const [currentSong, setCurrentSong] = useState(songs[0]); 
const [isPlaying, setIsPlaying] = useState(false);

return (
  <Player 
    currentSong={currentSong} 
    isPlaying={isPlaying} 
    onPlayPause={() => setIsPlaying(!isPlaying)}
    // ... props lainnya
  />
);
