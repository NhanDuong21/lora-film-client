import { useState, useMemo } from 'react';
import { Play, Clock, ArrowLeft, Star } from 'lucide-react';
import { MOVIES, CINEMA_CLUSTERS, SHOWTIMES } from '../data/mockData';
import TrailerModal from '../components/common/TrailerModal';

export default function MovieDetailView({ movieId, onSelectShowtime, onBack }) {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Find the current movie
  const movie = useMemo(() => {
    return MOVIES.find((m) => m.id === movieId) || MOVIES[0];
  }, [movieId]);

  // Generate the next 5 dates starting from today
  const dates = useMemo(() => {
    const list = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const label = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : dayNames[d.getDay()];

      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      list.push({
        label,
        dateStr,
        fullDate: d.toLocaleDateString('vi-VN')
      });
    }
    return list;
  }, []);

  const activeDate = dates[selectedDateIndex];

  // Age rating styling maps
  const ageRatingColor = (rating) => {
    switch (rating) {
      case 'P': return 'bg-emerald-500 text-black';
      case 'T13': return 'bg-blue-500 text-white';
      case 'T16': return 'bg-orange-500 text-white';
      case 'T18': return 'bg-red-600 text-white';
      default: return 'bg-zinc-700 text-white';
    }
  };

  const handleTimeClick = (cinema, time, format) => {
    onSelectShowtime({
      movieId: movie.id,
      movieTitle: movie.title,
      date: activeDate.dateStr,
      fullDate: activeDate.fullDate,
      cinema,
      time,
      format
    });
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen pb-16">
      {/* Background Banner Backdrop */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-md"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 md:left-12 z-20 flex items-center gap-2 bg-black/40 hover:bg-brand-coral/25 text-white border border-white/10 hover:border-brand-coral font-bold px-4 py-2 rounded-full transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main Details Container */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Poster */}
          <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <span className={`absolute top-3 left-3 z-10 text-xs font-black px-2.5 py-1 rounded shadow-lg ${ageRatingColor(movie.ageRating)}`}>
                {movie.ageRating}
              </span>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex-grow flex flex-col justify-end text-center md:text-left mt-4 md:mt-0">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="flex items-center gap-1 bg-brand-yellow text-black text-xs font-black px-2 py-0.5 rounded shadow">
                <Star className="w-3 h-3 fill-current" />
                {movie.rating.toFixed(1)}
              </div>
              <span className="text-zinc-400 text-sm">| {movie.genre}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 text-sm mb-6">
              <Clock className="w-4 h-4 text-brand-coral" />
              <span>{movie.duration}</span>
            </div>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
              {movie.synopsis}
            </p>

            <div className="flex justify-center md:justify-start">
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-90 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-brand-coral/25 transform hover:scale-105 transition-all duration-300"
              >
                <Play className="w-4 h-4 fill-current" />
                Xem Trailer
              </button>
            </div>
          </div>
        </div>

        {/* Static Showtime Scheduler Accordion & System */}
        <div className="mt-16 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide mb-6">
            Lịch Chiếu & Đặt Vé
          </h2>

          {/* Horizontal Date Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800">
            {dates.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex flex-col items-center justify-center px-5 py-3 rounded-2xl min-w-[90px] border transition-all duration-300 shrink-0 ${
                  selectedDateIndex === idx
                    ? 'bg-brand-coral border-brand-coral text-white font-bold scale-105 shadow-lg shadow-brand-coral/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider mb-1">{item.label}</span>
                <span className="text-base font-black">{item.dateStr}</span>
              </button>
            ))}
          </div>

          {/* Cinema Accordion Cluster Rows */}
          <div className="mt-8 space-y-6">
            {CINEMA_CLUSTERS.map((cinema, cIdx) => (
              <div
                key={cIdx}
                className="bg-zinc-950/40 border border-zinc-800/60 rounded-2xl p-5 md:p-6"
              >
                <h3 className="text-base md:text-lg font-bold text-white mb-4 border-l-2 border-brand-coral pl-3">
                  {cinema}
                </h3>

                <div className="space-y-4">
                  {/* 2D Showtimes */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2 border-b border-zinc-900">
                    <span className="text-xs font-black text-brand-coral uppercase tracking-widest shrink-0 w-24">
                      2D DIGITAL
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {SHOWTIMES.map((time, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => handleTimeClick(cinema, time, '2D DIGITAL')}
                          className="bg-zinc-900 hover:bg-brand-coral text-zinc-300 hover:text-white border border-zinc-800 hover:border-brand-coral text-xs md:text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IMAX 3D Showtimes */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
                    <span className="text-xs font-black text-brand-yellow uppercase tracking-widest shrink-0 w-24">
                      IMAX 3D
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {SHOWTIMES.slice(1, 4).map((time, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => handleTimeClick(cinema, time, 'IMAX 3D')}
                          className="bg-zinc-900 hover:bg-brand-yellow text-zinc-300 hover:text-black border border-zinc-800 hover:border-brand-yellow text-xs md:text-sm font-semibold py-2 px-4 rounded-xl transition-all duration-300"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerId={movie.trailerId}
      />
    </div>
  );
}
