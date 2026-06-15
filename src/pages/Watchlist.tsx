import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { Link } from 'react-router-dom';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24">
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          My Watchlist
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Movies you want to watch later ({watchlist.length}).
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-6 mb-4">
            <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Your list is empty</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
            You haven't added any movies yet. Go explore and find something great to watch!
          </p>
          <Link to="/" className="mt-6 px-6 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors">
            Explore Trending
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}