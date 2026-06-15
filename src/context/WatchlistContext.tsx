import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  type Movie, 
  createRequestToken, 
  createSession, 
  getAccountDetails, 
  getAccountWatchlist, 
  mutateWatchlist 
} from '../services/tmdb';

interface WatchlistContextType {
  watchlist: Movie[];
  isLoggedIn: boolean;
  username: string | null;
  login: () => void;
  logout: () => void;
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (id: number) => Promise<void>;
  isInWatchlist: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('tmdb_session_id'));
  const [accountId, setAccountId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // 1. Handle the Redirect from TMDB Login
  useEffect(() => {
    const handleAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const requestToken = urlParams.get('request_token');
      const approved = urlParams.get('approved');

      if (requestToken && approved === 'true') {
        const newSessionId = await createSession(requestToken);
        if (newSessionId) {
          setSessionId(newSessionId);
          localStorage.setItem('tmdb_session_id', newSessionId);
          // Clean up the URL so the token doesn't stay in the address bar
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleAuthRedirect();
  }, []);

  // 2. Fetch User Account & Watchlist whenever they log in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!sessionId) return;

      const accountData = await getAccountDetails(sessionId);
      if (accountData) {
        setAccountId(accountData.id);
        setUsername(accountData.username);

        const userWatchlist = await getAccountWatchlist(accountData.id, sessionId);
        setWatchlist(userWatchlist);
      } else {
        logout();
      }
    };

    fetchUserData();
  }, [sessionId]);

  // 3. Authentication Actions
  const login = async () => {
    const token = await createRequestToken();
    if (token) {
      window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}`;
    } else {
      alert("Failed to initiate login. Please check your API key.");
    }
  };

  const logout = () => {
    setSessionId(null);
    setAccountId(null);
    setUsername(null);
    setWatchlist([]);
    localStorage.removeItem('tmdb_session_id');
  };

  // 4. Watchlist Actions (Optimistic UI Updates)
  const addToWatchlist = async (movie: Movie) => {
    if (!sessionId || !accountId) {
      alert("Please log in to add movies to your watchlist!");
      return;
    }

    setWatchlist((prev) => [...prev, movie]);

    const success = await mutateWatchlist(accountId, sessionId, movie.id, true);
    if (!success) {
      setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
      alert("Failed to sync with TMDB database.");
    }
  };

  const removeFromWatchlist = async (id: number) => {
    if (!sessionId || !accountId) return;

    const movieToRestore = watchlist.find((m) => m.id === id);
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));

    const success = await mutateWatchlist(accountId, sessionId, id, false);
    if (!success && movieToRestore) {
      setWatchlist((prev) => [...prev, movieToRestore]);
      alert("Failed to sync with TMDB database.");
    }
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((movie) => movie.id === id);
  };

  return (
    <WatchlistContext.Provider 
      value={{ 
        watchlist, 
        isLoggedIn: !!sessionId, 
        username, 
        login, 
        logout, 
        addToWatchlist, 
        removeFromWatchlist, 
        isInWatchlist 
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}