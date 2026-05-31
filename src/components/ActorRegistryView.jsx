import { useState, useMemo } from 'react';
import { Search, Film, X, Clapperboard, Award, Star } from 'lucide-react';
import { MOVIES } from '../data/mockData';

export default function ActorRegistryView({ onBackHome, onBookTicket }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActor, setSelectedActor] = useState(null);

  // 1. The Reverse-Graph Casting Algorithm (Client-Side)
  // Extracts unique actor profiles across all movies and consolidates their filmographies.
  const consolidatedActors = useMemo(() => {
    const registry = {};

    MOVIES.forEach(movie => {
      if (movie.cast && Array.isArray(movie.cast)) {
        movie.cast.forEach(actor => {
          const name = actor.name;
          if (!registry[name]) {
            registry[name] = {
              name,
              avatarUrl: actor.avatarUrl,
              filmography: []
            };
          }
          // Push this movie's metadata into the star's portfolio
          registry[name].filmography.push({
            id: movie.id,
            title: movie.title,
            role: actor.role,
            posterUrl: movie.posterUrl || movie.image,
            status: movie.status,
            rating: movie.rating
          });
        });
      }
    });

    return Object.values(registry);
  }, []);

  // 2. Filter Consolidated Dataset by Search Query
  const filteredActors = useMemo(() => {
    return consolidatedActors.filter(actor =>
      actor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [consolidatedActors, searchQuery]);

  // Compute a custom biography based on actor's name
  const getActorBiography = (name) => {
    const bios = {
      "Kaity Nguyễn": "Sinh năm 1999, Kaity Nguyễn là một trong những ngọc nữ đắt giá nhất của điện ảnh Việt Nam đương đại. Cô sở hữu khả năng diễn xuất tự nhiên thiên bẩm cùng thần thái sang trọng, liên tục gặt hái thành công lớn qua các tác phẩm phòng vé đình đám.",
      "Trấn Thành": "Nghệ sĩ đa tài hàng đầu làng giải trí với vai trò diễn viên, đạo diễn và nhà sản xuất kỷ lục. Trấn Thành nổi tiếng với lối diễn xuất có chiều sâu tâm lý cực cao cùng khả năng thấu hiểu thị hiếu khán giả đại chúng sắc bén.",
      "Kiều Minh Tuấn": "Ông hoàng phòng vé thực lực của điện ảnh Việt. Kiều Minh Tuấn biến hóa vô cùng đa dạng từ vai hài hước, phản diện cho đến các vai tâm lý lấy nước mắt người xem, khẳng định vị thế vững chắc trong lòng công chúng.",
      "Ana de Armas": "Nữ diễn viên gốc Cuba quyến rũ đang càn quét Hollywood. Nổi tiếng với khả năng đóng phim hành động đỉnh cao bên cạnh tài năng diễn xuất chính kịch được đề cử giải Oscar danh giá.",
      "Keanu Reeves": "Biểu tượng bất tử của dòng phim hành động Hollywood. Keanu nổi tiếng toàn thế giới qua các loạt phim huyền thoại và lối sống giản dị, nhân hậu được hàng triệu người mến mộ.",
      "Florence Pugh": "Ngôi sao thế hệ mới đầy tài năng của điện ảnh Anh Quốc và thế giới. Florence Pugh liên tục ghi điểm bằng những vai diễn gai góc, cá tính mạnh mẽ cùng chất giọng khàn đặc trưng cuốn hút.",
      "Sebastian Stan": "Nam diễn viên thực lực người Mỹ gốc Romania. Ghi dấu ấn đậm nét qua vai diễn chiến binh đông lạnh siêu anh hùng Marvel cùng hàng loạt dự án phim độc lập giàu tính nghệ thuật.",
      "Anthony Mackie": "Nam diễn viên tràn đầy năng lượng với phong cách trình diễn mạnh mẽ. Anh hiện đảm nhận vai trò thủ lĩnh mới của biệt đội siêu anh hùng trong vũ trụ điện ảnh Marvel.",
      "Jack Black": "Ngôi sao hài kịch kiêm ca sĩ huyền thoại người Mỹ. Với tính cách bùng nổ, vui tươi và tràn đầy sức sống, anh luôn mang lại tiếng cười sảng khoái cho khán giả mọi lứa tuổi.",
      "Jason Momoa": "Người hùng cơ bắp hoang dã đầy lôi cuốn của màn ảnh rộng. Nổi tiếng với vóc dáng lực lưỡng cùng các vai diễn hành động phiêu lưu kỳ vĩ.",
      "David Corenswet": "Tài năng trẻ đang lên với vẻ ngoài cổ điển đầy cuốn hút. Anh được lựa chọn để hóa thân thành biểu tượng công lý thế giới mới trong loạt bom tấn siêu anh hùng sắp tới.",
      "Rachel Brosnahan": "Nữ diễn viên tài sắc vẹn toàn từng giành nhiều giải thưởng Emmy danh giá. Cô sở hữu lối diễn xuất thông minh, lôi cuốn và ngập tràn năng lượng tích cực."
    };

    return bios[name] || `Là ngôi sao điện ảnh tài năng sở hữu nhiều cống hiến nổi bật và các vai diễn để lại dấu ấn sâu sắc trong lòng khán giả yêu thích các dự án phim chiếu rạp tại LoraFilm.`;
  };

  // Launch direct booking payload from actor portfolio timeline
  const handleDirectBook = (movie) => {
    const bookingPayload = {
      movieId: movie.id,
      movieTitle: movie.title,
      cinema: 'Lora Nguyen Du',
      time: '19:30',
      format: '2D DIGITAL',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      fullDate: new Date().toLocaleDateString('vi-VN'),
      selectedSeats: []
    };
    onBookTicket(bookingPayload);
    setSelectedActor(null); // close details modal
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dynamic Header Titles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">Ngôi Sao Điện Ảnh</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
              Gặp gỡ dàn diễn viên gạo cội và khám phá các vai diễn của họ tại LoraFilm
            </p>
          </div>
          <button
            onClick={onBackHome}
            className="text-xs font-bold text-zinc-500 hover:text-brand-coral transition-colors self-start sm:self-center"
          >
            Quay lại trang chủ
          </button>
        </div>

        {/* Search & Filter Header Bar */}
        <div className="flex justify-between items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm diễn viên theo tên..."
              className="bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-white rounded-xl pl-10 pr-4 py-2.5 w-full text-xs font-semibold focus:outline-none transition-colors"
            />
          </div>
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-wider hidden sm:block">
            Tổng cộng: {filteredActors.length} diễn viên
          </span>
        </div>

        {/* 2. The Portfolio Grid Display */}
        {filteredActors.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-3">
            <Film className="w-12 h-18 text-zinc-700 mx-auto" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Không tìm thấy diễn viên</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Không tìm thấy kết quả nào trùng khớp với từ khóa của bạn. Vui lòng kiểm tra lại chính tả.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredActors.map((actor, idx) => {
              const nowShowingCount = actor.filmography.filter(f => f.status === 'NOW_SHOWING').length;
              
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedActor(actor)}
                  className="group overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 aspect-[3/4] cursor-pointer relative shadow-xl hover:border-zinc-700/80 transition-all duration-300"
                >
                  {/* Portrait portrait image */}
                  <img
                    src={actor.avatarUrl}
                    alt={actor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Dark gradient shadow panel overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-4 pt-8 flex flex-col justify-end">
                    <h3 className="font-black text-white text-xs md:text-sm tracking-tight leading-snug group-hover:text-amber-500 transition-colors">
                      {actor.name}
                    </h3>
                    
                    {/* Count tag indicator */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-zinc-400">
                      <Clapperboard className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span>
                        {nowShowingCount > 0 
                          ? `${nowShowingCount} Phim đang chiếu` 
                          : `${actor.filmography.length} Phim đã đóng`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 3. Interactive Actor Portfolio Overlay Modal */}
      {selectedActor && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-250">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedActor(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white focus:outline-none p-1 bg-zinc-950 border border-zinc-800/80 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Portrait & Biography */}
            <div className="md:col-span-2 space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-lg">
                <img
                  src={selectedActor.avatarUrl}
                  alt={selectedActor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Bio Details */}
              <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">Tiểu sử diễn viên</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {getActorBiography(selectedActor.name)}
                </p>
              </div>
            </div>

            {/* Right Column: Filmography Timeline List */}
            <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-wider">{selectedActor.name}</h2>
                  <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">
                    Dự án điện ảnh hợp tác cùng LoraFilm
                  </p>
                </div>

                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block border-b border-zinc-800/80 pb-1.5">
                    Tác phẩm tại LoraFilm
                  </span>

                  {selectedActor.filmography.map((work, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-950 border border-zinc-850 rounded-2xl p-3 flex items-center justify-between gap-4 hover:border-zinc-800 transition-colors"
                    >
                      {/* Movie mini Row details */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800">
                          <img src={work.posterUrl} alt={work.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-white leading-tight line-clamp-1">
                            {work.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 font-semibold line-clamp-1">
                            Vai diễn: <span className="text-amber-500">{work.role}</span>
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              work.status === 'NOW_SHOWING' 
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/10' 
                                : 'bg-blue-950/80 text-blue-400 border border-blue-500/10'
                            }`}>
                              {work.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                            </span>
                            <div className="flex items-center gap-0.5 text-brand-yellow">
                              <Star className="w-2.5 h-2.5 fill-brand-yellow text-brand-yellow" />
                              <span className="text-[9px] font-bold">{work.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Direct Booking CTA (only active for active showtime movies) */}
                      {work.status === 'NOW_SHOWING' ? (
                        <button
                          onClick={() => handleDirectBook(work)}
                          className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-black uppercase py-2 px-3.5 rounded-xl transition-colors shrink-0 shadow-lg shadow-amber-500/10 focus:outline-none"
                        >
                          Đặt Vé
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider shrink-0 pr-2">
                          Sắp Chiếu
                        </span>
                      )}

                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button overlay */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedActor(null)}
                  className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all focus:outline-none"
                >
                  Đóng
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
