import { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  CircleDollarSign,
  Ticket,
  Percent,
  Trash2,
  Edit3,
  PlusCircle,
  Search,
  X,
  AlertCircle
} from 'lucide-react';
import { 
  INITIAL_MOVIES, 
  INITIAL_THEATERS, 
  INITIAL_SHOWTIMES, 
  INITIAL_TICKETS, 
  INITIAL_CONCESSIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_EMPLOYEES 
} from '../data/mockDashboardData';
import AdminSidebar from './admin/AdminSidebar';
import AdminEventView from './admin/AdminEventView';
import AdminActorView from './admin/AdminActorView';

export default function AdminDashboardView({ onBackHome, initialTab }) {
  const { user, userRole, logout } = useAuth();
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');

  // Theater Clusters modal forms state
  const [theaterModalOpen, setTheaterModalOpen] = useState(false);
  const [theaterForm, setTheaterForm] = useState({ name: '', address: '', defaultHallsCount: 3 });

  const [hallModalOpen, setHallModalOpen] = useState(false);
  const [targetTheaterIdForHall, setTargetTheaterIdForHall] = useState(null);
  const [hallForm, setHallForm] = useState({ name: '', capacity: 120, format: '2D Digital' });

  // State initialization backed by localStorage
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('lora_movies');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_movies', JSON.stringify(INITIAL_MOVIES));
    return INITIAL_MOVIES;
  });

  const [theaters, setTheaters] = useState(() => {
    const saved = localStorage.getItem('lora_theaters');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_theaters', JSON.stringify(INITIAL_THEATERS));
    return INITIAL_THEATERS;
  });

  const [showtimes, setShowtimes] = useState(() => {
    const saved = localStorage.getItem('lora_showtimes');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_showtimes', JSON.stringify(INITIAL_SHOWTIMES));
    return INITIAL_SHOWTIMES;
  });

  const [tickets] = useState(() => {
    const saved = localStorage.getItem('lora_tickets');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_tickets', JSON.stringify(INITIAL_TICKETS));
    return INITIAL_TICKETS;
  });

  const [concessions] = useState(() => {
    const saved = localStorage.getItem('lora_concessions');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_concessions', JSON.stringify(INITIAL_CONCESSIONS));
    return INITIAL_CONCESSIONS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('lora_customers');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_customers', JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('lora_employees');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lora_employees', JSON.stringify(INITIAL_EMPLOYEES));
    return INITIAL_EMPLOYEES;
  });

  // Local helper state modifiers
  const updateMoviesState = (newMovies) => {
    setMovies(newMovies);
    localStorage.setItem('lora_movies', JSON.stringify(newMovies));
  };


  const updateShowtimesState = (newShowtimes) => {
    setShowtimes(newShowtimes);
    localStorage.setItem('lora_showtimes', JSON.stringify(newShowtimes));
  };

  const updateTheatersState = (newTheaters) => {
    setTheaters(newTheaters);
    localStorage.setItem('lora_theaters', JSON.stringify(newTheaters));
  };

  const updateCustomersState = (newCustomers) => {
    setCustomers(newCustomers);
    localStorage.setItem('lora_customers', JSON.stringify(newCustomers));
  };

  const updateEmployeesState = (newEmployees) => {
    setEmployees(newEmployees);
    localStorage.setItem('lora_employees', JSON.stringify(newEmployees));
  };

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // success or error
  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Search filter states
  const [movieSearch, setMovieSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Selected states for detail view (Theater/Hall detail view)
  const [selectedTheaterId, setSelectedTheaterId] = useState(1);

  // Modal forms states
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({ title: '', duration: '', ageRating: 'P', status: 'NOW_SHOWING', genres: '', synopsis: '', releaseYear: 2026 });

  const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({ movieId: '', theaterId: '', hallId: '', date: '', time: '', price: 80000 });
  const [showtimeError, setShowtimeError] = useState('');

  // 1. Movies CRUD Handlers
  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({ title: '', duration: '120 phut', ageRating: 'P', status: 'NOW_SHOWING', genres: 'Hanh Dong', synopsis: '', releaseYear: 2026 });
    setMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      duration: movie.duration,
      ageRating: movie.ageRating,
      status: movie.status,
      genres: movie.genres.join(', '),
      synopsis: movie.synopsis || '',
      releaseYear: movie.releaseYear || 2026
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = (e) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.duration) {
      triggerToast('Vui long dien day du thong tin!', 'error');
      return;
    }

    const processedMovie = {
      title: movieForm.title,
      duration: movieForm.duration,
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
      triggerToast('Cap nhat thong tin phim thanh cong!');
    } else {
      const newMovie = { ...processedMovie, id: Date.now() };
      updateMoviesState([...movies, newMovie]);
      triggerToast('Them phim moi thanh cong!');
    }
    setMovieModalOpen(false);
  };

  const handleDeleteMovie = (id) => {
    if (confirm('Ban co chac chan muon xoa phim nay?')) {
      const updated = movies.filter(m => m.id !== id);
      updateMoviesState(updated);
      triggerToast('Da xoa phim khoi danh sach!');
    }
  };


  // 3. Showtimes CRUD & Overlap detection
  const handleOpenAddShowtime = () => {
    setShowtimeForm({
      movieId: movies[0]?.id || '',
      theaterId: theaters[0]?.id || '',
      hallId: theaters[0]?.halls[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '19:30',
      price: 80000
    });
    setShowtimeError('');
    setShowtimeModalOpen(true);
  };

  const handleSaveShowtime = (e) => {
    e.preventDefault();
    setShowtimeError('');

    // Showtime Overlap detection:
    // A hall cannot host multiple screenings at the exact same date and time.
    const isOverlap = showtimes.some(st => 
      st.hallId.toString() === showtimeForm.hallId.toString() &&
      st.date === showtimeForm.date &&
      st.time === showtimeForm.time
    );

    if (isOverlap) {
      setShowtimeError('Trung lich! Phong chieu nay da duoc dang ky mot suat chieu vao dung khung gio da chon.');
      return;
    }

    const newShowtime = {
      id: Date.now(),
      movieId: parseInt(showtimeForm.movieId),
      theaterId: parseInt(showtimeForm.theaterId),
      hallId: showtimeForm.hallId,
      date: showtimeForm.date,
      time: showtimeForm.time,
      price: parseInt(showtimeForm.price) || 80000
    };

    updateShowtimesState([...showtimes, newShowtime]);
    triggerToast('Them suat chieu moi thanh cong!');
    setShowtimeModalOpen(false);
  };

  const handleDeleteShowtime = (id) => {
    if (confirm('Ban co chac chan muon xoa suat chieu nay?')) {
      const updated = showtimes.filter(st => st.id !== id);
      updateShowtimesState(updated);
      triggerToast('Da xoa suat chieu!');
    }
  };

  // 4. Theater Clusters & Halls triggers
  const handleOpenAddTheater = () => {
    setTheaterForm({ name: '', address: '', defaultHallsCount: 3 });
    setTheaterModalOpen(true);
  };

  const handleSaveTheater = (e) => {
    e.preventDefault();
    if (!theaterForm.name || !theaterForm.address) {
      triggerToast('Vui long dien day du ten va dia chi cum rap!', 'error');
      return;
    }

    const newTheaterId = Date.now();
    const count = parseInt(theaterForm.defaultHallsCount) || 3;
    const halls = [];
    for (let i = 1; i <= count; i++) {
      halls.push({
        id: `${newTheaterId}-${i}`,
        name: `Phong Chieu ${i}`,
        capacity: 120,
        format: '2D Digital'
      });
    }

    const newTheater = {
      id: newTheaterId,
      name: theaterForm.name,
      address: theaterForm.address,
      halls
    };

    const updated = [...theaters, newTheater];
    updateTheatersState(updated);
    setSelectedTheaterId(newTheaterId);
    setTheaterModalOpen(false);
    triggerToast('Them cum rap moi thanh cong!');
  };

  const handleOpenAddHall = (theaterId) => {
    setTargetTheaterIdForHall(theaterId);
    setHallForm({ 
      name: `Phong Chieu ${theaters.find(t => t.id === theaterId)?.halls.length + 1 || 1}`, 
      capacity: 120, 
      format: '2D Digital' 
    });
    setHallModalOpen(true);
  };

  const handleSaveHall = (e) => {
    e.preventDefault();
    if (!hallForm.name) {
      triggerToast('Vui long nhap ten phong chieu!', 'error');
      return;
    }

    const updated = theaters.map(t => {
      if (t.id === targetTheaterIdForHall) {
        return {
          ...t,
          halls: [
            ...t.halls,
            { 
              id: `${t.id}-${t.halls.length + 1}-${Date.now()}`, 
              name: hallForm.name, 
              capacity: parseInt(hallForm.capacity) || 120, 
              format: hallForm.format 
            }
          ]
        };
      }
      return t;
    });

    updateTheatersState(updated);
    setHallModalOpen(false);
    triggerToast('Da them phong chieu moi thanh cong!');
  };

  const handleRenameHall = (theaterId, hallId) => {
    const newName = prompt('Nhap ten phong chieu moi:');
    if (!newName) return;

    const updated = theaters.map(t => {
      if (t.id === theaterId) {
        return {
          ...t,
          halls: t.halls.map(h => h.id === hallId ? { ...h, name: newName } : h)
        };
      }
      return t;
    });

    updateTheatersState(updated);
    triggerToast('Da doi ten phong chieu!');
  };

  const handleDeleteHall = (theaterId, hallId) => {
    if (confirm('Ban co chac chan muon xoa phong chieu nay?')) {
      const updated = theaters.map(t => {
        if (t.id === theaterId) {
          return {
            ...t,
            halls: t.halls.filter(h => h.id !== hallId)
          };
        }
        return t;
      });
      updateTheatersState(updated);
      triggerToast('Da xoa phong chieu!');
    }
  };

  // 5. Customer promotions
  const handleToggleCustomerTier = (id) => {
    const updated = customers.map(c => {
      if (c.id === id) {
        const newTier = c.tier === 'VIP' ? 'Standard' : 'VIP';
        return { ...c, tier: newTier, points: newTier === 'VIP' ? Math.max(c.points, 500) : c.points };
      }
      return c;
    });
    updateCustomersState(updated);
    triggerToast('Cap nhat hang thanh vien thanh cong!');
  };

  // 6. Payroll calculations
  const handlePayrollApprove = () => {
    triggerToast('Duyet chi luong thang nay thanh cong! Hoa don ke toan da duoc ket xuat.');
  };

  const handleAdjustWage = (id, newWage) => {
    const updated = employees.map(emp => emp.id === id ? { ...emp, hourlyWage: parseInt(newWage) || 25000 } : emp);
    updateEmployeesState(updated);
  };

  const handleAdjustMultiplier = (id, newMultiplier) => {
    const updated = employees.map(emp => emp.id === id ? { ...emp, activeMultiplier: parseFloat(newMultiplier) || 1.0 } : emp);
    updateEmployeesState(updated);
  };

  // Calculations for analytics overview
  const totalRevenueVal = useMemo(() => {
    const ticketSum = tickets.reduce((acc, t) => acc + t.totalAmount, 0);
    const concessionSum = concessions.reduce((acc, c) => acc + (c.price * c.salesCount), 0);
    return ticketSum + concessionSum;
  }, [tickets, concessions]);

  const totalTicketsVal = useMemo(() => {
    return tickets.length;
  }, [tickets]);

  // Filters computed using useMemo
  const filteredMovies = useMemo(() => {
    return movies.filter(m => m.title.toLowerCase().includes(movieSearch.toLowerCase()));
  }, [movies, movieSearch]);
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => 
      t.id.toLowerCase().includes(ticketSearch.toLowerCase()) || 
      t.customerName.toLowerCase().includes(ticketSearch.toLowerCase())
    );
  }, [tickets, ticketSearch]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  const selectedTheater = useMemo(() => {
    return theaters.find(t => t.id === selectedTheaterId) || theaters[0];
  }, [theaters, selectedTheaterId]);

  const handleLogout = () => {
    logout();
    onBackHome();
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col lg:flex-row relative">
      {/* Toast Notification Element */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 py-3.5 px-6 rounded-xl shadow-2xl flex items-center gap-2 border font-bold text-sm text-white animate-bounce ${
          toastType === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500'
        }`}>
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar System Navigation Panel */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        user={user}
        onBackHome={onBackHome}
        handleLogout={handleLogout}
      />

      {/* Main Content Space */}
      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto lg:max-h-screen">
        {activeTab !== 'events-promo' && activeTab !== 'actors' && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide uppercase">
                {activeTab === 'dashboard' && 'TỔNG QUAN HỆ THỐNG'}
                {activeTab === 'movies' && 'DANH SÁCH PHIM'}
                {activeTab === 'actors' && 'QUẢN LÝ DIỄN VIÊN'}
                {activeTab === 'showtimes' && 'QUẢN LÝ LỊCH CHIẾU'}
                {activeTab === 'clusters' && 'CỤM RẠP & PHÒNG CHIẾU'}
                {activeTab === 'tickets' && 'LỊCH SỬ VÉ BÁN'}
                {activeTab === 'concessions' && 'KHO BẮP NƯỚC'}
                {activeTab === 'customers' && 'DANH SÁCH THÀNH VIÊN'}
                {activeTab === 'payroll' && 'BẢNG LƯƠNG NHÂN VIÊN'}
                {activeTab === 'delays' && 'CẤU HÌNH TRỄ LỊCH CHIẾU'}
                {activeTab === 'pricing' && 'HỆ SỐ PHỤ THU GIÁ VÉ'}
              </h1>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">
                Báo cáo hiệu suất và công cụ cấu hình hệ thống LoraFilm
              </p>
            </div>
            <div className="text-right text-xs text-zinc-400">
              Hệ thống trực tuyến: <span className="text-emerald-500 font-black">ONLINE</span>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            {/* Operational Snapshots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                  <CircleDollarSign className="w-8 h-8 text-brand-coral" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
                    Doanh thu tong hop
                  </span>
                  <span className="text-2xl font-black text-white block mb-0.5">{totalRevenueVal.toLocaleString('vi-VN')}đ</span>
                  <span className="text-[10px] text-zinc-400 block font-semibold">+12.5% so voi hom qua</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                  <Ticket className="w-8 h-8 text-brand-yellow" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
                    Ve ban tai quay
                  </span>
                  <span className="text-2xl font-black text-white block mb-0.5">{totalTicketsVal} ve</span>
                  <span className="text-[10px] text-zinc-400 block font-semibold">{theaters.reduce((acc, t) => acc + t.halls.length, 0)} phong chieu dang hoat dong</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 shadow-lg">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                  <Percent className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">
                    Ty le lap day phong
                  </span>
                  <span className="text-2xl font-black text-white block mb-0.5">84.2%</span>
                  <span className="text-[10px] text-zinc-400 block font-semibold">+4.8% trong khung gio vang</span>
                </div>
              </div>
            </div>

            {/* Central Display Panels for Dashboard Overview */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative min-h-[400px]">
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>Giao dịch vé gần đây</span>
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950 text-zinc-500 text-xs font-black uppercase tracking-wider border-b border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Ma ve</th>
                        <th className="py-3 px-4">Khach hang</th>
                        <th className="py-3 px-4">Phim</th>
                        <th className="py-3 px-4">Suat chieu</th>
                        <th className="py-3 px-4">Ghe</th>
                        <th className="py-3 px-4">Tong tien</th>
                        <th className="py-3 px-4">Trang thai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {tickets.map(t => (
                        <tr key={t.id}>
                          <td className="py-3.5 px-4 font-mono text-brand-yellow font-bold">{t.id}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{t.customerName}</td>
                          <td className="py-3.5 px-4">{t.movieTitle}</td>
                          <td className="py-3.5 px-4 font-semibold text-brand-coral">{t.time} | {t.date}</td>
                          <td className="py-3.5 px-4">{t.seats.join(', ')}</td>
                          <td className="py-3.5 px-4 text-emerald-400 font-extrabold">{t.totalAmount.toLocaleString('vi-VN')}đ</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                              t.status === 'DA_KIEM_TRA' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                            }`}>
                              {t.status === 'DA_KIEM_TRA' ? 'Da kiem tra' : 'Chua check-in'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab !== 'dashboard' && activeTab !== 'events-promo' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative min-h-[400px]">

          {/* Movies list CRUD view */}
          {activeTab === 'movies' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={movieSearch}
                    onChange={(e) => setMovieSearch(e.target.value)}
                    placeholder="Tim kiem phim..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-brand-coral transition-colors"
                  />
                </div>
                <button
                  onClick={handleOpenAddMovie}
                  className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-95 text-white text-xs font-black py-2.5 px-4 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>THÊM PHIM MỚI</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 text-xs font-black uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Tên phim</th>
                      <th className="py-3 px-4">Do dai</th>
                      <th className="py-3 px-4">Giới hạn tuổi</th>
                      <th className="py-3 px-4">Nam phat hanh</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredMovies.map((movie) => (
                      <tr key={movie.id}>
                        <td className="py-3.5 px-4 font-bold text-white">{movie.title}</td>
                        <td className="py-3.5 px-4">{movie.duration}</td>
                        <td className="py-3.5 px-4 font-bold text-zinc-200">{movie.ageRating}</td>
                        <td className="py-3.5 px-4">{movie.releaseYear}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                            movie.status === 'NOW_SHOWING' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {movie.status === 'NOW_SHOWING' ? 'Đang chiếu' : 'Sắp chiếu'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditMovie(movie)}
                              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/40 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actor CRUD View */}
          {activeTab === 'actors' && (
            <AdminActorView />
          )}

          {/* Showtimes configuration tab */}
          {activeTab === 'showtimes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Quan ly lich chieu</h3>
                <button
                  onClick={handleOpenAddShowtime}
                  className="flex items-center gap-2 bg-brand-coral hover:bg-opacity-95 text-white text-xs font-black py-2.5 px-4 rounded-xl"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>THÊM SUẤT CHIẾU</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {showtimes.map((st) => {
                  const movie = movies.find(m => m.id === st.movieId);
                  const theater = theaters.find(t => t.id === st.theaterId);
                  const hall = theater?.halls.find(h => h.id === st.hallId);
                  
                  return (
                    <div key={st.id} className="bg-zinc-950/80 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-brand-yellow font-black uppercase tracking-wider block">
                          {hall?.format} | {theater?.name} - {hall?.name}
                        </span>
                        <h4 className="font-bold text-white text-base mt-1">{movie?.title || 'Unknown Film'}</h4>
                        <p className="text-zinc-500 text-xs font-semibold mt-0.5">
                          Khung gio: <span className="text-brand-coral font-bold">{st.time}</span> | Ngay: {st.date} | Gia: {st.price.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteShowtime(st.id)}
                        className="p-2.5 text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/40 rounded-xl shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Master Detail clusters view */}
          {activeTab === 'clusters' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Master: Theater List */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
                    <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block">Danh sach cum rap</span>
                    <button
                      onClick={handleOpenAddTheater}
                      className="flex items-center gap-1.5 bg-brand-coral hover:bg-opacity-95 text-white text-[10px] font-black py-1.5 px-3 rounded-lg uppercase tracking-wider transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Thêm Rạp Mới</span>
                    </button>
                  </div>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {theaters.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTheaterId(t.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedTheaterId === t.id 
                            ? 'bg-brand-coral/10 border-brand-coral text-white' 
                            : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:bg-zinc-900/50'
                        }`}
                      >
                        <h4 className="font-bold text-sm block">{t.name}</h4>
                        <p className="text-[11px] text-zinc-500 truncate mt-1">{t.address}</p>
                      </button>
                    ))}
                    {theaters.length === 0 && (
                      <div className="text-center py-8 text-zinc-600 text-xs font-semibold">Chưa có cụm rạp nào</div>
                    )}
                  </div>
                </div>

                {/* Detail: Halls list */}
                <div className="lg:col-span-2 bg-zinc-950/50 border border-zinc-850 p-6 rounded-2xl space-y-6">
                  {selectedTheater ? (
                    <>
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
                        <div>
                          <h3 className="font-bold text-white text-base">{selectedTheater.name}</h3>
                          <p className="text-zinc-500 text-xs mt-0.5">{selectedTheater.address}</p>
                        </div>
                        <button
                          onClick={() => handleOpenAddHall(selectedTheater.id)}
                          className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-black px-3.5 py-2 rounded-lg text-white transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-brand-coral" />
                          <span>THÊM PHÒNG CHIẾU</span>
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                        {selectedTheater.halls && selectedTheater.halls.map(h => (
                          <div key={h.id} className="bg-zinc-900/40 border border-zinc-855 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-800 transition-colors">
                            <div>
                              <h4 className="font-bold text-white text-sm">{h.name}</h4>
                              <span className="text-[10px] text-zinc-500 block uppercase font-bold mt-1">
                                Dinh dang: {h.format} | Suc chua: {h.capacity} ghe
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRenameHall(selectedTheater.id, h.id)}
                                className="py-1.5 px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-[10px] font-bold text-zinc-400 rounded transition-colors"
                              >
                                Doi ten
                              </button>
                              <button
                                onClick={() => handleDeleteHall(selectedTheater.id, h.id)}
                                className="py-1.5 px-3 bg-red-950/20 border border-red-900/30 hover:border-red-900/60 hover:bg-red-950/40 text-[10px] font-bold text-red-400 rounded transition-colors"
                              >
                                Xoa
                              </button>
                            </div>
                          </div>
                        ))}
                        {(!selectedTheater.halls || selectedTheater.halls.length === 0) && (
                          <div className="text-center py-12 text-zinc-600 text-xs font-semibold">Chưa có phòng chiếu nào</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-24 text-zinc-650 text-xs font-bold uppercase tracking-wider">
                      Vui lòng chọn một cụm rạp để xem chi tiết
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tickets list */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="relative w-full md:w-80 mb-4">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  placeholder="Tim kiem theo ma hoac khach hang..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-brand-coral transition-colors"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 text-xs font-black uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Ma ve</th>
                      <th className="py-3 px-4">Khach hang</th>
                      <th className="py-3 px-4">Phim</th>
                      <th className="py-3 px-4">Suat chieu</th>
                      <th className="py-3 px-4">Ghe</th>
                      <th className="py-3 px-4">Tong tien</th>
                      <th className="py-3 px-4">Trang thai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredTickets.map(t => (
                      <tr key={t.id}>
                        <td className="py-3.5 px-4 font-mono text-brand-yellow font-bold">{t.id}</td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          <div>{t.customerName}</div>
                          <div className="text-[10px] text-zinc-500">{t.customerEmail}</div>
                        </td>
                        <td className="py-3.5 px-4">{t.movieTitle}</td>
                        <td className="py-3.5 px-4 font-semibold text-brand-coral">{t.time} | {t.date}</td>
                        <td className="py-3.5 px-4">{t.seats.join(', ')}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-extrabold">{t.totalAmount.toLocaleString('vi-VN')}đ</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                            t.status === 'DA_KIEM_TRA' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                          }`}>
                            {t.status === 'DA_KIEM_TRA' ? 'Da kiem tra' : 'Chua check-in'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Concessions tracking */}
          {activeTab === 'concessions' && (
            <div className="space-y-6">
              <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block">Báo cáo doanh thu bắp nước</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {concessions.map(c => (
                  <div key={c.id} className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{c.name}</h4>
                      <p className="text-[11px] text-zinc-500 mt-1">{c.details}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-zinc-850/60 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold">Da ban</span>
                        <span className="text-sm font-black text-brand-yellow">{c.salesCount} phan</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 uppercase block font-bold">Doanh thu</span>
                        <span className="text-sm font-black text-emerald-400">{(c.price * c.salesCount).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-850 text-right">
                <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block mb-1">Tong doanh thu bap nuoc</span>
                <span className="text-2xl font-black text-brand-coral">
                  {concessions.reduce((acc, c) => acc + (c.price * c.salesCount), 0).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          )}

          {/* Customers management */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="relative w-full md:w-80 mb-4">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Tim khach hang..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-brand-coral transition-colors"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 text-xs font-black uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Ten khach hang</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Hang thanh vien</th>
                      <th className="py-3 px-4">Diem tich luy</th>
                      <th className="py-3 px-4">So ve da mua</th>
                      <th className="py-3 px-4">Hanh dong</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredCustomers.map(c => (
                      <tr key={c.id}>
                        <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300">{c.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase border ${
                            c.tier === 'VIP' 
                              ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                          }`}>
                            {c.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-zinc-200">{c.points} diem</td>
                        <td className="py-3.5 px-4">{c.ticketsBought} ve</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleCustomerTier(c.id)}
                            className="text-xs font-bold text-brand-coral hover:underline focus:outline-none"
                          >
                            {c.tier === 'VIP' ? 'Ha xuong Standard' : 'Thang len VIP'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payroll management view */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-black uppercase tracking-wider block">Bảng lương nhân sự tháng này</span>
                <button
                  onClick={handlePayrollApprove}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-4 rounded-xl uppercase tracking-wider"
                >
                  Duyệt chi lương
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 text-xs font-black uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Ten nhan vien</th>
                      <th className="py-3 px-4">Chuc vu</th>
                      <th className="py-3 px-4">Gio lam viec</th>
                      <th className="py-3 px-4">Luong gio (VND)</th>
                      <th className="py-3 px-4">He so nhan</th>
                      <th className="py-3 px-4">Luong thuc nhan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {employees.map(emp => {
                      const finalSalary = emp.hoursWorked * emp.hourlyWage * emp.activeMultiplier;
                      return (
                        <tr key={emp.id}>
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div>{emp.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{emp.email}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-zinc-200">{emp.role}</td>
                          <td className="py-3.5 px-4">{emp.hoursWorked} gio</td>
                          <td className="py-3.5 px-4">
                            <input
                              type="number"
                              value={emp.hourlyWage}
                              onChange={(e) => handleAdjustWage(emp.id, e.target.value)}
                              className="w-24 bg-zinc-950 border border-zinc-800 rounded py-1 px-2 text-xs text-white focus:outline-none focus:border-brand-coral"
                            />
                          </td>
                          <td className="py-3.5 px-4">
                            <input
                              type="number"
                              step="0.1"
                              value={emp.activeMultiplier}
                              onChange={(e) => handleAdjustMultiplier(emp.id, e.target.value)}
                              className="w-16 bg-zinc-950 border border-zinc-800 rounded py-1 px-2 text-xs text-white focus:outline-none focus:border-brand-coral"
                            />
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-extrabold">{finalSalary.toLocaleString('vi-VN')}đ</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Operational configuration tabs */}
          {activeTab === 'delays' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-4">Cấu hình ngưỡng trễ lịch chiếu</h3>
              <div className="max-w-md bg-zinc-950 p-6 rounded-2xl border border-zinc-850 space-y-4">
                <div className="space-y-1">
                  <label className="text-zinc-500 text-xs font-black uppercase">Thoi gian tre toi da cho phep (phut)</label>
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-coral"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500 text-xs font-black uppercase">Tu dong dong suat chieu sau thoi gian tre</label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-coral">
                    <option value="yes">Kich hoat</option>
                    <option value="no">Vo hieu hoa</option>
                  </select>
                </div>
                <button
                  onClick={() => triggerToast('Da luu cau hinh tre lich chieu!')}
                  className="bg-brand-coral hover:bg-opacity-95 text-white font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider"
                >
                  Luu cau hinh
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white mb-4">Hệ số phụ thu giá vé</h3>
              <div className="max-w-md bg-zinc-950 p-6 rounded-2xl border border-zinc-850 space-y-4">
                <div className="space-y-1">
                  <label className="text-zinc-500 text-xs font-black uppercase">Phu thu suat chieu IMAX (VND)</label>
                  <input
                    type="number"
                    defaultValue={50000}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-coral"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-500 text-xs font-black uppercase">He so gia ve dip cuoi tuan (T6-CN)</label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue={1.2}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-coral"
                  />
                </div>
                <button
                  onClick={() => triggerToast('Da luu he so phu thu gia ve!')}
                  className="bg-brand-coral hover:bg-opacity-95 text-white font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider"
                >
                  Luu cau hinh
                </button>
              </div>
            </div>
          )}

        </div>
        )}

        {activeTab === 'events-promo' && (
          <AdminEventView />
        )}
      </main>

      {/* Movie add/edit modal form */}
      {movieModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveMovie} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                {editingMovie ? 'Cap nhat phim' : 'Them phim moi'}
              </h3>
              <button type="button" onClick={() => setMovieModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Ten phim</label>
              <input
                type="text"
                value={movieForm.title}
                onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Do dai</label>
                <input
                  type="text"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Nam phat hanh</label>
                <input
                  type="number"
                  value={movieForm.releaseYear}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseYear: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Gioi han tuoi</label>
                <select
                  value={movieForm.ageRating}
                  onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                >
                  <option value="P">P</option>
                  <option value="T13">T13</option>
                  <option value="T16">T16</option>
                  <option value="T18">T18</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Trang thai</label>
                <select
                  value={movieForm.status}
                  onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                >
                  <option value="NOW_SHOWING">NOW SHOWING</option>
                  <option value="COMING_SOON">COMING SOON</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">The loai (Phan cach bang dau phay)</label>
              <input
                type="text"
                value={movieForm.genres}
                onChange={(e) => setMovieForm({ ...movieForm, genres: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Tom tat phim</label>
              <textarea
                value={movieForm.synopsis}
                onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white h-20 focus:outline-none focus:border-brand-coral"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-95 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider pt-2"
            >
              Luu thong tin
            </button>
          </form>
        </div>
      )}



      {/* Showtime add modal form */}
      {showtimeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveShowtime} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Thêm suat chieu moi</h3>
              <button type="button" onClick={() => setShowtimeModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showtimeError && (
              <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-200 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{showtimeError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Chon Phim</label>
              <select
                value={showtimeForm.movieId}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              >
                {movies.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Cum Rap</label>
                <select
                  value={showtimeForm.theaterId}
                  onChange={(e) => {
                    const tId = parseInt(e.target.value);
                    const matchedT = theaters.find(t => t.id === tId);
                    setShowtimeForm({ 
                      ...showtimeForm, 
                      theaterId: e.target.value,
                      hallId: matchedT?.halls[0]?.id || ''
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                >
                  {theaters.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Phong Chieu</label>
                <select
                  value={showtimeForm.hallId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, hallId: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                >
                  {theaters.find(t => t.id.toString() === showtimeForm.theaterId.toString())?.halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Ngay chieu</label>
                <input
                  type="date"
                  value={showtimeForm.date}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-xs font-bold uppercase block">Gio chieu</label>
                <input
                  type="text"
                  value={showtimeForm.time}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Gia ve niem yet (VND)</label>
              <input
                type="number"
                value={showtimeForm.price}
                onChange={(e) => setShowtimeForm({ ...showtimeForm, price: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-95 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
            >
              Luu thong tin
            </button>
          </form>
        </div>
      )}

      {/* Theater add modal form */}
      {theaterModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveTheater} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Thêm cụm rạp mới</h3>
              <button type="button" onClick={() => setTheaterModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Tên cụm rạp</label>
              <input
                type="text"
                value={theaterForm.name}
                onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                placeholder="VD: Lora Nguyễn Trãi"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Địa chỉ</label>
              <input
                type="text"
                value={theaterForm.address}
                onChange={(e) => setTheaterForm({ ...theaterForm, address: e.target.value })}
                placeholder="VD: 235 Nguyễn Văn Cừ, Quận 5, TP. HCM"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Số lượng phòng chiếu mặc định</label>
              <input
                type="number"
                min="1"
                max="10"
                value={theaterForm.defaultHallsCount}
                onChange={(e) => setTheaterForm({ ...theaterForm, defaultHallsCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-95 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
      )}

      {/* Hall add modal form */}
      {hallModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveHall} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Thêm phòng chiếu mới</h3>
              <button type="button" onClick={() => setHallModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Tên phòng chiếu</label>
              <input
                type="text"
                value={hallForm.name}
                onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                placeholder="VD: Phòng Chiếu 5"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Sức chứa (Ghế)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={hallForm.capacity}
                onChange={(e) => setHallForm({ ...hallForm, capacity: parseInt(e.target.value) || 120 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-bold uppercase block">Định dạng chiếu</label>
              <select
                value={hallForm.format}
                onChange={(e) => setHallForm({ ...hallForm, format: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-coral"
              >
                <option value="2D Digital">2D Digital</option>
                <option value="3D Digital">3D Digital</option>
                <option value="IMAX 3D">IMAX 3D</option>
                <option value="Gold Class">Gold Class</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-coral hover:bg-opacity-95 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider"
            >
              Lưu thông tin
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
