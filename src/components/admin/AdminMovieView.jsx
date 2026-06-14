import { useState, useMemo } from 'react';
import { Search, PlusCircle, Edit3, Trash2, X, Upload, ArrowLeft, Check } from 'lucide-react';

const GENRE_LIST = [
  'Anime', 'Bí ẩn', 'Cao bồi', 'Chiến tranh', 'Chính kịch', 'Gia đình', 'Giả tưởng', 'Giật gân',
  'Hoạt hình', 'Hài', 'Hành động', 'Học đường', 'Isekai', 'Khoa học viễn tưởng', 'Kinh dị', 'Lịch sử',
  'Phiêu lưu', 'Shounen', 'Siêu nhiên', 'Thể thao', 'Tài liệu', 'Tâm lý', 'Tình cảm', 'Tội phạm',
  'Viễn Tưởng', 'Võ thuật', 'Âm nhạc'
];

export default function AdminMovieView({ movies, updateMoviesState, triggerToast }) {
  const [movieSearch, setMovieSearch] = useState('');
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  const [movieForm, setMovieForm] = useState({
    title: '',
    synopsis: '',
    type: 'Single',
    status: 'SHOWING',
    duration: '120',
    episodesCount: 1,
    language: 'Tiếng Việt',
    directorName: '',
    actors: '',
    ageRating: 'P',
    posterUrl: '',
    trailerUrl: '',
    country: 'Việt Nam',
    releaseDate: '2026-06-14'
  });

  const [selectedGenres, setSelectedGenres] = useState([]);

  const filteredMovies = useMemo(() => {
    return movies.filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase()));
  }, [movies, movieSearch]);

  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      title: '',
      synopsis: '',
      type: 'Single',
      status: 'SHOWING',
      duration: '120',
      episodesCount: 1,
      language: 'Tiếng Việt',
      directorName: '',
      actors: '',
      ageRating: 'P',
      posterUrl: '',
      trailerUrl: '',
      country: 'Việt Nam',
      releaseDate: new Date().toISOString().split('T')[0]
    });
    setSelectedGenres([]);
    setMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title || '',
      synopsis: movie.synopsis || '',
      type: movie.type || 'Single',
      status: movie.status === 'NOW_SHOWING' || movie.status === 'DANG_CHIEU' ? 'SHOWING' : (movie.status === 'COMING_SOON' || movie.status === 'SAP_CHIEU' ? 'UPCOMING' : movie.status || 'SHOWING'),
      duration: String(movie.duration || 120),
      episodesCount: movie.episodesCount || 1,
      language: movie.language || 'Tiếng Việt',
      directorName: movie.director?.name || (typeof movie.director === 'string' ? movie.director : ''),
      actors: movie.actor || '',
      ageRating: movie.ageRating || 'P',
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || movie.trailerEmbedUrl || '',
      country: movie.country || 'Việt Nam',
      releaseDate: movie.releaseDate || (movie.releaseYear ? `${movie.releaseYear}-01-01` : new Date().toISOString().split('T')[0])
    });
    setSelectedGenres(movie.genres || (movie.genre ? movie.genre.split(',').map(g => g.trim()) : []));
    setMovieModalOpen(true);
  };

  const handleGenreToggle = (genreName) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreName)) {
        return prev.filter(g => g !== genreName);
      } else {
        return [...prev, genreName];
      }
    });
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.duration) {
      triggerToast('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    const year = parseInt(movieForm.releaseDate.split('-')[0]) || 2026;

    const processedMovie = {
      title: movieForm.title,
      synopsis: movieForm.synopsis,
      type: movieForm.type,
      status: movieForm.status,
      duration: parseInt(movieForm.duration) || 120,
      episodesCount: parseInt(movieForm.episodesCount) || 1,
      language: movieForm.language,
      director: {
        name: movieForm.directorName,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
      },
      actor: movieForm.actors,
      ageRating: movieForm.ageRating,
      posterUrl: movieForm.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      image: movieForm.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      trailerUrl: movieForm.trailerUrl,
      trailerEmbedUrl: movieForm.trailerUrl || 'https://www.youtube.com/embed/eHp3MbsQgzk',
      country: movieForm.country,
      releaseDate: movieForm.releaseDate,
      releaseYear: year,
      genres: selectedGenres,
      genre: selectedGenres.join(', '),
      rating: editingMovie ? editingMovie.rating : 4.5,
      actorIds: editingMovie ? editingMovie.actorIds : []
    };

    if (editingMovie) {
      const updated = movies.map(m => m.id === editingMovie.id ? { ...processedMovie, id: m.id } : m);
      updateMoviesState(updated);
      triggerToast('Cập nhật thông tin phim thành công!');
    } else {
      const newMovie = { ...processedMovie, id: 'm_' + Date.now() };
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

  if (movieModalOpen) {
    return (
      <div className="w-full bg-zinc-950 p-6 flex flex-col gap-6 animate-fade-in">
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMovieModalOpen(false)}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-black text-zinc-100 uppercase tracking-wider">
              {editingMovie ? 'Cập Nhật Thông Tin Phim' : 'Tạo Phim Mới'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSaveMovie} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: CORE DATABASE FIELDS MATRIX (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                  Thông Tin Cơ Bản
                </h3>
                
                {/* Tiêu đề phim */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Tiêu đề phim</label>
                  <input
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    placeholder="Nhập tên phim..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    required
                  />
                </div>

                {/* Mô tả phim */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Mô tả phim</label>
                  <textarea
                    value={movieForm.synopsis}
                    onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                    rows={4}
                    placeholder="Tóm tắt nội dung..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors resize-none"
                  />
                </div>

                {/* Row Grid Splitter 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Loại phim</label>
                    <select
                      value={movieForm.type}
                      onChange={(e) => setMovieForm({ ...movieForm, type: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    >
                      <option value="Single">Phim Lẻ (Single)</option>
                      <option value="Series">Phim Bộ (Series)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Trạng thái</label>
                    <select
                      value={movieForm.status}
                      onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    >
                      <option value="UPCOMING">Sắp chiếu (UPCOMING)</option>
                      <option value="SHOWING">Đang chiếu (SHOWING)</option>
                      <option value="ENDED">Đã đóng suất (ENDED)</option>
                    </select>
                  </div>
                </div>

                {/* Row Grid Splitter 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Thời lượng (Phút)</label>
                    <input
                      type="number"
                      min="0"
                      value={movieForm.duration}
                      onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Tổng số tập</label>
                    <input
                      type="number"
                      min="1"
                      value={movieForm.episodesCount}
                      onChange={(e) => setMovieForm({ ...movieForm, episodesCount: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Row Grid Splitter 3 (Advanced Metadata) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Ngôn ngữ</label>
                    <input
                      type="text"
                      value={movieForm.language}
                      onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                      placeholder="Tiếng Anh, Vietsub..."
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Đạo diễn</label>
                    <input
                      type="text"
                      value={movieForm.directorName}
                      onChange={(e) => setMovieForm({ ...movieForm, directorName: e.target.value })}
                      placeholder="Tên đạo diễn..."
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                </div>

                {/* Row Grid Splitter 4 (Extended Logs) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Diễn viên</label>
                    <input
                      type="text"
                      value={movieForm.actors}
                      onChange={(e) => setMovieForm({ ...movieForm, actors: e.target.value })}
                      placeholder="Diễn viên 1, Diễn viên 2..."
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Độ tuổi</label>
                    <select
                      value={movieForm.ageRating}
                      onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    >
                      <option value="P">P (Mọi lứa tuổi)</option>
                      <option value="T13">T13 (Từ 13 tuổi trở lên)</option>
                      <option value="T16">T16 (Từ 16 tuổi trở lên)</option>
                      <option value="T18">T18 (Từ 18 tuổi trở lên)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Thể loại Pill Matrix */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                  Thể loại (Chọn nhiều)
                </h3>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {GENRE_LIST.map((genreName) => {
                    const isSelected = selectedGenres.includes(genreName);
                    return (
                      <button
                        key={genreName}
                        type="button"
                        onClick={() => handleGenreToggle(genreName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                          isSelected
                            ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-md shadow-amber-500/10'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                        }`}
                      >
                        {genreName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: ASSETS & RELATIONSHIP PILLS MATRIX (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Poster Asset Upload Card */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                  Poster phim
                </h3>
                
                <div className="space-y-3">
                  {movieForm.posterUrl ? (
                    <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden border border-zinc-800 relative group">
                      <img src={movieForm.posterUrl} alt="Poster Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() => setMovieForm({ ...movieForm, posterUrl: '' })}
                          className="bg-red-650 text-white font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[2/3] w-full rounded-2xl bg-zinc-900/60 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 hover:border-amber-500/40 transition-colors p-4 text-center">
                      <Upload className="w-8 h-8 text-zinc-500" />
                      <span className="text-[10px] text-zinc-400 font-bold">Kéo thả hoặc click để upload ảnh poster</span>
                      <span className="text-[9px] text-zinc-650">Tỷ lệ khuyên dùng 2:3 (Dạng ảnh đứng)</span>
                    </div>
                  )}

                  <input
                    type="text"
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    placeholder="Đường dẫn ảnh poster (URL)..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                  />
                </div>
              </div>

              {/* Backdrop Asset Card */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                  Ảnh bìa / Backdrop
                </h3>
                
                <div className="space-y-3">
                  {movieForm.trailerUrl ? (
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800 relative group">
                      <img src={movieForm.trailerUrl} alt="Backdrop Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          type="button"
                          onClick={() => setMovieForm({ ...movieForm, trailerUrl: '' })}
                          className="bg-red-650 text-white font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Xóa ảnh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-900/60 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 hover:border-amber-500/40 transition-colors p-4 text-center">
                      <Upload className="w-8 h-8 text-zinc-500" />
                      <span className="text-[10px] text-zinc-400 font-bold">Kéo thả hoặc click để upload ảnh bìa</span>
                      <span className="text-[9px] text-zinc-650">Tỷ lệ khuyên dùng 16:9 (Dạng ảnh ngang)</span>
                    </div>
                  )}

                  <input
                    type="text"
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    placeholder="Đường dẫn ảnh bìa / Video trailer URL..."
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                  />
                </div>
              </div>

              {/* Relational Selectors Layout Grid */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                  Dữ Liệu Quốc Gia & Ngày Phát Hành
                </h3>

                <div className="space-y-3">
                  {/* Quốc gia */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Quốc gia</label>
                    <select
                      value={movieForm.country}
                      onChange={(e) => setMovieForm({ ...movieForm, country: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    >
                      <option value="Việt Nam">Việt Nam</option>
                      <option value="Mỹ">Mỹ</option>
                      <option value="Hàn Quốc">Hàn Quốc</option>
                      <option value="Nhật Bản">Nhật Bản</option>
                      <option value="Trung Quốc">Trung Quốc</option>
                      <option value="Anh">Anh</option>
                      <option value="Pháp">Pháp</option>
                    </select>
                  </div>

                  {/* Ngày phát hành */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block">Ngày phát hành</label>
                    <input
                      type="date"
                      value={movieForm.releaseDate}
                      onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl py-2.5 px-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Trigger button bar at the bottom */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-zinc-900 pt-6">
            <button
              type="button"
              onClick={() => setMovieModalOpen(false)}
              className="flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 font-bold px-6 py-3 rounded-2xl text-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3.5 rounded-2xl text-xs transition-all shadow-xl tracking-wider uppercase flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingMovie ? 'CẬP NHẬT THÔNG TIN' : 'TẠO PHIM MỚI'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

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
          className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-90 text-white text-xs font-black py-2.5 px-4 rounded-xl transition-all w-full sm:w-auto justify-center cursor-pointer"
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
                      {movie.duration ? `${movie.duration} phút` : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 text-[10px] font-black rounded-full bg-red-950/40 text-red-400 border border-red-900/40">
                        {movie.ageRating}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-300 font-medium">{movie.releaseYear}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        movie.status === 'DANG_CHIEU' || movie.status === 'NOW_SHOWING' || movie.status === 'SHOWING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : movie.status === 'SAP_CHIEU' || movie.status === 'COMING_SOON' || movie.status === 'UPCOMING'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-550 border-zinc-700'
                      }`}>
                        {movie.status === 'DANG_CHIEU' || movie.status === 'NOW_SHOWING' || movie.status === 'SHOWING'
                          ? 'ĐANG CHIẾU'
                          : movie.status === 'SAP_CHIEU' || movie.status === 'COMING_SOON' || movie.status === 'UPCOMING'
                            ? 'SẮP CHIẾU'
                            : 'ĐÃ ĐÓNG'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditMovie(movie)}
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-xl transition-all cursor-pointer"
                          title="Sửa phim"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="p-2 text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/40 rounded-xl transition-all cursor-pointer"
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
    </div>
  );
}

