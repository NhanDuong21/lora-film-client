import { useState, useMemo } from 'react';
import { Ticket, Play, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function MovieGrid({ onSelectMovie, onNavigate, activeTab: propActiveTab, onChangeActiveTab, onBuyTicket }) {
  const [localActiveTab, setLocalActiveTab] = useState('NOW_SHOWING');
  const activeTab = propActiveTab !== undefined ? propActiveTab : localActiveTab;
  const setActiveTab = onChangeActiveTab !== undefined ? onChangeActiveTab : setLocalActiveTab;
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(null);
  const { movies } = useData();

  // Filter movies by the active status tab
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (activeTab === 'NOW_SHOWING') {
        return movie.status === 'NOW_SHOWING' || movie.status === 'DANG_CHIEU';
      }
      if (activeTab === 'COMING_SOON') {
        return movie.status === 'COMING_SOON' || movie.status === 'SAP_CHIEU';
      }
      return movie.status === activeTab;
    });
  }, [movies, activeTab]);

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
              {/* Image & Hover Overlay Wrapper */}
              <div className="relative overflow-hidden rounded-xl shadow-lg border border-zinc-800/40 group-hover:border-amber-500/50 group">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover group-hover:scale-[1.05] transition-all duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/500x750?text=LoraFilm';
                  }}
                />

                {/* Animated Poster Hover Overlay Architecture */}
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-4">
                  {/* Nút "Mua Vé" */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const defaultBooking = {
                        movieId: movie.id,
                        movieTitle: movie.title,
                        cinema: 'Lora Nguyễn Du',
                        time: '19:30',
                        format: '2D DIGITAL',
                        date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                        fullDate: new Date().toLocaleDateString('vi-VN'),
                        selectedSeats: []
                      };
                      if (onBuyTicket) {
                        onBuyTicket(defaultBooking);
                      } else if (onNavigate) {
                        onNavigate('seats', defaultBooking);
                      }
                    }}
                    className="w-full max-w-[160px] bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all text-sm shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    Mua Vé
                  </button>

                  {/* Nút "Xem Trailer" */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const trailerUrl = movie.trailerEmbedUrl || (movie.trailerId ? `https://www.youtube.com/embed/${movie.trailerId}` : '');
                      setActiveTrailerUrl(trailerUrl);
                    }}
                    className="w-full max-w-[160px] bg-transparent border border-white hover:border-amber-400 hover:text-amber-400 text-white font-medium py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current text-white" />
                    Xem Trailer
                  </button>
                </div>
              </div>

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

      {/* Full-Screen Cinematic Lightbox Pop-up Component */}
      {activeTrailerUrl && (
        <div 
          className="fixed inset-0 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in"
          onClick={() => setActiveTrailerUrl(null)}
        >
          {/* Player Chassis Box */}
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dismissal Button Widget */}
            <button
              onClick={() => setActiveTrailerUrl(null)}
              className="absolute top-4 right-4 bg-zinc-900/80 text-zinc-400 hover:text-white p-2 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Close trailer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Secure Video IFrame Instance */}
            <iframe
              src={`${activeTrailerUrl}?autoplay=1&rel=0&modestbranding=1`}
              title="LoraFilm Cinematic Trailer Player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
