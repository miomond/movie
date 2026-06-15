import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails,type MovieDetails as IMovieDetails, IMAGE_BASE_URL } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<IMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Watchlist Context
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, isLoggedIn } = useWatchlist();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Movie not found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">The movie you are looking for doesn't exist or an error occurred.</p>
        <Link to="/" className="mt-6 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const formatRuntime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';
  const isSaved = isInWatchlist(movie.id);

  // LOGIC TO FIND THE TRAILER
  // We prioritize official YouTube trailers, but fallback to any YouTube trailer if an official one isn't marked
  const trailer = movie.videos?.results.find(
    (vid) => vid.site === 'YouTube' && vid.type === 'Trailer' && vid.official
  ) || movie.videos?.results.find(
    (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
  );

  return (
    <div className="w-full pb-24">
      {/* Backdrop Header */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-900">
        {movie.backdrop_path ? (
          <>
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-slate-900" />
          </>
        ) : (
          <div className="absolute inset-0 bg-slate-800" />
        )}
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 sm:-mt-48 z-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column: Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 w-48 sm:w-64">
            <div className="aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10">
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500">
                  No Poster
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-end pt-4 md:pt-16 lg:pt-24 text-center md:text-left flex-grow">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-md">
              {movie.title} <span className="font-normal text-slate-600 dark:text-slate-300">({releaseYear})</span>
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md">
                <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
              <span>{formatRuntime(movie.runtime)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex gap-2 flex-wrap justify-center">
                {movie.genres.map(genre => genre.name).join(', ')}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Overview</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
                {movie.overview || "No overview available for this movie."}
              </p>
            </div>

            {/* Watchlist Button */}
            <div className="mt-8">
              {isSaved ? (
                <button 
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold rounded-lg border border-red-500/50 shadow-sm transition-all"
                >
                  - Remove from Watchlist
                </button>
              ) : (
                <button 
                  onClick={() => isLoggedIn ? addToWatchlist(movie) : alert("Please log in with TMDB to use the watchlist!")}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  + Add to Watchlist
                </button>
              )}
            </div>
            
          </div>
        </div>

        {/* THE YOUTUBE TRAILER SECTION */}
        {trailer && (
          <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Official Trailer</h3>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
                title={trailer.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}