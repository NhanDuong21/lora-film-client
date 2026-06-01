import { useState, useMemo } from 'react';
import { 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  X, 
  Film, 
  Globe, 
  Users, 
  UserCheck 
} from 'lucide-react';
import { MOVIES } from '../../data/mockData';
import { INITIAL_ACTORS } from '../../data/mockDashboardData';

export default function AdminActorView() {
  const [actors, setActors] = useState(() => {
    const saved = localStorage.getItem('lora_actors');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_actors', JSON.stringify(INITIAL_ACTORS));
    return INITIAL_ACTORS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingActor, setEditingActor] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formNationality, setFormNationality] = useState('Việt Nam');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBiography, setFormBiography] = useState('');
  const [formStarredFilms, setFormStarredFilms] = useState([]);
  const [formBirthdate, setFormBirthdate] = useState('');

  // Save changes helper
  const saveActors = (updatedActors) => {
    setActors(updatedActors);
    localStorage.setItem('lora_actors', JSON.stringify(updatedActors));
  };

  // Filter & Search computation
  const filteredActors = useMemo(() => {
    return actors.filter(actor => 
      actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      actor.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (actor.starredFilms && actor.starredFilms.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [actors, searchQuery]);

  // Compute Metrics
  const metrics = useMemo(() => {
    const total = actors.length;
    const nationalities = new Set(actors.map(a => a.nationality)).size;
    const totalLinkedFilms = new Set(actors.flatMap(a => a.starredFilms || [])).size;
    return { total, nationalities, totalLinkedFilms };
  }, [actors]);

  const handleOpenAdd = () => {
    setEditingActor(null);
    setFormName('');
    setFormNationality('Việt Nam');
    setFormImageUrl('');
    setFormBiography('');
    setFormStarredFilms([]);
    setFormBirthdate('');
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (actor) => {
    setEditingActor(actor);
    setFormName(actor.name);
    setFormNationality(actor.nationality || 'Việt Nam');
    setFormImageUrl(actor.imageUrl || '');
    setFormBiography(actor.biography || '');
    setFormStarredFilms(actor.starredFilms || []);
    setFormBirthdate(actor.birthdate || '');
    setIsDrawerOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName || !formNationality) {
      alert('Vui lòng nhập tên diễn viên và quốc tịch.');
      return;
    }

    const actorPayload = {
      name: formName,
      nationality: formNationality,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      biography: formBiography,
      starredFilms: formStarredFilms,
      birthdate: formBirthdate
    };

    if (editingActor) {
      // Edit
      const updated = actors.map(a => a.id === editingActor.id ? { ...actorPayload, id: a.id } : a);
      saveActors(updated);
    } else {
      // Create
      const newActor = {
        ...actorPayload,
        id: actors.length ? Math.max(...actors.map(a => a.id)) + 1 : 1
      };
      saveActors([...actors, newActor]);
    }
    setIsDrawerOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa diễn viên này?')) {
      const updated = actors.filter(a => a.id !== id);
      saveActors(updated);
    }
  };

  const nationalityOptions = [
    'Việt Nam',
    'Mỹ',
    'Cuba/Tay Ban Nha',
    'Canada',
    'Anh Quốc',
    'Romania',
    'Hàn Quốc',
    'Nhật Bản',
    'Pháp',
    'Đức',
    'Úc',
    'Ấn Độ',
    'Khác'
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans relative overflow-x-hidden">
      
      {/* Page Header Title & Status */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
          QUẢN LÝ DIỄN VIÊN
        </h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">
          Báo cáo hiệu suất và công cụ cấu hình hệ thống LoraFilm
        </p>
      </div>

      {/* KPI metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
              Tổng Diễn Viên
            </span>
            <span className="text-3xl font-black text-white">{metrics.total}</span>
          </div>
          <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-xl">
            <Users className="w-6 h-6 text-brand-coral" />
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
              Quốc Tịch Đại Diện
            </span>
            <span className="text-3xl font-black text-white">{metrics.nationalities}</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Globe className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 flex items-center justify-between shadow-md">
          <div>
            <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
              Phim Được Liên Kết
            </span>
            <span className="text-3xl font-black text-white">{metrics.totalLinkedFilms}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Film className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Control Action Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 mt-4 pb-5 border-b border-zinc-800">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm diễn viên, quốc tịch, phim..."
            className="bg-zinc-900 border border-zinc-800 text-sm rounded-lg pl-10 pr-4 py-2 w-full focus:border-amber-500 outline-none text-zinc-200 placeholder-zinc-500 transition-colors"
          />
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 w-full sm:w-auto justify-center"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Thêm Diễn Viên
        </button>
      </div>

      {/* High Density Table */}
      <div className="w-full overflow-x-auto bg-zinc-900/30 border border-zinc-800 rounded-xl shadow-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
              <th className="py-4 px-4 text-center w-16">ID</th>
              <th className="py-4 px-4">Ảnh & Tên Diễn Viên</th>
              <th className="py-4 px-4">Quốc Tịch</th>
              <th className="py-4 px-4">Phim Tham Gia</th>
              <th className="py-4 px-4 text-center w-28">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {filteredActors.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-zinc-500 font-medium">
                  Không tìm thấy diễn viên nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredActors.map((actor) => (
                <tr key={actor.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-4 px-4 text-center text-zinc-500 font-mono font-medium">
                    #{actor.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={actor.imageUrl} 
                        alt={actor.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-zinc-800"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="font-bold text-white text-sm">{actor.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-300 font-medium">
                    {actor.nationality}
                  </td>
                  <td className="py-4 px-4 text-zinc-450 font-medium max-w-xs truncate">
                    {actor.starredFilms && actor.starredFilms.length > 0 
                      ? actor.starredFilms.join(', ') 
                      : 'Chưa liên kết phim'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        onClick={() => handleOpenEdit(actor)}
                        className="p-1.5 hover:text-amber-500 text-zinc-500 hover:bg-zinc-800/50 rounded transition-all cursor-pointer"
                        title="Sửa diễn viên"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(actor.id)}
                        className="p-1.5 hover:text-red-500 text-zinc-500 hover:bg-zinc-800/50 rounded transition-all cursor-pointer"
                        title="Xóa diễn viên"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Backdrop for Slide-over Drawer */}
      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Slide-over Side Drawer Form */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 p-6 flex flex-col justify-between transition-transform duration-300 transform ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-amber-500" />
                {editingActor ? 'Cập Nhật Diễn Viên' : 'Thêm Diễn Viên Mới'}
              </h3>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto max-h-[70vh] pr-1 scrollbar-thin">
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                  Tên diễn viên *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Kaity Nguyễn"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                    Quốc tịch *
                  </label>
                  <select
                    value={formNationality}
                    onChange={(e) => setFormNationality(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500/40 transition-colors"
                  >
                    {nationalityOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                    Ngày sinh (YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    value={formBirthdate}
                    onChange={(e) => setFormBirthdate(e.target.value)}
                    placeholder="Ví dụ: 1999-04-09"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                  Ảnh đại diện URL
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                  Tiểu sử chi tiết
                </label>
                <textarea
                  value={formBiography}
                  onChange={(e) => setFormBiography(e.target.value)}
                  placeholder="Nhập giới thiệu, thành tựu nghệ thuật..."
                  rows="4"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-500/40 transition-colors resize-none scrollbar-thin"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">
                  Liên kết phim (Chọn phim tham gia)
                </label>
                <div className="bg-zinc-950 border border-zinc-855 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {MOVIES.map(movie => (
                    <label key={movie.id} className="flex items-center gap-2 text-xs text-zinc-350 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={formStarredFilms.includes(movie.title)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormStarredFilms([...formStarredFilms, movie.title]);
                          } else {
                            setFormStarredFilms(formStarredFilms.filter(t => t !== movie.title));
                          }
                        }}
                        className="rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500/20 w-3.5 h-3.5"
                      />
                      <span>{movie.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 bg-zinc-900 mt-6">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="px-4 py-2 border border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-zinc-400"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-md shadow-amber-500/10"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
