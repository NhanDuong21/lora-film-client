import { useState, useEffect, useMemo } from 'react';
import { Trash2, Calendar, Clock, Film, Filter, ChevronRight, RefreshCw } from 'lucide-react';

export default function AdminShowtimeView({ 
  showtimes, 
  movies, 
  theaters, 
  updateShowtimesState, 
  triggerToast 
}) {
  // Unified Scheduler Configuration States
  const [dateRange, setDateRange] = useState({ from: '2026-05-28', to: '2026-05-31' });
  const [operatingHours, setOperatingHours] = useState({ start: '08:00', end: '22:00' });
  const [goldenHour, setGoldenHour] = useState('19:00');
  const [selectedMovies, setSelectedMovies] = useState([]); // Array of checked movie IDs
  const [timetableGrid, setTimetableGrid] = useState({}); // Mapped showtime blocks structured by [day][room]

  // Target Cinema complex selection
  const [selectedTheaterId, setSelectedTheaterId] = useState(theaters[0]?.id || '');

  // Helper: Convert "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  // Helper: Convert minutes from midnight to "HH:MM"
  const minutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Helper: Generate all date strings in the range [from, to] inclusive
  const getDatesInRange = (from, to) => {
    if (!from || !to) return [];
    const list = [];
    const start = new Date(from);
    const end = new Date(to);
    const current = new Date(start);
    let limit = 0;
    while (current <= end && limit < 30) { // Safety ceiling to prevent infinite loops
      list.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
      limit++;
    }
    return list;
  };

  // Helper: Get day name in Vietnamese
  const getVNWeekday = (dateStr) => {
    const d = new Date(dateStr);
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[d.getDay()];
  };

  // Helper: Format YYYY-MM-DD to DD/MM
  const formatDateVN = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  // Helper: Generate unique movie visual profile classes
  const getMovieColorClasses = (index) => {
    const colors = [
      'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20',
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20',
      'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20',
      'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20',
      'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20',
      'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
    ];
    return colors[index % colors.length];
  };

  // Build grid map of showtimes for active cinema & dates
  const buildTimetableGrid = (showtimeList, dateList, hallsList) => {
    const grid = {};
    dateList.forEach(dateStr => {
      grid[dateStr] = {};
      hallsList.forEach(hall => {
        grid[dateStr][hall.name] = [];
      });
    });

    showtimeList.forEach(st => {
      if (String(st.cinemaId) === String(selectedTheaterId)) {
        const dateStr = st.date;
        const hall = hallsList.find(h => String(h.id) === String(st.hallId));
        if (hall && grid[dateStr]) {
          if (!grid[dateStr][hall.name]) {
            grid[dateStr][hall.name] = [];
          }
          grid[dateStr][hall.name].push(st);
        }
      }
    });

    return grid;
  };

  // Select theater halls
  const activeTheater = useMemo(() => {
    return theaters.find(t => String(t.id) === String(selectedTheaterId)) || theaters[0];
  }, [theaters, selectedTheaterId]);

  const activeHalls = useMemo(() => {
    return activeTheater?.halls || [];
  }, [activeTheater]);

  const dateTokens = useMemo(() => {
    return getDatesInRange(dateRange.from, dateRange.to);
  }, [dateRange.from, dateRange.to]);

  // Synchronize local grid coordinates when showtimes change
  useEffect(() => {
    if (activeTheater) {
      const grid = buildTimetableGrid(showtimes, dateTokens, activeHalls);
      setTimetableGrid(grid);
    }
  }, [showtimes, selectedTheaterId, dateRange.from, dateRange.to, activeHalls, activeTheater]);

  // Execute client-side Mock Showtime Scheduler Algorithm
  const handleAutoGenerate = () => {
    if (selectedMovies.length === 0) {
      triggerToast('Vui lòng chọn ít nhất một bộ phim cần xếp lịch!', 'error');
      return;
    }

    if (dateTokens.length === 0) {
      triggerToast('Vui lòng cấu hình khoảng ngày hợp lệ!', 'error');
      return;
    }

    if (!selectedTheaterId || !activeTheater) {
      triggerToast('Vui lòng lựa chọn chi nhánh rạp hợp lệ!', 'error');
      return;
    }

    if (activeHalls.length === 0) {
      triggerToast('Cụm rạp này chưa có phòng chiếu!', 'error');
      return;
    }

    const startMin = timeToMinutes(operatingHours.start);
    const endMin = timeToMinutes(operatingHours.end);
    const goldenMin = timeToMinutes(goldenHour);

    if (startMin >= endMin) {
      triggerToast('Giờ đóng cửa phải sau giờ mở cửa!', 'error');
      return;
    }

    // Phase 1: Priority Points Calculation
    const sortedMovies = [...selectedMovies]
      .map(id => movies.find(m => String(m.id) === String(id)))
      .filter(Boolean)
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        const genreA = Array.isArray(a.genres) 
          ? a.genres.join(', ').toLowerCase() 
          : String(a.genre || a.genres || '').toLowerCase();
        const genreB = Array.isArray(b.genres) 
          ? b.genres.join(', ').toLowerCase() 
          : String(b.genre || b.genres || '').toLowerCase();

        const highTrafficGenres = ['hành động', 'sci-fi', 'kịch tính', 'kinh dị'];
        const genreWeightA = highTrafficGenres.some(g => genreA.includes(g)) ? 2 : 0;
        const genreWeightB = highTrafficGenres.some(g => genreB.includes(g)) ? 2 : 0;

        const priorityA = ratingA + genreWeightA;
        const priorityB = ratingB + genreWeightB;

        return priorityB - priorityA; // Descending weight
      });

    const newGenerated = [];

    // Phase 2 & 3: Time-Block Interval Parsing & Collision Detection Guard
    dateTokens.forEach(dateStr => {
      activeHalls.forEach(hall => {
        let currentMinutes = startMin;
        let movieCycleIdx = 0;

        // Walk timeframe until operatingHours boundary is reached
        while (currentMinutes + 30 < endMin) {
          // Select movie: prioritize highest weights during the golden hour window (+/- 90 mins)
          let targetMovie = null;
          const diffToGolden = Math.abs(currentMinutes - goldenMin);
          if (diffToGolden <= 90 && sortedMovies.length > 0) {
            targetMovie = sortedMovies[0]; // Pick highest rated/priority movie
          } else {
            targetMovie = sortedMovies[movieCycleIdx % sortedMovies.length];
          }

          if (!targetMovie) break;

          const duration = parseInt(targetMovie.duration) || 120;
          const endMinutes = currentMinutes + duration;

          if (endMinutes > endMin) {
            break; // Exceeds closing hour bounds
          }

          // Build Showtime Block Capsule
          const newShowtimeItem = {
            id: `st_auto_${Math.random().toString(36).substr(2, 9)}`,
            movieId: targetMovie.id,
            cinemaId: selectedTheaterId, // USE cinemaId HERE
            hallId: hall.id,
            date: dateStr,
            time: minutesToTime(currentMinutes),
            price: hall.format.toUpperCase().includes('IMAX') ? 140000 : 90000
          };

          newGenerated.push(newShowtimeItem);

          // Add mandatory 20-minute cleanup buffer to block sequence
          currentMinutes = endMinutes + 20;
          movieCycleIdx++;
        }
      });
    });

    // Merge generated showtimes: purge target date-range/theater records & write new
    const preservedShowtimes = showtimes.filter(st => {
      const isSameTheater = String(st.cinemaId) === String(selectedTheaterId); // USE cinemaId HERE
      const isInTargetRange = dateTokens.includes(st.date);
      return !(isSameTheater && isInTargetRange);
    });

    const finalState = [...preservedShowtimes, ...newGenerated];
    updateShowtimesState(finalState);
    triggerToast(`Đã tự động lập lịch ${newGenerated.length} suất chiếu thành công!`);
  };

  // Quick deletion trigger
  const handleClearSchedules = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch chiếu của rạp này trong khoảng ngày đã chọn?')) {
      const preserved = showtimes.filter(st => {
        const isSameTheater = String(st.cinemaId) === String(selectedTheaterId); // USE cinemaId HERE
        const isInTargetRange = dateTokens.includes(st.date);
        return !(isSameTheater && isInTargetRange);
      });
      updateShowtimesState(preserved);
      triggerToast('Đã dọn dẹp các suất chiếu trong khung lịch.');
    }
  };

  // Singular Schedule Pruner
  const handleDeleteShowtime = (id) => {
    const updated = showtimes.filter(st => String(st.id) !== String(id));
    updateShowtimesState(updated);
    triggerToast('Đã xóa suất chiếu thành công!');
  };

  // Hourly grid setup (08:00 -> 22:00 etc)
  const gridHours = useMemo(() => {
    const hoursList = [];
    const startHour = parseInt(operatingHours.start.split(':')[0]) || 8;
    const endHour = parseInt(operatingHours.end.split(':')[0]) || 22;
    for (let h = startHour; h <= endHour; h++) {
      hoursList.push(`${String(h).padStart(2, '0')}:00`);
    }
    return hoursList;
  }, [operatingHours.start, operatingHours.end]);

  const startHourNum = parseInt(operatingHours.start.split(':')[0]) || 8;
  const endHourNum = parseInt(operatingHours.end.split(':')[0]) || 22;
  const gridHeightPx = (endHourNum - startHourNum) * 60;

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-50 uppercase tracking-wide">TỰ ĐỘNG LẬP LỊCH CHIẾU</h3>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">Thuật toán phân bổ giờ chiếu dựa trên mức độ ưu tiên và thời lượng phim</p>
        </div>
      </div>

      {/* ➊ Top Configuration Strip */}
      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 flex flex-wrap items-end gap-5 text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase">Chi Nhánh Rạp</label>
          <select 
            value={selectedTheaterId} 
            onChange={(e) => setSelectedTheaterId(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
          >
            {theaters.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase">Từ Ngày</label>
          <input 
            type="date" 
            value={dateRange.from} 
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase">Đến Ngày</label>
          <input 
            type="date" 
            value={dateRange.to} 
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase">Giờ Mở Cửa</label>
          <input 
            type="time" 
            value={operatingHours.start} 
            onChange={(e) => setOperatingHours({ ...operatingHours, start: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase">Giờ Đóng Cửa</label>
          <input 
            type="time" 
            value={operatingHours.end} 
            onChange={(e) => setOperatingHours({ ...operatingHours, end: e.target.value })}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 text-[10px] font-black uppercase text-amber-500">Giờ Vàng (Golden Hour)</label>
          <input 
            type="time" 
            value={goldenHour} 
            onChange={(e) => setGoldenHour(e.target.value)}
            className="bg-zinc-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button 
            type="button"
            onClick={handleClearSchedules}
            className="border border-red-900/40 text-red-400 hover:bg-red-950/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            Dọn Lịch Chiếu
          </button>
          <button 
            type="button"
            onClick={handleAutoGenerate}
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>TỰ ĐỘNG TẠO SUẤT CHIẾU</span>
          </button>
        </div>
      </div>

      {/* Main Workspace split panel */}
      <div className="flex gap-6 items-start">
        
        {/* ➋ Left Side: Movie Selection Directory */}
        <div className="w-72 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3 h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-black uppercase text-zinc-300 tracking-wider">PHIM XẾP LỊCH</span>
            <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              {selectedMovies.length}/{movies.length}
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold px-1">
            <button 
              type="button"
              onClick={() => setSelectedMovies(movies.map(m => String(m.id)))}
              className="hover:text-amber-500 transition-colors uppercase"
            >
              Chọn tất cả
            </button>
            <button 
              type="button"
              onClick={() => setSelectedMovies([])}
              className="hover:text-red-400 transition-colors uppercase"
            >
              Bỏ chọn
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {movies.map((movie) => {
              const isChecked = selectedMovies.includes(String(movie.id));
              return (
                <div 
                  key={movie.id} 
                  onClick={() => {
                    const idStr = String(movie.id);
                    if (isChecked) {
                      setSelectedMovies(selectedMovies.filter(id => id !== idStr));
                    } else {
                      setSelectedMovies([...selectedMovies, idStr]);
                    }
                  }}
                  className={`p-3 bg-zinc-950/65 border rounded-xl flex gap-3 items-center cursor-pointer transition-all hover:border-zinc-700 select-none ${
                    isChecked 
                      ? 'border-amber-500/50 bg-amber-500/5' 
                      : 'border-zinc-800/80'
                  }`}
                >
                  <input 
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}} // Synced on parent div onClick
                    className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500/20 w-3.5 h-3.5 shrink-0 pointer-events-none"
                  />
                  <img 
                    src={movie.imageUrl || movie.posterUrl} 
                    alt={movie.title}
                    className="w-10 h-14 object-cover rounded-lg border border-zinc-800 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=60';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[11px] text-zinc-150 truncate leading-snug">{movie.title}</h4>
                    <p className="text-[9px] text-zinc-400 mt-1 leading-normal">
                      Thời lượng: {movie.duration} phút | Điểm: {movie.rating || '8.5'}
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate mt-0.5">
                      {Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genre || movie.genres || 'Kịch tính')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ➌ Right Side: Weekly Timetable Multi-Day Grid */}
        <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 h-[600px] overflow-auto flex flex-col">
          {/* Calendar Day Columns Header */}
          <div className="flex border-b border-zinc-800 pb-3 mb-2 sticky top-0 bg-zinc-950/80 z-20">
            <div className="w-16 shrink-0"></div>
            <div className="flex-grow flex gap-3">
              {dateTokens.map(dateStr => (
                <div key={dateStr} className="flex-1 text-center font-bold text-xs text-zinc-300">
                  <div className="text-zinc-500 uppercase text-[9px] tracking-wider mb-0.5">{getVNWeekday(dateStr)}</div>
                  <div>{formatDateVN(dateStr)}</div>
                </div>
              ))}
              {dateTokens.length === 0 && (
                <div className="w-full text-center text-zinc-500 font-bold uppercase text-[10px] tracking-widest py-1">
                  Chưa thiết lập khoảng ngày biểu diễn
                </div>
              )}
            </div>
          </div>

          {/* Timetable Grid Body Canvas */}
          <div className="flex-1 relative flex gap-3" style={{ height: `${gridHeightPx}px` }}>
            {/* Hour vertical labels track */}
            <div className="w-16 shrink-0 relative h-full select-none">
              {gridHours.map((hour, idx) => (
                <div 
                  key={hour} 
                  style={{ top: `${idx * 60}px`, transform: 'translateY(-50%)' }} 
                  className="absolute right-3 text-[10px] text-zinc-500 font-mono font-medium"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Timetable main canvas area */}
            <div className="flex-grow flex gap-3 relative h-full">
              {/* Hour horizontal grid overlay ticks */}
              {gridHours.map((hour, idx) => (
                <div 
                  key={`line-${hour}`} 
                  style={{ top: `${idx * 60}px` }} 
                  className="absolute left-0 right-0 border-t border-zinc-800/40 h-[1px] pointer-events-none"
                />
              ))}

              {/* Day column layers */}
              {dateTokens.map(dateStr => {
                const dayHallsData = timetableGrid[dateStr] || {};
                const dayShowtimes = [];
                activeHalls.forEach(hall => {
                  const list = dayHallsData[hall.name] || [];
                  list.forEach(st => {
                    dayShowtimes.push({ ...st, hallName: hall.name, hallIndex: activeHalls.indexOf(hall) });
                  });
                });

                return (
                  <div 
                    key={dateStr} 
                    className="flex-1 relative border-r border-zinc-800/20 last:border-r-0 h-full bg-zinc-950/5"
                  >
                    {dayShowtimes.map(st => {
                      const movie = movies.find(m => String(m.id) === String(st.movieId));
                      const movieIndex = movies.findIndex(m => String(m.id) === String(st.movieId));
                      const duration = parseInt(movie?.duration) || 120;
                      
                      const startM = timeToMinutes(st.time);
                      const topPx = startM - (startHourNum * 60);

                      // Filter out-of-bounds items
                      if (topPx < 0 || topPx >= gridHeightPx) return null;

                      const heightPx = duration;
                      const leftPercent = (st.hallIndex / activeHalls.length) * 100;
                      const widthPercent = (100 / activeHalls.length) - 2;

                      const visualStyle = getMovieColorClasses(movieIndex);
                      const endTimeStr = minutesToTime(startM + duration);
                      const showtimeSpan = `${st.time} - ${endTimeStr}`;

                      return (
                        <div
                          key={st.id}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`
                          }}
                          className={`absolute rounded-xl p-2.5 border text-left transition-all backdrop-blur-md cursor-pointer group shadow-lg flex flex-col justify-between overflow-hidden ${visualStyle}`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[10px] leading-tight text-zinc-100 truncate pr-4 group-hover:text-white" title={movie?.title}>
                              {movie?.title || 'Phim Chưa Xác Định'}
                            </div>
                            <div className="text-[9px] text-zinc-400 font-mono mt-0.5">{showtimeSpan}</div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5 shrink-0">
                            <span className="text-[8px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/10">{st.hallName}</span>
                            <span className="text-[8px] font-mono font-bold text-zinc-400">{st.price.toLocaleString('vi-VN')} đ</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteShowtime(st.id);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 border border-zinc-800 hover:bg-red-950 hover:border-red-500 hover:text-white text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
                            title="Xóa suất chiếu"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
