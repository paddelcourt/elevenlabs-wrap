import { useState, useEffect, useRef } from 'react';
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
import bg1 from '../../../assets/eleven_labs_background_1.mp4';
import bg2 from '../../../assets/eleven_labs_background_2.mp4';
import bg3 from '../../../assets/eleven_labs_background_3.mp4';
import bg4 from '../../../assets/eleven_labs_background_4.mp4';
import bg5 from '../../../assets/eleven_labs_background_5.mp4';
import bg6 from '../../../assets/eleven_labs_background_6.mp4';
import bg7 from '../../../assets/eleven_labs_background_7.mp4';
import bg8 from '../../../assets/eleven_labs_background_8.mp4';

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
  const [isNavigating, setIsNavigating] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const videoSources = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8];

  const goToSlide = (index: number) => {
    if (index < 0 || index > slides.length - 1) return;
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (isNavigating) return;
      if (Math.abs(e.deltaY) < 10) return;
      e.preventDefault();
      setIsNavigating(true);
      if (e.deltaY > 0) nextSlide();
      else prevSlide();
      setTimeout(() => setIsNavigating(false), 650);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isNavigating || touchStartY.current === null) return;
      const delta = touchStartY.current - (e.changedTouches[0]?.clientY ?? touchStartY.current);
      if (Math.abs(delta) < 24) return;
      setIsNavigating(true);
      if (delta > 0) nextSlide();
      else prevSlide();
      setTimeout(() => setIsNavigating(false), 650);
      touchStartY.current = null;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isNavigating, currentSlide]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
      <BackgroundAsset />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          key={currentSlide}
          src={videoSources[currentSlide % videoSources.length]}
          className="w-full h-full object-cover opacity-80"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
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
