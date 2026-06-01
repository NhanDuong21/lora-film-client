import { useState, useMemo } from 'react';
import { Film, Star, Tag, Clock, ArrowRight } from 'lucide-react';
import { MOVIES, CINEMA_CLUSTERS } from '../data/mockData';

const EVENTS = [
  {
    id: 1,
    title: "Thứ Ba Vui Vẻ - Đồng Giá Vé 60K",
    category: "Khuyến mãi mới",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    dateUntil: "Áp dụng đến 31/12/2026",
    content: "Đón chào những bom tấn chiếu rạp sôi động, LoraFilm Nguyễn Du tưng bừng gửi tặng tất cả khách hàng chương trình ưu đãi đặc biệt: Khi mua 2 vé xem phim bất kỳ tại quầy hoặc qua trang web LoraFilm, quý khách sẽ được nhận ngay 1 phần bắp rang bơ phô mai cỡ lớn thơm ngon.\n\nĐiều kiện áp dụng:\n- Thời gian diễn ra chương trình kéo dài đến hết 31/12/2026.\n- Áp dụng đối với tất cả suất chiếu và thể loại phim 2D/3D.\n- Không áp dụng đồng thời với các hình thức thẻ quà tặng khác."
  },
  {
    id: 2,
    title: "Thành Viên Vàng LoraFilm - Nhân Đôi Điểm Tích Lũy Suốt Tháng 6",
    category: "Ưu đãi thành viên",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    dateUntil: "Áp dụng đến 30/06/2026",
    content: "Lời tri ân sâu sắc gửi tới toàn thể hội viên LoraFilm. Trong suốt thời gian diễn ra sự kiện từ ngày 01/06 đến hết ngày 30/06/2026, các tài khoản thành viên khi thực hiện đặt vé thành công sẽ được tự động nhân đôi (x2) điểm tích lũy thành viên.\n\nĐiều kiện áp dụng:\n- Tài khoản thành viên phải được đăng nhập đầy đủ trước khi thực hiện giao dịch mua vé.\n- Điểm thưởng nhân đôi có giá trị dùng để đổi các phần quà bắp, nước, vé xem phim miễn phí hoặc vé mời sự kiện đặc biệt."
  },
  {
    id: 3,
    title: "Đặc Quyền Họp Báo Ra Mắt Phim Bom Tấn John Wick: Ballerina",
    category: "Sự kiện phim",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    dateUntil: "Áp dụng đến 15/07/2026",
    content: "Cơ hội có một không hai để tham gia buổi họp báo công chiếu đầu tiên và giao lưu trực tiếp cùng những ngôi sao, đạo diễn tầm cỡ quốc tế của siêu phẩm vũ trụ sát thủ John Wick: Ballerina.\n\nĐiều kiện áp dụng:\n- Chương trình bốc thăm may mắn dành riêng cho khách hàng VIP đạt mức chi tiêu tối thiểu trong năm.\n- 50 vé mời VIP dành tặng cho những người may mắn nhất đăng ký tham gia đặt trước vé phim sớm."
  },
  {
    id: 4,
    title: "Combo Bắp Nước Siêu Anh Hùng - Tặng Bình Nước Giới Hạn",
    category: "Khuyến mãi mới",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
    dateUntil: "Áp dụng đến 31/12/2026",
    content: "Đồng hành cùng các bạn học sinh, sinh viên sau những giờ học tập căng thẳng, LoraFilm áp dụng mức giá cực kỳ ưu đãi chỉ 45.000đ/vé cho tất cả các suất chiếu phim vào ngày Thứ Hai hàng tuần.\n\nĐiều kiện áp dụng:\n- Khách hàng xuất trình thẻ Học sinh - Sinh viên còn hạn hoặc thẻ căn cước công dân chứng minh độ tuổi dưới 22 tại quầy vé.\n- Chỉ áp dụng đối với vé phổ thông 2D."
  }
];

export default function EventRegistryView({ eventId, onBackHome, onBookTicket, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  // Sidebar booking form states
  const [quickMovieId, setQuickMovieId] = useState('');
  const [quickCinema, setQuickCinema] = useState('');
  const [quickDate, setQuickDate] = useState('');

  // Categories list
  const categories = ["Tất cả", "Khuyến mãi mới", "Ưu đãi thành viên", "Sự kiện phim"];

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (activeCategory === "Tất cả") return EVENTS;
    return EVENTS.filter(e => e.category === activeCategory);
  }, [activeCategory]);

  // Current details event if active
  const targetEvent = useMemo(() => {
    if (!eventId) return null;
    return EVENTS.find(e => e.id === parseInt(eventId)) || null;
  }, [eventId]);

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    if (!quickMovieId || !quickCinema || !quickDate) return;

    const matchedMovie = MOVIES.find(m => m.id === parseInt(quickMovieId));
    if (!matchedMovie) return;

    const bookingPayload = {
      movieId: matchedMovie.id,
      movieTitle: matchedMovie.title,
      cinema: quickCinema,
      time: '19:30',
      format: '2D DIGITAL',
      date: quickDate === 'Hôm nay' 
        ? new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
        : new Date(Date.now() + 86400000).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: quickDate === 'Hôm nay' 
        ? new Date().toLocaleDateString('vi-VN')
        : new Date(Date.now() + 86400000).toLocaleDateString('vi-VN'),
      selectedSeats: []
    };
    onBookTicket(bookingPayload);
  };

  const handleDirectBook = (movie) => {
    const bookingPayload = {
      movieId: movie.id,
      movieTitle: movie.title,
      cinema: 'Lora Nguyễn Du',
      time: '19:30',
      format: '2D DIGITAL',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date().toLocaleDateString('vi-VN'),
      selectedSeats: []
    };
    onBookTicket(bookingPayload);
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">Tin Tức & Sự Kiện</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Theo dõi những chương trình ưu đãi, khuyến mãi mới nhất từ hệ thống rạp LoraFilm
            </p>
          </div>
          <button
            onClick={onBackHome}
            className="text-xs font-bold text-zinc-500 hover:text-brand-coral transition-colors self-start sm:self-center focus:outline-none"
          >
            Quay lại trang chủ
          </button>
        </div>

        {/* Asymmetric Multi-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANEL: Events content (2/3 Width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {!eventId ? (
              // ============================================
              // 1. THE EVENT LIST SUB-VIEW (Màn Hình Danh Sách)
              // ============================================
              <div className="space-y-6">
                
                {/* Upper Tab Filter Bar */}
                <div className="flex flex-wrap gap-2 pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all ${
                        activeCategory === cat
                          ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-450 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Event Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onNavigate('event-detail', { eventId: evt.id })}
                      className="group overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col cursor-pointer hover:border-zinc-700 transition-all duration-300"
                    >
                      {/* Image container */}
                      <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800 relative">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-500 px-2 py-0.5 rounded border border-zinc-800/50 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />
                          {evt.category}
                        </span>
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-xs font-black text-white group-hover:text-amber-500 transition-colors leading-snug line-clamp-2">
                            {evt.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500">
                            <Clock className="w-3 h-3 text-zinc-550 shrink-0" />
                            <span>{evt.dateUntil}</span>
                          </div>
                        </div>

                        <div className="text-[9px] font-black uppercase tracking-widest text-amber-500/80 group-hover:text-amber-500 transition-colors flex items-center gap-1">
                          <span>Xem chi tiết</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ) : (
              // ============================================
              // 2. THE DEEP EVENT DETAIL SUB-VIEW (Màn Hình Chi Tiết)
              // ============================================
              <div className="space-y-6">
                
                {/* Breadcrumb Navigator */}
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900/50">
                  <button onClick={onBackHome} className="hover:text-white transition-colors focus:outline-none">Trang chủ</button>
                  <span>/</span>
                  <button onClick={() => onNavigate('events', null)} className="hover:text-white transition-colors focus:outline-none">Sự kiện</button>
                  <span>/</span>
                  <span className="text-amber-500 truncate max-w-xs">{targetEvent?.title || 'Chi tiết'}</span>
                </div>

                {targetEvent ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden p-6 space-y-6 shadow-2xl relative">
                    
                    {/* Wide Image Banner */}
                    <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                      <img src={targetEvent.image} alt={targetEvent.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-4">
                      {/* Meta information tags */}
                      <div className="flex items-center gap-3">
                        <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                          {targetEvent.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{targetEvent.dateUntil}</span>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h2 className="text-base md:text-lg font-black text-white leading-snug">
                        {targetEvent.title}
                      </h2>

                      {/* Structured typographic paragraphs */}
                      <div className="space-y-4 pt-3 border-t border-zinc-800/80 text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                        {targetEvent.content}
                      </div>

                      {/* Large Center Action Button */}
                      <div className="pt-6 flex justify-center">
                        <button
                          onClick={onBackHome}
                          className="bg-amber-500 hover:bg-amber-600 text-black font-black py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 text-xs uppercase tracking-wider focus:outline-none"
                        >
                          Tham Gia Ngay / Đặt Vé Ngay
                        </button>
                      </div>

                    </div>

                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Không tìm thấy thông tin sự kiện</h3>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* RIGHT PANEL: Sidebar (1/3 Width) */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            
            {/* Mua Vé Nhanh widget */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
              
              <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-black text-xs uppercase tracking-wider py-4 px-5 shadow-inner flex items-center justify-between">
                <span>Mua Vé Nhanh</span>
                <Film className="w-4 h-4 text-white/50" />
              </div>

              <form onSubmit={handleQuickBookingSubmit} className="p-5 space-y-4">
                
                {/* 1. Chọn Phim */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">1. Chọn Phim</label>
                  <select
                    value={quickMovieId}
                    onChange={(e) => {
                      setQuickMovieId(e.target.value);
                      setQuickCinema('');
                      setQuickDate('');
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl py-3 px-3.5 focus:border-blue-600 focus:outline-none transition-colors"
                  >
                    <option value="">-- Chọn Phim --</option>
                    {MOVIES.filter(m => m.status === 'NOW_SHOWING').map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Chọn Rạp */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">2. Chọn Rạp</label>
                  <select
                    disabled={!quickMovieId}
                    value={quickCinema}
                    onChange={(e) => {
                      setQuickCinema(e.target.value);
                      setQuickDate('');
                    }}
                    className={`w-full bg-zinc-950 border text-xs font-semibold rounded-xl py-3 px-3.5 focus:outline-none transition-colors ${
                      quickMovieId 
                        ? 'border-zinc-800 text-zinc-200 focus:border-blue-600 cursor-default' 
                        : 'border-zinc-900 text-zinc-655 cursor-not-allowed select-none'
                    }`}
                  >
                    <option value="">-- Chọn Rạp --</option>
                    {CINEMA_CLUSTERS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Chọn Ngày */}
                <div className="space-y-1.5">
                  <label className="text-[9px] text-zinc-500 font-black uppercase tracking-wider block">3. Chọn Ngày Chiếu</label>
                  <select
                    disabled={!quickCinema}
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    className={`w-full bg-zinc-950 border text-xs font-semibold rounded-xl py-3 px-3.5 focus:outline-none transition-colors ${
                      quickCinema 
                        ? 'border-zinc-800 text-zinc-200 focus:border-blue-600 cursor-default' 
                        : 'border-zinc-900 text-zinc-655 cursor-not-allowed select-none'
                    }`}
                  >
                    <option value="">-- Chọn Ngày --</option>
                    <option value="Hôm nay">Hôm nay</option>
                    <option value="Ngày mai">Ngày mai</option>
                  </select>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  disabled={!quickMovieId || !quickCinema || !quickDate}
                  className={`w-full font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 ${
                    quickMovieId && quickCinema && quickDate
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg shadow-blue-600/20 active:scale-[0.98]'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed select-none'
                  }`}
                >
                  Mua Vé Nhanh
                </button>

              </form>

            </div>

            {/* Phim Đang Chiếu list */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 space-y-4 shadow-2xl">
              
              <div className="border-b border-zinc-800 pb-2 flex justify-between items-center">
                <span className="text-white text-[10px] font-black uppercase tracking-wider">Phim Đang Chiếu</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-brand-yellow animate-pulse">Hot Now</span>
              </div>

              <div className="space-y-4">
                {MOVIES.slice(0, 3).map((movie) => (
                  <div 
                    key={movie.id}
                    onClick={() => handleDirectBook(movie)}
                    className="flex gap-3 hover:bg-white/5 p-1.5 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-18 rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800">
                      <img src={movie.posterUrl || movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-center">
                      <h4 className="text-xs font-extrabold text-zinc-200 group-hover:text-brand-coral transition-colors line-clamp-1">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase bg-zinc-950 border border-zinc-800 text-brand-yellow px-1.5 py-0.5 rounded">
                          {movie.ageRating || 'T16'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-brand-yellow text-brand-yellow" />
                          <span className="text-[9px] font-bold text-zinc-400">{movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
