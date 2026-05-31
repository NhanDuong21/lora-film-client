import { useState, useMemo } from 'react';
import { Star, Clock } from 'lucide-react';
import { MOVIES } from '../data/mockData';
import TrailerModal from './TrailerModal';

export default function MovieGrid({ onSelectMovie, onBuyTicket, activeTab: propActiveTab, onChangeActiveTab }) {
  const [localActiveTab, setLocalActiveTab] = useState('NOW_SHOWING');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = onChangeActiveTab !== undefined ? onChangeActiveTab : setLocalActiveTab;
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeTrailerId, setActiveTrailerId] = useState(null);

  // Filter movies by the active status tab
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => movie.status === activeTab);
  }, [activeTab]);

  // Paginated/Sliced subset
  const displayedMovies = useMemo(() => {
    return filteredMovies.slice(0, visibleCount);
  }, [filteredMovies, visibleCount]);

  const handleBuyTicketClick = (e, movie) => {
    e.stopPropagation();
    // Default showtime parameters for local booking bypass routing
    const defaultShowtime = {
      movieId: movie.id,
      movieTitle: movie.title,
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date().toLocaleDateString('vi-VN'),
      cinema: 'Lora Nguyen Du',
      time: '19:30',
      format: '2D DIGITAL'
    };
    if (onBuyTicket) {
      onBuyTicket(defaultShowtime);
    }
  };

  const handleTrailerClick = (e, trailerId) => {
    e.stopPropagation();
    setActiveTrailerId(trailerId);
  };

  return (
    <section id="phim" className="relative px-6 md:px-12 py-16 bg-brand-dark">
      {/* Grid Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setActiveTab('NOW_SHOWING');
              setVisibleCount(12);
            }}
            className={`text-lg md:text-xl font-black tracking-wider uppercase pb-2 transition-all duration-300 relative ${
              activeTab === 'NOW_SHOWING'
                ? 'text-brand-coral border-b-2 border-brand-coral drop-shadow-[0_0_10px_rgba(216,129,116,0.4)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Phim Đang Chiếu
          </button>
          <button
            onClick={() => {
              setActiveTab('COMING_SOON');
              setVisibleCount(12);
            }}
            className={`text-lg md:text-xl font-black tracking-wider uppercase pb-2 transition-all duration-300 relative ${
              activeTab === 'COMING_SOON'
                ? 'text-brand-coral border-b-2 border-brand-coral drop-shadow-[0_0_10px_rgba(216,129,116,0.4)]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Phim Sắp Chiếu
          </button>
        </div>
      </div>

      {/* Grid System (Desktop 5-6 columns, compact cinematic scale) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 md:gap-6">
        {displayedMovies.map((movie, index) => (
          <div
            key={movie.id}
            onClick={() => onSelectMovie && onSelectMovie(movie.id)}
            className="bg-brand-gray rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col border border-white/5 shadow-2xl"
          >
            {/* Image Wrapper with relative overflow-hidden group */}
            <div className="relative aspect-[2/3] overflow-hidden w-full bg-zinc-900 rounded-xl shadow-lg">
              <img
                src={movie.image}
                alt={movie.title}
                className="group-hover:scale-105 transition-transform duration-500 object-cover w-full h-full"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80';
                }}
              />

              {/* Index Number */}
              <div className="absolute top-2 left-3 pointer-events-none select-none z-0 font-sans font-black text-5xl md:text-6xl text-white/20 drop-shadow-md">
                {index + 1}
              </div>

              {/* Rating Badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-0.5 bg-brand-yellow text-black text-[10px] md:text-xs font-black px-2 py-0.5 rounded shadow-lg">
                <Star className="w-3 h-3 fill-current" />
                {movie.rating.toFixed(1)}
              </div>

              {/* Age Rating Overlay */}
              <div className="absolute bottom-3 left-3 z-10 bg-zinc-950/70 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded">
                {movie.ageRating}
              </div>

              {/* Smooth Hover Fade Overlay (Desktop only visual effects) */}
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 backdrop-blur-xs flex flex-col justify-center items-center gap-4 absolute inset-0 z-20">
                {/* Button 1: Mua Vé (Ticket outline vector icon) */}
                <button
                  onClick={(e) => handleBuyTicketClick(e, movie)}
                  className="bg-brand-coral hover:bg-opacity-95 text-white font-extrabold py-2.5 px-5 rounded-xl shadow-lg shadow-brand-coral/20 flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 w-40 text-xs tracking-wider uppercase border border-brand-coral"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>Mua Vé</span>
                </button>

                {/* Button 2: Xem Trailer (YouTube play design icon) */}
                <button
                  onClick={(e) => handleTrailerClick(e, movie.trailerId)}
                  className="border border-zinc-500 hover:border-white text-zinc-300 hover:text-white hover:bg-white/5 font-extrabold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 w-40 text-xs tracking-wider uppercase"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="6" fill="#FF0000" />
                    <path d="M10 8L16 12L10 16V8Z" fill="white" />
                  </svg>
                  <span>Xem Trailer</span>
                </button>
              </div>
            </div>

            {/* Card Info details */}
            <div className="p-4 flex-grow flex flex-col justify-between bg-brand-gray">
              <div>
                <span className="truncate text-xs md:text-sm font-bold text-white mt-1 block group-hover:text-brand-coral transition-colors duration-300" title={movie.title}>
                  {movie.title}
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 block mt-1 truncate">
                  {movie.genre}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-500 mt-3 pt-3 border-t border-white/5">
                <Clock className="w-3.5 h-3.5 text-brand-coral" />
                <span>{movie.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progressive Pagination trigger button */}
      {filteredMovies.length > visibleCount && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-bold px-8 py-3.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md uppercase tracking-wider text-xs"
          >
            Xem thêm
          </button>
        </div>
      )}

      {/* Self-contained Trailer Overlay Modal */}
      <TrailerModal
        isOpen={!!activeTrailerId}
        onClose={() => setActiveTrailerId(null)}
        trailerId={activeTrailerId}
      />
    </section>
  );
}
