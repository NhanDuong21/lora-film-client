import { useState, useEffect } from 'react';
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
import AdminDashboardView from './AdminDashboardView';

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
            <AdminDashboardView 
              tickets={tickets}
              movies={movies}
              triggerToast={triggerToast}
            />
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
