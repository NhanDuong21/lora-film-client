import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Calendar, 
  Gift, 
  Database, 
  Ticket, 
  Coffee, 
  Settings, 
  Clock, 
  TrendingUp, 
  LogOut, 
  Home, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import AdminMovieView from './AdminMovieView';
import AdminActorView from './AdminActorView';
import AdminShowtimeView from './AdminShowtimeView';
import AdminEventView from './AdminEventView';
import AdminCinemaView from './AdminCinemaView';
import AdminFinanceView from './AdminFinanceView';

import { 
  INITIAL_MOVIES, 
  INITIAL_ACTORS, 
  INITIAL_THEATERS, 
  INITIAL_SHOWTIMES, 
  INITIAL_TICKETS, 
  INITIAL_CONCESSIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_EMPLOYEES 
} from '../../data/mockDashboardData';

export default function AdminLayout({ initialTab = 'dashboard', onBackHome }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Collapsible categories state (default all open)
  const [collapsedCategories, setCollapsedCategories] = useState({
    noiDung: false,
    coSo: false,
    vanHanh: false,
    nhanSu: false,
    cauHinh: false
  });

  // Master local storage states
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('lora_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [actors, setActors] = useState(() => {
    const saved = localStorage.getItem('lora_actors');
    return saved ? JSON.parse(saved) : INITIAL_ACTORS;
  });

  const [theaters, setTheaters] = useState(() => {
    const saved = localStorage.getItem('lora_theaters');
    return saved ? JSON.parse(saved) : INITIAL_THEATERS;
  });

  const [showtimes, setShowtimes] = useState(() => {
    const saved = localStorage.getItem('lora_showtimes');
    return saved ? JSON.parse(saved) : INITIAL_SHOWTIMES;
  });

  const [tickets] = useState(() => {
    const saved = localStorage.getItem('lora_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [concessions] = useState(() => {
    const saved = localStorage.getItem('lora_concessions');
    return saved ? JSON.parse(saved) : INITIAL_CONCESSIONS;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('lora_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('lora_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('lora_admin_events');
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('lora_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('lora_actors', JSON.stringify(actors));
  }, [actors]);

  useEffect(() => {
    localStorage.setItem('lora_theaters', JSON.stringify(theaters));
  }, [theaters]);

  useEffect(() => {
    localStorage.setItem('lora_showtimes', JSON.stringify(showtimes));
  }, [showtimes]);

  useEffect(() => {
    localStorage.setItem('lora_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('lora_concessions', JSON.stringify(concessions));
  }, [concessions]);

  useEffect(() => {
    localStorage.setItem('lora_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('lora_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('lora_admin_events', JSON.stringify(events));
  }, [events]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') setActiveTab('dashboard');
      else if (hash === '#/admin/movies') setActiveTab('movies');
      else if (hash === '#/admin/actors') setActiveTab('actors');
      else if (hash === '#/admin/showtimes') setActiveTab('showtimes');
      else if (hash === '#/admin/events') setActiveTab('events-promo');
      else if (hash === '#/admin/clusters') setActiveTab('clusters');
      else if (hash === '#/admin/tickets') setActiveTab('tickets');
      else if (hash === '#/admin/concessions') setActiveTab('concessions');
      else if (hash === '#/admin/customers') setActiveTab('customers');
      else if (hash === '#/admin/payroll') setActiveTab('payroll');
      else if (hash === '#/admin/delays') setActiveTab('delays');
      else if (hash === '#/admin/pricing') setActiveTab('pricing');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') window.location.hash = '#/admin';
    else if (tab === 'movies') window.location.hash = '#/admin/movies';
    else if (tab === 'actors') window.location.hash = '#/admin/actors';
    else if (tab === 'showtimes') window.location.hash = '#/admin/showtimes';
    else if (tab === 'events-promo') window.location.hash = '#/admin/events';
    else if (tab === 'clusters') window.location.hash = '#/admin/clusters';
    else if (tab === 'tickets') window.location.hash = '#/admin/tickets';
    else if (tab === 'concessions') window.location.hash = '#/admin/concessions';
    else if (tab === 'customers') window.location.hash = '#/admin/customers';
    else if (tab === 'payroll') window.location.hash = '#/admin/payroll';
    else if (tab === 'delays') window.location.hash = '#/admin/delays';
    else if (tab === 'pricing') window.location.hash = '#/admin/pricing';
  };

  // Toast System
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const toggleCategoryCollapse = (cat) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  // Dashboard Stats calculations
  const dashboardStats = useMemo(() => {
    const todayRevenue = tickets
      .filter(t => t.date === '2026-05-29')
      .reduce((sum, t) => sum + t.totalAmount, 0) || 2840000;

    const ticketsSold = tickets.length || 42;
    const occupancyRate = 65; // %
    const technicalIssues = 0;

    return {
      todayRevenue,
      ticketsSold,
      occupancyRate,
      technicalIssues
    };
  }, [tickets]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans relative">
      
      {/* Toast Notification Container */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 shadow-2xl animate-slide-in">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-xs font-bold text-zinc-150">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static shrink-0`}>
        
        {/* Logo Branding */}
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-coral flex items-center justify-center font-black text-white text-base shadow-lg shadow-brand-coral/20">
              L
            </div>
            <div>
              <span className="text-sm font-black text-zinc-100 uppercase tracking-widest block">LoraFilm</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hệ Thống Quản Trị</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-zinc-500 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Categories */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Category 1: Dashboard */}
          <div>
            <button
              onClick={() => navigateToTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
                activeTab === 'dashboard'
                  ? 'bg-brand-coral text-white shadow-lg shadow-brand-coral/10'
                  : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>➊ DASHBOARD (TỔNG QUAN)</span>
            </button>
          </div>

          {/* Category 2: Content Management */}
          <div className="space-y-1">
            <button
              onClick={() => toggleCategoryCollapse('noiDung')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➋ QUẢN LÝ NỘI DUNG</span>
              {collapsedCategories.noiDung ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedCategories.noiDung && (
              <div className="space-y-1 pl-2">
                <button
                  onClick={() => navigateToTab('movies')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'movies'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quản lý phim</span>
                </button>
                <button
                  onClick={() => navigateToTab('actors')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'actors'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quản lý diễn viên</span>
                </button>
                <button
                  onClick={() => navigateToTab('showtimes')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'showtimes'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quản lý suất chiếu</span>
                </button>
                <button
                  onClick={() => navigateToTab('events-promo')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'events-promo'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quản lý sự kiện & khuyến mãi</span>
                </button>
              </div>
            )}
          </div>

          {/* Category 3: Base Management */}
          <div className="space-y-1">
            <button
              onClick={() => toggleCategoryCollapse('coSo')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➌ QUẢN LÝ CƠ SỞ</span>
              {collapsedCategories.coSo ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedCategories.coSo && (
              <div className="space-y-1 pl-2">
                <button
                  onClick={() => navigateToTab('clusters')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'clusters'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Cụm rạp & Phòng chiếu</span>
                </button>
              </div>
            )}
          </div>

          {/* Category 4: Business Operations */}
          <div className="space-y-1">
            <button
              onClick={() => toggleCategoryCollapse('vanHanh')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➍ VẬN HÀNH KINH DOANH</span>
              {collapsedCategories.vanHanh ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedCategories.vanHanh && (
              <div className="space-y-1 pl-2">
                <button
                  onClick={() => navigateToTab('tickets')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Quản lý vé bán</span>
                </button>
                <button
                  onClick={() => navigateToTab('concessions')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'concessions'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Doanh thu bắp nước</span>
                </button>
              </div>
            )}
          </div>

          {/* Category 5: Staff & Customers */}
          <div className="space-y-1">
            <button
              onClick={() => toggleCategoryCollapse('nhanSu')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➎ NHÂN SỰ & KHÁCH HÀNG</span>
              {collapsedCategories.nhanSu ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedCategories.nhanSu && (
              <div className="space-y-1 pl-2">
                <button
                  onClick={() => navigateToTab('customers')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'customers'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Danh sách khách hàng</span>
                </button>
                <button
                  onClick={() => navigateToTab('payroll')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'payroll'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Bảng lương nhân viên</span>
                </button>
              </div>
            )}
          </div>

          {/* Category 6: Configuration & Security */}
          <div className="space-y-1">
            <button
              onClick={() => toggleCategoryCollapse('cauHinh')}
              className="w-full flex items-center justify-between text-[11px] font-black uppercase text-zinc-500 px-4 py-2 hover:text-zinc-300"
            >
              <span>➏ CẤU HÌNH & BẢO MẬT</span>
              {collapsedCategories.cauHinh ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {!collapsedCategories.cauHinh && (
              <div className="space-y-1 pl-2">
                <button
                  onClick={() => navigateToTab('delays')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'delays'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Ngưỡng trễ lịch chiếu</span>
                </button>
                <button
                  onClick={() => navigateToTab('pricing')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'pricing'
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900/20 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Hệ số giá vé</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Base Profile Card */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/80">
          <div className="bg-zinc-900/40 border border-zinc-900 p-4.5 rounded-2xl flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                AD
              </div>
              <div className="truncate">
                <span className="text-[11px] text-zinc-450 font-bold block">Quản Trị Viên</span>
                <span className="text-xs text-zinc-100 font-black block truncate">Người dùng: Quản trị viên Lora</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-900 pt-3">
              <button 
                onClick={onBackHome}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-brand-coral transition-colors"
                title="Quay lại trang chủ khách hàng"
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </button>
              <button 
                onClick={() => {
                  if (confirm('Đăng xuất khỏi tài khoản admin?')) {
                    onBackHome();
                  }
                }}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

      </aside>

      {/* Main View Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top control bar (dense) */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black uppercase text-zinc-100 tracking-wider">
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'movies' && 'Quản Lý Danh Sách Phim'}
              {activeTab === 'actors' && 'Quản Lý Diễn Viên Điện Ảnh'}
              {activeTab === 'showtimes' && 'Quản Lý Lịch Chiếu Phim'}
              {activeTab === 'events-promo' && 'Quản Lý Sự Kiện & Ưu Đãi'}
              {activeTab === 'clusters' && 'Hạ Tầng Cụm Rạp & Phòng Chiếu'}
              {['tickets', 'concessions', 'customers', 'payroll', 'delays', 'pricing'].includes(activeTab) && 'Kế Toán & Vận Hành Kinh Doanh'}
            </h1>
          </div>
          <div className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest bg-zinc-900/40 px-3 py-1.5 rounded-full border border-zinc-900">
            HỆ THỐNG AN NINH LORAFILM
          </div>
        </header>

        {/* Dynamic Inner Panel View Router Scope */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Four Upper Metric Analytical Counters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. Doanh thu hôm nay (emerald theme) */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      Doanh thu hôm nay
                    </span>
                    <span className="text-2xl font-black text-emerald-400">
                      {dashboardStats.todayRevenue.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                {/* 2. Vé đã bán (amber theme) */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      Vé đã bán
                    </span>
                    <span className="text-2xl font-black text-amber-500">
                      {dashboardStats.ticketsSold} vé
                    </span>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Ticket className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                {/* 3. Tỷ lệ lấp đầy (indigo theme) */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      Tỷ lệ lấp đầy
                    </span>
                    <span className="text-2xl font-black text-indigo-400">
                      {dashboardStats.occupancyRate}%
                    </span>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <LayoutDashboard className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>

                {/* 4. Sự cố kỹ thuật (warning red theme) */}
                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                  <div>
                    <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      Sự cố kỹ thuật
                    </span>
                    <span className="text-2xl font-black text-red-500">
                      {dashboardStats.technicalIssues}
                    </span>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                </div>

              </div>

              {/* Recent ticket transaction data sheet */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Giao dịch vé gần đây
                  </h3>
                  <button 
                    onClick={() => navigateToTab('tickets')}
                    className="text-[11px] font-black text-brand-coral hover:underline"
                  >
                    Xem tất cả vé bán →
                  </button>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-400">
                      <thead className="bg-zinc-950/80 text-zinc-500 font-black uppercase tracking-wider border-b border-zinc-900">
                        <tr>
                          <th className="py-4 px-6">Mã vé</th>
                          <th className="py-4 px-6">Khách hàng</th>
                          <th className="py-4 px-6">Phim</th>
                          <th className="py-4 px-6">Suất chiếu</th>
                          <th className="py-4 px-6">Ghế</th>
                          <th className="py-4 px-6">Tổng tiền</th>
                          <th className="py-4 px-6 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {tickets.map(t => (
                          <tr key={t.id} className="hover:bg-zinc-900/20 transition-colors">
                            <td className="py-4 px-6 font-mono text-brand-yellow font-bold">{t.id}</td>
                            <td className="py-4 px-6 font-bold text-zinc-100">
                              <div>{t.customerName}</div>
                              <div className="text-[10px] text-zinc-500 font-normal mt-0.5">{t.customerEmail}</div>
                            </td>
                            <td className="py-4 px-6 text-zinc-300 font-medium">{t.movieTitle}</td>
                            <td className="py-4 px-6 text-zinc-300 font-semibold">{t.time} | {t.date}</td>
                            <td className="py-4 px-6 text-zinc-300 font-medium">{t.seats.join(', ')}</td>
                            <td className="py-4 px-6 text-emerald-400 font-black text-sm">{t.totalAmount.toLocaleString('vi-VN')}đ</td>
                            <td className="py-4 px-6 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                                t.status === 'DA_KIEM_TRA' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-zinc-850 text-zinc-400 border-zinc-700/50'
                              }`}>
                                {t.status === 'DA_KIEM_TRA' ? 'ĐÃ KIỂM TRA' : 'CHƯA CHECK-IN'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: MOVIES */}
          {activeTab === 'movies' && (
            <AdminMovieView 
              movies={movies} 
              updateMoviesState={setMovies} 
              triggerToast={triggerToast} 
            />
          )}

          {/* TAB: ACTORS */}
          {activeTab === 'actors' && (
            <AdminActorView 
              actors={actors} 
              updateActorsState={setActors} 
              triggerToast={triggerToast} 
            />
          )}

          {/* TAB: SHOWTIMES */}
          {activeTab === 'showtimes' && (
            <AdminShowtimeView 
              showtimes={showtimes} 
              movies={movies} 
              theaters={theaters} 
              updateShowtimesState={setShowtimes} 
              triggerToast={triggerToast} 
            />
          )}

          {/* TAB: EVENTS & PROMOS */}
          {activeTab === 'events-promo' && (
            <AdminEventView 
              events={events} 
              updateEventsState={setEvents} 
              triggerToast={triggerToast} 
            />
          )}

          {/* TAB: CLUSTERS & HALLS */}
          {activeTab === 'clusters' && (
            <AdminCinemaView 
              theaters={theaters} 
              updateTheatersState={setTheaters} 
              triggerToast={triggerToast} 
            />
          )}

          {/* TAB: OPERATIONS / FINANCE VIEW MODULES */}
          {['tickets', 'concessions', 'customers', 'payroll', 'delays', 'pricing'].includes(activeTab) && (
            <AdminFinanceView 
              activeTab={activeTab} 
              tickets={tickets} 
              concessions={concessions} 
              customers={customers} 
              employees={employees} 
              updateCustomersState={setCustomers} 
              updateEmployeesState={setEmployees} 
              triggerToast={triggerToast} 
            />
          )}

        </main>
      </div>

    </div>
  );
}
