import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import PromoShowcase from './components/PromoShowcase';
import BookingSteps from './components/BookingSteps';
import Footer from './components/Footer';
import BrandOverview from './components/BrandOverview';
import MovieDetailView from './components/MovieDetailView';
import SeatSelectionView from './components/SeatSelectionView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import AdminDashboardView from './components/AdminDashboardView';
import EmployeeDashboardView from './components/EmployeeDashboardView';
import CustomerProfileView from './components/CustomerProfileView';
import MovieDiscoveryView from './components/MovieDiscoveryView';
import ActorRegistryView from './components/ActorRegistryView';
import DirectorRegistryView from './components/DirectorRegistryView';
import CinemaDetailView from './components/CinemaDetailView';
import EventRegistryView from './components/EventRegistryView';
import MasterBookingFunnel from './components/MasterBookingFunnel';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppInner() {
  const [currentView, setCurrentView] = useState({ name: 'home', data: null });
  const [pendingBooking, setPendingBooking] = useState(null);
  const [movieFilterTab, setMovieFilterTab] = useState('NOW_SHOWING');
  const { userRole, isAuthenticated } = useAuth();

  // Pure Client-Side URL Synchronization & History Listener Engine
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';

      if (hash === '#/' || hash === '#/home' || hash === '') {
        setCurrentView({ name: 'home', data: null });
      } else if (hash.startsWith('#/discovery')) {
        let initialTab = 'ALL';
        if (hash.includes('?tab=')) {
          initialTab = hash.split('?tab=')[1];
        }
        setCurrentView({ name: 'discovery', data: { initialTab } });
      } else if (hash === '#/actors') {
        setCurrentView({ name: 'actors', data: null });
      } else if (hash.startsWith('#/actor/')) {
        const actorName = decodeURIComponent(hash.substring(8));
        setCurrentView({ name: 'actor-detail', data: { actorName } });
      } else if (hash === '#/directors') {
        setCurrentView({ name: 'directors', data: null });
      } else if (hash.startsWith('#/director/')) {
        const directorName = decodeURIComponent(hash.substring(11));
        setCurrentView({ name: 'director-detail', data: { directorName } });
      } else if (hash.startsWith('#/cinema/')) {
        const cinemaId = parseInt(hash.substring(9)) || 1;
        setCurrentView({ name: 'cinema-detail', data: { cinemaId } });
      } else if (hash.startsWith('#/movie/')) {
        const movieId = parseInt(hash.substring(8)) || 1;
        setCurrentView({ name: 'detail', data: { movieId } });
      } else if (hash === '#/events') {
        setCurrentView({ name: 'events', data: null });
      } else if (hash.startsWith('#/event/')) {
        const eventId = parseInt(hash.substring(8)) || 1;
        setCurrentView({ name: 'event-detail', data: { eventId } });
      } else if (hash === '#/booking-funnel') {
        setCurrentView({ name: 'booking-funnel', data: null });
      } else if (hash === '#/profile') {
        setCurrentView({ name: 'profile', data: null });
      } else if (hash === '#/admin') {
        setCurrentView({ name: 'admin', data: null });
      } else if (hash === '#/admin-events' || hash === '#/admin/events') {
        setCurrentView({ name: 'admin-events', data: null });
      } else if (hash === '#/admin-movies' || hash === '#/admin/movies') {
        setCurrentView({ name: 'admin-movies', data: null });
      } else if (hash === '#/admin-actors' || hash === '#/admin/actors') {
        setCurrentView({ name: 'admin-actors', data: null });
      } else if (hash === '#/employee') {
        setCurrentView({ name: 'employee', data: null });
      } else if (hash === '#/login') {
        setCurrentView({ name: 'login', data: null });
      } else if (hash === '#/register') {
        setCurrentView({ name: 'register', data: null });
      } else if (hash === '#/seats') {
        if (!isAuthenticated) {
          window.location.hash = '#/login';
          return;
        }
        const stored = localStorage.getItem('lora_pending_booking');
        let bookingData = null;
        try {
          bookingData = stored ? JSON.parse(stored) : null;
        } catch (e) {
          console.error(e);
        }
        setCurrentView({ name: 'seats', data: bookingData });
      } else {
        // Fallback default
        setCurrentView({ name: 'home', data: null });
      }
    };

    // Initialize from current URL hash on mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  // Scroll to top on view changes
  const handleViewChange = (newView) => {
    if (newView.name === 'seats' && !isAuthenticated) {
      setPendingBooking({ bookingData: newView.data });
      localStorage.setItem('lora_pending_booking', JSON.stringify(newView.data));
      sessionStorage.setItem('lora_pending_booking', JSON.stringify(newView.data));
      sessionStorage.setItem('lora_booking_interrupted', 'true');
      window.location.hash = '#/login';
      return;
    }

    if (newView.name === 'login') {
      if (newView.data?.voluntary) {
        sessionStorage.removeItem('lora_booking_interrupted');
        sessionStorage.removeItem('lora_pending_booking');
        localStorage.removeItem('lora_pending_booking');
        setPendingBooking(null);
      }
    }

    // Set matching URL token in the address bar
    let targetHash;
    switch (newView.name) {
      case 'home':
        targetHash = '#/';
        break;
      case 'discovery':
        targetHash = newView.data?.initialTab ? `#/discovery?tab=${newView.data.initialTab}` : '#/discovery';
        break;
      case 'actors':
        targetHash = '#/actors';
        break;
      case 'actor-detail':
        targetHash = `#/actor/${encodeURIComponent(newView.data?.actorName || '')}`;
        break;
      case 'directors':
        targetHash = '#/directors';
        break;
      case 'director-detail':
        targetHash = `#/director/${encodeURIComponent(newView.data?.directorName || '')}`;
        break;
      case 'cinema-detail':
        targetHash = `#/cinema/${newView.data?.cinemaId || 1}`;
        break;
      case 'detail':
        targetHash = `#/movie/${newView.data?.movieId || 1}`;
        break;
      case 'profile':
        targetHash = '#/profile';
        break;
      case 'admin':
        targetHash = '#/admin';
        break;
      case 'admin-events':
        targetHash = '#/admin-events';
        break;
      case 'admin-movies':
        targetHash = '#/admin-movies';
        break;
      case 'admin-actors':
        targetHash = '#/admin/actors';
        break;
      case 'employee':
        targetHash = '#/employee';
        break;
      case 'events':
        targetHash = '#/events';
        break;
      case 'event-detail':
        targetHash = `#/event/${newView.data?.eventId || 1}`;
        break;
      case 'booking-funnel':
        targetHash = '#/booking-funnel';
        break;
      case 'login':
        targetHash = '#/login';
        break;
      case 'register':
        targetHash = '#/register';
        break;
      case 'seats':
        targetHash = '#/seats';
        break;
      default:
        targetHash = '#/';
    }

    if (newView.name === 'seats' && newView.data) {
      localStorage.setItem('lora_pending_booking', JSON.stringify(newView.data));
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      // If hash is already the target, update state manually
      setCurrentView(newView);
    }
    
    if (newView.name === 'home') {
      if (newView.data && newView.data.activeTab) {
        setMovieFilterTab(newView.data.activeTab);
        setTimeout(() => {
          const el = document.getElementById('phim');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Implicit Authorization Guard Checks
  if (['admin', 'admin-events', 'admin-movies'].includes(currentView.name) && userRole !== 'ADMIN') {
      return <div className="p-20 text-center text-red-500 font-bold">403 FORBIDDEN: Bạn không có quyền truy cập trang quản trị Admin!</div>;
  }
  if (currentView.name === 'employee' && userRole !== 'EMPLOYEE') {
      return <div className="p-20 text-center text-red-500 font-bold">403 FORBIDDEN: Bạn không có quyền truy cập trang Nhân Viên!</div>;
  }

  // Login Success Callback handler
  const handleLoginSuccess = (loggedInUser) => {
    const isInterrupted = sessionStorage.getItem('lora_booking_interrupted') === 'true';

    if (isInterrupted) {
      // Scenario A: Dynamic Mid-Funnel Authentication
      const stored = sessionStorage.getItem('lora_pending_booking') || localStorage.getItem('lora_pending_booking');
      let targetBooking = pendingBooking;
      if (!targetBooking && stored) {
        try {
          targetBooking = { bookingData: JSON.parse(stored) };
        } catch (e) {
          console.error(e);
        }
      }

      // Clear all active/stale context states
      sessionStorage.removeItem('lora_booking_interrupted');
      sessionStorage.removeItem('lora_pending_booking');
      localStorage.removeItem('lora_pending_booking');
      setPendingBooking(null);

      if (targetBooking) {
        handleViewChange({ name: 'seats', data: targetBooking.bookingData });
      } else {
        handleViewChange({ name: 'home', data: null });
      }
    } else {
      // Scenario B: Static/Generic Authentication (Fixing the Defect)
      // Wipe any stale local cache objects to prevent leaks
      sessionStorage.removeItem('lora_booking_interrupted');
      sessionStorage.removeItem('lora_pending_booking');
      localStorage.removeItem('lora_pending_booking');
      setPendingBooking(null);

      if (loggedInUser.role === 'ADMIN') {
        handleViewChange({ name: 'admin', data: null });
      } else if (loggedInUser.role === 'EMPLOYEE') {
        handleViewChange({ name: 'employee', data: null });
      } else {
        handleViewChange({ name: 'home', data: null });
      }
    }
  };

  const isDashboardView = ['admin', 'employee', 'admin-events', 'admin-movies', 'admin-actors'].includes(currentView.name);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-brand-coral selection:text-white">
      {/* Dynamic sticky header */}
      {!isDashboardView && (
        <Header 
          onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })} 
        />
      )}

      {/* Main Content Sections with State-Driven Switch Matrix */}
      <main className={`flex-grow ${!isDashboardView ? 'pt-20' : ''}`}>
        {currentView.name === 'home' && (
          <>
            {/* Cinematic Hero Banner */}
            <Hero 
              onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
              onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
            />

            {/* Featured Films Grid */}
            <MovieGrid
              activeTab={movieFilterTab}
              onChangeActiveTab={setMovieFilterTab}
              onSelectMovie={(movieId) => handleViewChange({ name: 'detail', data: { movieId } })}
              onBuyTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
              onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
            />

            {/* Homepage Events & Promotions Showcase */}
            <PromoShowcase 
              onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
            />

            {/* Horizontal Booking Workflow steps */}
            <BookingSteps />

            {/* Progressive Cinematic SEO Text Panel */}
            <BrandOverview />
          </>
        )}

        {currentView.name === 'detail' && (
          <MovieDetailView
            movieId={currentView.data.movieId}
            onSelectShowtime={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onBack={() => handleViewChange({ name: 'home', data: null })}
          />
        )}

        {currentView.name === 'seats' && (
          <SeatSelectionView
            bookingData={currentView.data}
            onBack={() => handleViewChange({ name: 'home', data: null })}
            onRequireLogin={(payload) => {
              setPendingBooking(payload);
              handleViewChange({ name: 'login', data: null });
            }}
            onUpdateBookingData={(newData) => {
              setCurrentView((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  ...newData
                }
              }));
            }}
          />
        )}

        {currentView.name === 'login' && (
          <LoginView
            onBack={() => {
              setPendingBooking(null);
              handleViewChange({ name: 'home', data: null });
            }}
            onRegisterLink={() => handleViewChange({ name: 'register', data: null })}
            onSuccess={handleLoginSuccess}
          />
        )}

        {currentView.name === 'register' && (
          <RegisterView
            onBack={() => handleViewChange({ name: 'home', data: null })}
            onLoginLink={() => handleViewChange({ name: 'login', data: { voluntary: true } })}
            onSuccessRedirect={() => handleViewChange({ name: 'login', data: { voluntary: true } })}
          />
        )}

        {(currentView.name === 'admin' || currentView.name === 'admin-events' || currentView.name === 'admin-movies' || currentView.name === 'admin-actors') && (
          <AdminDashboardView 
            initialTab={
              currentView.name === 'admin-events' ? 'events-promo' : 
              (currentView.name === 'admin-movies' ? 'movies' : 
              (currentView.name === 'admin-actors' ? 'actors' : 'dashboard'))
            }
            onBackHome={() => handleViewChange({ name: 'home', data: null })} 
          />
        )}

        {currentView.name === 'employee' && (
          <EmployeeDashboardView 
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onTicketingSelect={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
          />
        )}

        {currentView.name === 'profile' && (
          <CustomerProfileView 
            key={currentView.data?.initialTab || 'info'}
            initialTab={currentView.data?.initialTab || 'info'}
            onBackHome={() => handleViewChange({ name: 'home', data: null })} 
          />
        )}

        {currentView.name === 'discovery' && (
          <MovieDiscoveryView 
            key={currentView.data?.initialTab || 'ALL'}
            initialTab={currentView.data?.initialTab || 'ALL'}
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBuyTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
          />
        )}

        {currentView.name === 'actors' && (
          <ActorRegistryView 
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'actor-detail' && (
          <ActorRegistryView 
            actorName={currentView.data?.actorName}
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'directors' && (
          <DirectorRegistryView 
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'director-detail' && (
          <DirectorRegistryView 
            directorName={currentView.data?.directorName}
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'cinema-detail' && (
          <CinemaDetailView 
            cinemaId={currentView.data?.cinemaId}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
          />
        )}

        {currentView.name === 'events' && (
          <EventRegistryView 
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'event-detail' && (
          <EventRegistryView 
            eventId={currentView.data?.eventId}
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            onNavigate={(viewName, viewData = null) => handleViewChange({ name: viewName, data: viewData })}
          />
        )}

        {currentView.name === 'booking-funnel' && (
          <MasterBookingFunnel 
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBookTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
          />
        )}
      </main>

      {/* Sleek Dark Footer */}
      {!isDashboardView && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
