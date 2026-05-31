import { useState, useMemo } from 'react';
import { MOVIES } from '../data/mockData';
import TrailerModal from './TrailerModal';

export default function MovieGrid({ onSelectMovie, onNavigate, activeTab: propActiveTab, onChangeActiveTab }) {
  const [localActiveTab, setLocalActiveTab] = useState('NOW_SHOWING');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = onChangeActiveTab !== undefined ? onChangeActiveTab : setLocalActiveTab;
  const [activeTrailerId, setActiveTrailerId] = useState(null);

  // Filter movies by the active status tab
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => movie.status === activeTab);
  }, [activeTab]);

  // Paginated/Sliced subset - strictly display the first 8 movie items on the homepage
  const activeMovies = useMemo(() => {
    return filteredMovies.slice(0, 8);
  }, [filteredMovies]);

  const handleSeeMoreClick = () => {
    if (onNavigate) {
      onNavigate('discovery', { initialTab: activeTab });
    }
  };

  return (
    <section id="phim" className="relative px-6 md:px-12 py-16 bg-zinc-950">
      {/* Grid Header & Filters */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setActiveTab('NOW_SHOWING');
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

      {/* Main Grid Workspace Framework */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-zinc-100 bg-zinc-950">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {activeMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie && onSelectMovie(movie.id)}
              className="w-full flex flex-col group cursor-pointer overflow-hidden transition-all duration-300"
            >
              {/* Direct Image Element - Completely Fill The Grid Cell, NO Empty Borders */}
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-zinc-800/40 group-hover:border-amber-500/50 group-hover:scale-[1.02] transition-all duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/500x750?text=LoraFilm';
                }}
              />

              {/* Text Description Box - Aligns flawlessly beneath the image edge */}
              <div className="pt-4 flex flex-col">
                <h3 className="text-sm md:text-base font-bold text-zinc-100 truncate group-hover:text-amber-500 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 truncate">
                  {movie.genres ? movie.genres.join(', ') : movie.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Catalog Redirection trigger button */}
      {filteredMovies.length > 8 && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleSeeMoreClick}
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
