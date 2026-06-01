import { useState } from 'react';
import { PlusCircle, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminShowtimeView({ 
  showtimes, 
  movies, 
  theaters, 
  updateShowtimesState, 
  triggerToast 
}) {
  const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: '',
    theaterId: '',
    hallId: '',
    date: '',
    time: '',
    price: 80000
  });
  const [showtimeError, setShowtimeError] = useState('');

  const handleOpenAddShowtime = () => {
    setShowtimeForm({
      movieId: movies[0]?.id || '',
      theaterId: theaters[0]?.id || '',
      hallId: theaters[0]?.halls[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:30',
      price: 80000
    });
    setShowtimeError('');
    setShowtimeModalOpen(true);
  };

  const handleSaveShowtime = (e) => {
    e.preventDefault();
    setShowtimeError('');

    // Overlap checks
    const isOverlap = showtimes.some(st => 
      st.hallId.toString() === showtimeForm.hallId.toString() &&
      st.date === showtimeForm.date &&
      st.time === showtimeForm.time
    );

    if (isOverlap) {
      setShowtimeError('Trùng lịch! Phòng chiếu này đã được đăng ký một suất chiếu vào đúng khung giờ đã chọn.');
      return;
    }

    const newShowtime = {
      id: "st_" + Date.now(),
      movieId: showtimeForm.movieId,
      theaterId: showtimeForm.theaterId,
      hallId: showtimeForm.hallId,
      date: showtimeForm.date,
      time: showtimeForm.time,
      price: parseInt(showtimeForm.price) || 80000
    };

    updateShowtimesState([...showtimes, newShowtime]);
    triggerToast('Thêm suất chiếu mới thành công!');
    setShowtimeModalOpen(false);
  };

  const handleDeleteShowtime = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
      const updated = showtimes.filter(st => st.id !== id);
      updateShowtimesState(updated);
      triggerToast('Đã xóa suất chiếu thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* View Title & Action Bar */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <div>
          <h3 className="text-base font-bold text-zinc-50 uppercase tracking-wide">DANH SÁCH SUẤT CHIẾU</h3>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wide">Thiết lập khung giờ phát sóng và biểu giá vé rạp LoraFilm</p>
        </div>
        <button
          onClick={handleOpenAddShowtime}
          className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-90 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>THÊM SUẤT CHIẾU</span>
        </button>
      </div>

      {/* Showtime Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showtimes.map((st) => {
          const movie = movies.find(m => String(m.id) === String(st.movieId));
          const theater = theaters.find(t => String(t.id) === String(st.theaterId));
          const hall = theater?.halls.find(h => h.id === st.hallId);
          const formatUpper = (hall?.format || '2D DIGITAL').toUpperCase();
          const displayPrice = st.price.toLocaleString('vi-VN');

          return (
            <div 
              key={st.id} 
              className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 pb-2 mb-3">
                  <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {formatUpper}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">
                    ID: #{st.id}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-350 font-bold uppercase tracking-wider">
                  {theater?.name || 'Rạp Chưa Xác Định'}
                </p>
                <p className="text-[10px] text-zinc-400 font-semibold uppercase mt-0.5">
                  {hall?.name || 'Phòng Chưa Xác Định'}
                </p>
                <h4 className="font-bold text-zinc-50 text-base mt-2 tracking-wide leading-snug">
                  {movie?.title || 'Phim Chưa Xác Định'}
                </h4>
              </div>
              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                  <span className="text-zinc-400">Khung giờ: <span className="text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20">{st.time}</span></span>
                  <span className="text-zinc-400">Ngày: <span className="text-zinc-100 font-medium">{st.date}</span></span>
                  <span className="text-zinc-400">Giá: <span className="text-emerald-400 font-bold font-mono">{displayPrice} đ</span></span>
                </div>
                <button
                  onClick={() => handleDeleteShowtime(st.id)}
                  className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/40 rounded-xl transition-all shrink-0"
                  title="Xóa suất chiếu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {showtimes.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-650 text-xs font-bold uppercase tracking-widest bg-zinc-900/10 rounded-2xl border border-zinc-900">
            Chưa có suất chiếu nào được tạo trên hệ thống
          </div>
        )}
      </div>

      {/* Modal Add Showtime */}
      {showtimeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveShowtime} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-zinc-100 uppercase tracking-wider">THÊM SUẤT CHIẾU MỚI</h3>
              <button type="button" onClick={() => setShowtimeModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showtimeError && (
              <div className="p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs text-red-200 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{showtimeError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Chọn Phim</label>
              <select
                value={showtimeForm.movieId}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
                className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              >
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Cụm Rạp</label>
                <select
                  value={showtimeForm.theaterId}
                  onChange={(e) => {
                    const tId = e.target.value;
                    const matchedT = theaters.find(t => String(t.id) === String(tId));
                    setShowtimeForm({ 
                      ...showtimeForm, 
                      theaterId: e.target.value,
                      hallId: matchedT?.halls[0]?.id || ''
                    });
                  }}
                  className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                >
                  {theaters.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Phòng Chiếu</label>
                <select
                  value={showtimeForm.hallId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, hallId: e.target.value })}
                  className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                >
                  {theaters.find(t => t.id.toString() === showtimeForm.theaterId.toString())?.halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Ngày Chiếu</label>
                <input
                  type="date"
                  value={showtimeForm.date}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                  className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Giờ Chiếu</label>
                <input
                  type="text"
                  value={showtimeForm.time}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                  placeholder="Ví dụ: 09:30"
                  className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Giá Vé Niêm Yết (VNĐ)</label>
              <input
                type="number"
                value={showtimeForm.price}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, price: e.target.value })}
                className="w-full bg-zinc-900/45 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              THÊM SUẤT CHIẾU
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
