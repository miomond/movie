import { useState, useEffect } from "react";
import {
  searchMovies,
  discoverMovies,
  getGenres,
  type Movie,
  type Genre,
} from "../services/tmdb";
import MovieCard from "../components/MovieCard";

export default function Discover() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  // Filter States
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(""); // Using string for the <select> element

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Generate an array of years from current year down to 1950
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1949 },
    (_, i) => currentYear - i,
  );

  // Initial Data Fetch (Get Genres)
  useEffect(() => {
    const fetchInitialData = async () => {
      const genreData = await getGenres();
      setGenres(genreData);
    };
    fetchInitialData();
  }, []);

  // Handle Fetching Logic whenever filters change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setHasSearched(true);

      let results: Movie[] = [];
      let total = 0;
      const yearParam = selectedYear ? parseInt(selectedYear) : null;

      if (query.trim().length > 0) {
        // Text Search (with optional year filter)
        setSelectedGenre(null); // Clear genre visually when typing
        const data = await searchMovies(query, 1, yearParam);
        results = data.results;
        total = data.total_pages;
      } else if (selectedGenre !== null || yearParam !== null) {
        // Discovery Search (Genre and/or Year)
        const data = await discoverMovies(selectedGenre, yearParam, 1);
        results = data.results;
        total = data.total_pages;
      } else {
        // Reset if everything is empty
        setMovies([]);
        setHasSearched(false);
        setPage(1);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      setMovies(results);
      setTotalPages(total);
      setPage(1);
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedGenre, selectedYear]);

  // Handle Loading Next Pages
  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;

    const nextPage = page + 1;
    setLoadingMore(true);
    const yearParam = selectedYear ? parseInt(selectedYear) : null;

    let results: Movie[] = [];
    if (query.trim().length > 0) {
      const data = await searchMovies(query, nextPage, yearParam);
      results = data.results;
    } else if (selectedGenre !== null || yearParam !== null) {
      const data = await discoverMovies(selectedGenre, yearParam, nextPage);
      results = data.results;
    }

    setMovies((prevMovies) => [...prevMovies, ...results]);
    setPage(nextPage);
    setLoadingMore(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-screen pb-24">
      <div className="mb-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors">
          Find Your Next Favorite Movie
        </h1>

        {/* Search & Filter Controls Panel */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative group flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-lg shadow-sm"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Year Dropdown */}
          <div className="sm:w-48 flex-shrink-0">
            <select
              value={selectedYear}
              onChange={(e) => {
                setQuery("");
                setSelectedYear(e.target.value);
              }} // Optionally clear text search when selecting a year to prioritize discovery
              className="block w-full h-full min-h-[56px] px-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all text-lg shadow-sm cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre Categorizer Pills */}
        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar snap-x">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => {
                setQuery("");
                setSelectedGenre(selectedGenre === genre.id ? null : genre.id);
              }}
              className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedGenre === genre.id
                  ? "bg-sky-500 text-white shadow-md scale-105"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mt-2"></div>
              </div>
            ))}
          </div>
        ) : hasSearched && movies.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              No results found
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Try adjusting your search, year, or genre.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
              ))}
            </div>

            {hasSearched && page < totalPages && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-sky-500"></div>
                      Loading...
                    </>
                  ) : (
                    "Load More Movies"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-20 opacity-50">
            <svg
              className="mx-auto h-16 w-16 text-slate-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Select a genre, pick a year, or type to search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
