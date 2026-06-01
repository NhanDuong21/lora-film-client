import { useState, useEffect, useMemo } from 'react';
import { 
  Menu,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
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
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/admin') return 'dashboard';
    if (hash === '#/admin/movies') return 'movies';
    if (hash === '#/admin/actors') return 'actors';
    if (hash === '#/admin/showtimes') return 'showtimes';
    if (hash === '#/admin/events') return 'events-promo';
    if (hash === '#/admin/clusters') return 'clusters';
    if (hash === '#/admin/tickets') return 'tickets';
    if (hash === '#/admin/concessions') return 'concessions';
    if (hash === '#/admin/customers') return 'customers';
    if (hash === '#/admin/payroll') return 'payroll';
    if (hash === '#/admin/delays') return 'delays';
    if (hash === '#/admin/pricing') return 'pricing';
    return initialTab;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Save changes
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

  const handleLogout = () => {
    logout();
    localStorage.removeItem('lora_session');
    sessionStorage.clear();
    window.location.hash = '#/';
    onBackHome();
  };

  // Toast System
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const todayRevenue = tickets
      .filter(t => t.date === '2026-05-29')
      .reduce((sum, t) => sum + t.totalAmount, 0) || 2840000;
    const ticketsCount = tickets.length || 42;
    return {
      todayRevenue,
      ticketsCount,
      occupancy: 65,
      issues: 0
    };
  }, [tickets]);

  return (
    <div className="w-full h-screen overflow-hidden bg-zinc-950 flex font-sans relative">
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-5 shadow-2xl animate-slide-in">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-xs font-bold text-zinc-200">{toast.message}</span>
        </div>
      )}

      {/* Fixed Sidebar Column (Locked layout width w-64, stationary) */}
      <div className={`shrink-0 h-full fixed lg:static z-30 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false); // Close on mobile navigation
          }} 
          user={user} 
          onBackHome={onBackHome} 
          handleLogout={handleLogout} 
        />
      </div>

      {/* Mobile Sidebar overlay backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
        />
      )}

      {/* Right Column Workspace (Fluid layout) */}
      <div className="flex-1 h-full flex flex-col overflow-hidden">
        
        {/* Sticky top Navigation Bar */}
        <header className="w-full h-16 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black uppercase text-zinc-50 tracking-wider">
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'movies' && 'DANH SÁCH BỘ PHIM'}
              {activeTab === 'actors' && 'DANH MỤC DIỄN VIÊN'}
              {activeTab === 'showtimes' && 'DANH SÁCH SUẤT CHIẾU'}
              {activeTab === 'events-promo' && 'CHƯƠNG TRÌNH ƯU ĐÃI'}
              {activeTab === 'clusters' && 'HỆ THỐNG CỤM RẠP'}
              {['tickets', 'concessions', 'customers', 'payroll', 'delays', 'pricing'].includes(activeTab) && 'LỊCH SỬ GIAO DỊCH'}
            </h1>
          </div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full">
            HỆ THỐNG AN NINH LORAFILM
          </div>
        </header>

        {/* Dynamic View Body Content (ONLY scrollable container region) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* High-density KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* 1. DOANH THU TỔNG HỢP (emerald theme) */}
                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300">
                  <div>
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      DOANH THU TỔNG HỢP
                    </span>
                    <span className="text-2xl font-bold text-zinc-50">
                      {stats.todayRevenue.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-emerald-400 text-[10px] font-bold">EMERALD</span>
                  </div>
                </div>

                {/* 2. VÉ BÁN TẠI QUẦY (amber theme) */}
                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300">
                  <div>
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      VÉ BÁN TẠI QUẦY
                    </span>
                    <span className="text-2xl font-bold text-zinc-50">
                      {stats.ticketsCount} vé
                    </span>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <span className="text-amber-400 text-[10px] font-bold">AMBER</span>
                  </div>
                </div>

                {/* 3. TỶ LỆ LẤP ĐẦY */}
                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300">
                  <div>
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      TỶ LỆ LẤP ĐẦY
                    </span>
                    <span className="text-2xl font-bold text-zinc-50">
                      {stats.occupancy}%
                    </span>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <span className="text-indigo-400 text-[10px] font-bold">INDIGO</span>
                  </div>
                </div>

                {/* 4. SỰ CỐ KỸ THUẬT */}
                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300">
                  <div>
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-wider block mb-1.5">
                      SỰ CỐ KỸ THUẬT
                    </span>
                    <span className="text-2xl font-bold text-red-500">
                      {stats.issues}
                    </span>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <span className="text-red-400 text-[10px] font-bold">WARNING</span>
                  </div>
                </div>

              </div>

              {/* Recent ticket transaction log table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    Giao dịch vé gần đây
                  </h3>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-xl shadow-black/40 hover:border-zinc-700/60 transition-all duration-300 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-400">
                      <thead className="bg-zinc-950/80 text-zinc-400 font-black uppercase tracking-wider border-b border-zinc-800">
                        <tr>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Mã vé</th>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Khách hàng</th>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Phim</th>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Suất chiếu</th>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Ghế</th>
                          <th className="py-4 px-6 border-r border-zinc-800/60">Tổng tiền</th>
                          <th className="py-4 px-6 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {tickets.map(t => (
                          <tr key={t.id} className="hover:bg-zinc-900/20 transition-colors border-b border-zinc-800/40">
                            <td className="py-4 px-6 font-mono text-zinc-200 font-bold border-r border-zinc-800/60">{t.id}</td>
                            <td className="py-4 px-6 font-bold text-zinc-250 border-r border-zinc-800/60">
                              <div className="text-zinc-200">{t.customerName}</div>
                              <div className="text-[10px] text-zinc-400 font-normal mt-0.5">{t.customerEmail}</div>
                            </td>
                            <td className="py-4 px-6 text-zinc-200 font-medium border-r border-zinc-800/60">{t.movieTitle}</td>
                            <td className="py-4 px-6 text-zinc-200 font-semibold border-r border-zinc-800/60">{t.time} | {t.date}</td>
                            <td className="py-4 px-6 text-zinc-200 font-medium border-r border-zinc-800/60">{t.seats.join(', ')}</td>
                            <td className="py-4 px-6 text-zinc-200 font-black text-sm border-r border-zinc-800/60">{t.totalAmount.toLocaleString('vi-VN')} đ</td>
                            <td className="py-4 px-6 text-center">
                              {t.status === 'DA_KIEM_TRA' ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                                  ĐÃ KIỂM TRA
                                </span>
                              ) : (
                                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700/50 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-block">
                                  CHƯA CHECK-IN
                                </span>
                              )}
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
