import { useState, useMemo } from 'react';
import { Search, PlusCircle, Edit3, Trash2, X } from 'lucide-react';

export default function AdminMovieView({ movies, updateMoviesState, triggerToast }) {
  const [movieSearch, setMovieSearch] = useState('');
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    duration: '',
    ageRating: 'P',
    status: 'NOW_SHOWING',
    genres: '',
    synopsis: '',
    releaseYear: 2026
  });

  const filteredMovies = useMemo(() => {
    return movies.filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase()));
  }, [movies, movieSearch]);

  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      duration: '120 phút',
      ageRating: 'P',
      status: 'NOW_SHOWING',
      genres: 'Hành Động',
      synopsis: '',
      releaseYear: 2026
    });
    setMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      duration: movie.duration.replace('phut', 'phút'),
      ageRating: movie.ageRating,
      status: movie.status,
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      synopsis: movie.synopsis || '',
      releaseYear: movie.releaseYear || 2026
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.duration) {
      triggerToast('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    const processedMovie = {
      title: movieForm.title,
      duration: movieForm.duration.includes('phút') ? movieForm.duration : `${movieForm.duration} phút`,
      ageRating: movieForm.ageRating,
      status: movieForm.status,
      genres: movieForm.genres.split(',').map(g => g.trim()),
      synopsis: movieForm.synopsis,
      releaseYear: parseInt(movieForm.releaseYear) || 2026,
      rating: editingMovie ? editingMovie.rating : 4.5,
      posterUrl: editingMovie ? editingMovie.posterUrl : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      trailerId: editingMovie ? editingMovie.trailerId : 'eHp3MbsQgzk'
    };

    if (editingMovie) {
      const updated = movies.map(m => m.id === editingMovie.id ? { ...processedMovie, id: m.id } : m);
      updateMoviesState(updated);
      triggerToast('Cập nhật thông tin phim thành công!');
    } else {
      const newMovie = { ...processedMovie, id: Date.now() };
      updateMoviesState([...movies, newMovie]);
      triggerToast('Thêm phim mới thành công!');
    }
    setMovieModalOpen(false);
  };

  const handleDeleteMovie = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      const updated = movies.filter(m => m.id !== id);
      updateMoviesState(updated);
      triggerToast('Đã xóa phim khỏi danh sách!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={movieSearch}
            onChange={(e) => setMovieSearch(e.target.value)}
            placeholder="Tìm kiếm phim..."
            className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 pl-9 pr-4 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral transition-colors"
          />
        </div>
        <button
          onClick={handleOpenAddMovie}
          className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-90 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>THÊM PHIM MỚI</span>
        </button>
      </div>

      {/* Main Grid Data Sheet Table */}
      <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="bg-zinc-950/80 text-zinc-400 font-black uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Tên Phim</th>
                <th className="py-4 px-6">Độ Dài</th>
                <th className="py-4 px-6">Giới Hạn Tuổi</th>
                <th className="py-4 px-6">Năm Phát Hành</th>
                <th className="py-4 px-6">Trạng Thái</th>
                <th className="py-4 px-6 text-center w-32">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-500 font-semibold">
                    Không tìm thấy phim nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-zinc-900/20 transition-colors border-b border-zinc-800/40">
                    <td className="py-4 px-6 font-bold text-zinc-200 text-sm">{movie.title}</td>
                    <td className="py-4 px-6 text-zinc-300 font-medium">
                      {movie.duration ? movie.duration.replace('phut', 'phút') : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-[10px] font-black rounded-full bg-red-950/40 text-red-400 border border-red-900/40">
                        {movie.ageRating}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-medium">{movie.releaseYear}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        movie.status === 'NOW_SHOWING' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {movie.status === 'NOW_SHOWING' ? 'ĐANG CHIẾU' : 'SẮP CHIẾU'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditMovie(movie)}
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-xl transition-all"
                          title="Sửa phim"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/40 rounded-xl transition-all"
                          title="Xóa phim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {movieModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveMovie} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-base font-black text-zinc-100 uppercase tracking-wider">
                {editingMovie ? 'CẬP NHẬT PHIM' : 'THÊM PHIM MỚI'}
              </h3>
              <button type="button" onClick={() => setMovieModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Tên Phim</label>
              <input
                type="text"
                value={movieForm.title}
                onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Độ Dài</label>
                <input
                  type="text"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                  placeholder="Ví dụ: 112 phút"
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Năm Phát Hành</label>
                <input
                  type="number"
                  value={movieForm.releaseYear}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseYear: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Giới Hạn Tuổi</label>
                <select
                  value={movieForm.ageRating}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                >
                  <option value="P">P (Mọi lứa tuổi)</option>
                  <option value="T13">T13 (Dưới 13 tuổi cần người giám hộ)</option>
                  <option value="T16">T16 (Từ 16 tuổi trở lên)</option>
                  <option value="T18">T18 (Từ 18 tuổi trở lên)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-[10px] font-black uppercase block">Trạng Thái</label>
                <select
                  value={movieForm.status}
                  onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                  className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
                >
                  <option value="NOW_SHOWING">ĐANG CHIẾU (NOW SHOWING)</option>
                  <option value="COMING_SOON">SẮP CHIẾU (COMING SOON)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Thể Loại (Cách nhau bằng dấu phẩy)</label>
              <input
                type="text"
                value={movieForm.genres}
                onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-[10px] font-black uppercase block">Tóm Tắt Phim</label>
              <textarea
                value={movieForm.synopsis}
                onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                rows="3"
                className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-brand-coral resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-90 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              LƯU THÔNG TIN
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
