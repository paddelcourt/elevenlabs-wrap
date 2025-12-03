import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroSlide } from './components/IntroSlide';
import { TopGenresSlide } from './components/TopGenresSlide';
import { ListeningAgeSlide } from './components/ListeningAgeSlide';
import { GuessTopSongSlide } from './components/GuessTopSongSlide';
import { TopSongsSlide } from './components/TopSongsSlide';
import { AlbumsCountSlide } from './components/AlbumsCountSlide';
import { TopAlbumSlide } from './components/TopAlbumSlide';
import { TopAlbumsSlide } from './components/TopAlbumsSlide';
import { BackgroundAsset } from './components/BackgroundAsset';

const mockData = {
  genreCount: 127,
  topGenres: ['Audiobook Narration', 'Podcast Voiceover', 'Character Voice Acting', 'Documentary Narration', 'ASMR'],
  listeningAge: 34,
  topSong: 'Midnight Stories',
  topSongs: [
    { title: 'Midnight Stories', plays: 2847 },
    { title: 'The Last Chapter', plays: 2156 },
    { title: 'Whispers in the Dark', plays: 1923 },
    { title: 'Digital Dreams', plays: 1765 },
    { title: 'Echoes of Tomorrow', plays: 1542 }
  ],
  albumCount: 89,
  topAlbum: 'Synthetic Emotions',
  topAlbums: [
    { title: 'Synthetic Emotions', artist: 'AI Narrator', plays: 5234 },
    { title: 'Voice Chronicles', artist: 'Digital Storyteller', plays: 4892 },
    { title: 'Spoken Word Dreams', artist: 'Neural Voice', plays: 4156 },
    { title: 'Audio Landscapes', artist: 'Generated Voices', plays: 3847 },
    { title: 'The Infinite Library', artist: 'AI Ensemble', plays: 3621 }
  ]
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides = [
    <IntroSlide genreCount={mockData.genreCount} />,
    <TopGenresSlide genres={mockData.topGenres} />,
    <ListeningAgeSlide age={mockData.listeningAge} />,
    <GuessTopSongSlide songTitle={mockData.topSong} />,
    <TopSongsSlide songs={mockData.topSongs} />,
    <AlbumsCountSlide count={mockData.albumCount} />,
    <TopAlbumSlide album={mockData.topAlbum} />,
    <TopAlbumsSlide albums={mockData.topAlbums} />
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setAutoPlay(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentSlide, autoPlay, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
      setAutoPlay(false);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      setAutoPlay(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <BackgroundAsset />
      <div className="w-full max-w-2xl h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center p-8"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow navigation */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-opacity ${
            currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
          }`}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-opacity ${
            currentSlide === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'
          }`}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    </div>
  );
}