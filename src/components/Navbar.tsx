import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, username, login, logout } = useWatchlist();
  
  const navRef = useRef<HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // GSAP Initial Load Animation
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  // Close the mobile menu automatically whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-sky-600 dark:text-sky-400 tracking-tighter">
              Movie<span className="text-slate-900 dark:text-slate-100">Flix</span>
            </Link>
          </div>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors">
              Discover
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Auth State (Desktop) */}
            <div className="hidden sm:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link to="/watchlist" className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors pr-2">
                    Watchlist
                  </Link>
                  <div className="flex items-center gap-3 border-l border-slate-300 dark:border-slate-700 pl-4">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                      {username || 'User'}
                    </span>
                    <button 
                      onClick={logout}
                      className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={login}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            {/* Mobile Hamburger Button (Hidden on Desktop) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-sky-500 dark:hover:text-sky-400">
            Home
          </Link>
          <Link to="/movies" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-sky-500 dark:hover:text-sky-400">
            Discover
          </Link>
          
          {/* Auth State (Mobile) */}
          {isLoggedIn ? (
            <>
              <Link to="/watchlist" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-sky-500 dark:hover:text-sky-400">
                Watchlist ({username})
              </Link>
              <button 
                onClick={logout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={login}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
            >
              Login with TMDB
            </button>
          )}
        </div>
      )}
    </header>
  );
}