import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import BookingSteps from './components/BookingSteps';
import Footer from './components/Footer';
import MovieDetailView from './components/MovieDetailView';
import SeatSelectionView from './components/SeatSelectionView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import AdminDashboardView from './components/AdminDashboardView';
import EmployeeDashboardView from './components/EmployeeDashboardView';
import CustomerProfileView from './components/CustomerProfileView';
import MovieDiscoveryView from './components/MovieDiscoveryView';
import ActorRegistryView from './components/ActorRegistryView';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppInner() {
  const [currentView, setCurrentView] = useState({ name: 'home', data: null });
  const [pendingBooking, setPendingBooking] = useState(null);
  const [movieFilterTab, setMovieFilterTab] = useState('NOW_SHOWING');
  const { userRole, isAuthenticated } = useAuth();

  // Scroll to top on view changes
  const handleViewChange = (newView) => {
    if (newView.name === 'seats' && !isAuthenticated) {
      setPendingBooking({ bookingData: newView.data });
      localStorage.setItem('lora_pending_booking', JSON.stringify(newView.data));
      setCurrentView({ name: 'login', data: null });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setCurrentView(newView);
    
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
  if (currentView.name === 'admin' && userRole !== 'ADMIN') {
      return <div className="p-20 text-center text-red-500 font-bold">403 FORBIDDEN: Bạn không có quyền truy cập trang quản trị Admin!</div>;
  }
  if (currentView.name === 'employee' && userRole !== 'EMPLOYEE') {
      return <div className="p-20 text-center text-red-500 font-bold">403 FORBIDDEN: Bạn không có quyền truy cập trang Nhân Viên!</div>;
  }

  // Login Success Callback handler
  const handleLoginSuccess = (loggedInUser) => {
    const stored = localStorage.getItem('lora_pending_booking');
    let targetBooking = pendingBooking;
    if (!targetBooking && stored) {
      try {
        targetBooking = { bookingData: JSON.parse(stored) };
      } catch (e) {
        console.error(e);
      }
    }

    if (targetBooking) {
      setPendingBooking(null);
      localStorage.removeItem('lora_pending_booking');
      handleViewChange({ name: 'seats', data: targetBooking.bookingData });
    } else if (loggedInUser.role === 'ADMIN') {
      handleViewChange({ name: 'admin', data: null });
    } else if (loggedInUser.role === 'EMPLOYEE') {
      handleViewChange({ name: 'employee', data: null });
    } else {
      handleViewChange({ name: 'home', data: null });
    }
  };

  const isDashboardView = ['admin', 'employee'].includes(currentView.name);

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
            <Hero />

            {/* Featured Films Grid */}
            <MovieGrid
              activeTab={movieFilterTab}
              onChangeActiveTab={setMovieFilterTab}
              onSelectMovie={(movieId) => handleViewChange({ name: 'detail', data: { movieId } })}
              onBuyTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
            />

            {/* Horizontal Booking Workflow steps */}
            <BookingSteps />
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
            onLoginLink={() => handleViewChange({ name: 'login', data: null })}
            onSuccessRedirect={() => handleViewChange({ name: 'login', data: null })}
          />
        )}

        {currentView.name === 'admin' && (
          <AdminDashboardView onBackHome={() => handleViewChange({ name: 'home', data: null })} />
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
            onBackHome={() => handleViewChange({ name: 'home', data: null })}
            onBuyTicket={(bookingData) => handleViewChange({ name: 'seats', data: bookingData })}
          />
        )}

        {currentView.name === 'actors' && (
          <ActorRegistryView 
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
