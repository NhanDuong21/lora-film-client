import { createContext, useContext, useState } from 'react';
import { 
  INITIAL_MOVIES, 
  INITIAL_ACTORS, 
  INITIAL_CINEMAS, 
  INITIAL_SHOWTIMES, 
  INITIAL_EVENTS,
  INITIAL_CONCESSIONS,
  INITIAL_TICKETS,
  INITIAL_CUSTOMERS,
  INITIAL_EMPLOYEES
} from '../mocks/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [movies, setMoviesState] = useState(() => {
    const saved = localStorage.getItem('lora_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [actors, setActorsState] = useState(() => {
    const saved = localStorage.getItem('lora_actors');
    return saved ? JSON.parse(saved) : INITIAL_ACTORS;
  });

  const [theaters, setTheatersState] = useState(() => {
    const saved = localStorage.getItem('lora_theaters');
    return saved ? JSON.parse(saved) : INITIAL_CINEMAS;
  });

  const [showtimes, setShowtimesState] = useState(() => {
    const saved = localStorage.getItem('lora_showtimes');
    return saved ? JSON.parse(saved) : INITIAL_SHOWTIMES;
  });

  const [events, setEventsState] = useState(() => {
    const saved = localStorage.getItem('lora_admin_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [concessions, setConcessionsState] = useState(() => {
    const saved = localStorage.getItem('lora_concessions');
    return saved ? JSON.parse(saved) : INITIAL_CONCESSIONS;
  });

  const [tickets, setTicketsState] = useState(() => {
    const saved = localStorage.getItem('lora_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [customers, setCustomersState] = useState(() => {
    const saved = localStorage.getItem('lora_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [employees, setEmployeesState] = useState(() => {
    const saved = localStorage.getItem('lora_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const setMovies = (val) => {
    setMoviesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_movies', JSON.stringify(next));
      return next;
    });
  };

  const setActors = (val) => {
    setActorsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_actors', JSON.stringify(next));
      return next;
    });
  };

  const setTheaters = (val) => {
    setTheatersState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_theaters', JSON.stringify(next));
      return next;
    });
  };

  const setShowtimes = (val) => {
    setShowtimesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_showtimes', JSON.stringify(next));
      return next;
    });
  };

  const setEvents = (val) => {
    setEventsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_admin_events', JSON.stringify(next));
      return next;
    });
  };

  const setConcessions = (val) => {
    setConcessionsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_concessions', JSON.stringify(next));
      return next;
    });
  };

  const setTickets = (val) => {
    setTicketsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_tickets', JSON.stringify(next));
      return next;
    });
  };

  const setCustomers = (val) => {
    setCustomersState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_customers', JSON.stringify(next));
      return next;
    });
  };

  const setEmployees = (val) => {
    setEmployeesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem('lora_employees', JSON.stringify(next));
      return next;
    });
  };

  return (
    <DataContext.Provider value={{
      movies, setMovies,
      actors, setActors,
      cinemas: theaters, setCinemas: setTheaters,
      theaters, setTheaters,
      showtimes, setShowtimes,
      events, setEvents,
      concessions, setConcessions,
      tickets, setTickets,
      customers, setCustomers,
      employees, setEmployees
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
