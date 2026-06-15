import { Link } from 'react-router-dom';
import { type Movie, IMAGE_BASE_URL } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group flex flex-col gap-2 rounded-xl transition-all duration-300 ease-in-out hover:scale-105"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shadow-md group-hover:shadow-xl transition-shadow duration-300">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500 text-sm p-4 text-center">
            No Image Available
          </div>
        )}
        
        {/* Rating Badge (overlay on image) */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 backdrop-blur-sm">
          <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-white">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="truncate text-sm font-medium text-slate-800 dark:text-slate-100 px-1">
        {movie.title}
      </h3>
    </Link>
  );
}