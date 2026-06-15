// TMDB Image Base URL for constructing poster paths
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// We use import.meta.env for Vite environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // If you use the read access token instead of the API key, you would use:
    // Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
  }
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}
export interface MovieDetails extends Movie {
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  videos?: {
    results: Video[];
  };
}

export interface SearchResult {
  results: Movie[];
  total_pages: number;
}



export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Updated Search (Now accepts a year!)
export const searchMovies = async (query: string, page: number = 1, year: number | null = null): Promise<SearchResult> => {
  if (!query) return { results: [], total_pages: 0 };
  try {
    let url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&api_key=${API_KEY}`;
    if (year) url += `&primary_release_year=${year}`; // TMDB's official year filter
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error('Failed to search movies');
    const data: TMDBResponse = await response.json();
    return { results: data.results, total_pages: data.total_pages };
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 0 };
  }
};

// Updated Discover (Replaces discoverMoviesByGenre)
export const discoverMovies = async (genreId: number | null, year: number | null, page: number = 1): Promise<SearchResult> => {
  try {
    let url = `${BASE_URL}/discover/movie?page=${page}&api_key=${API_KEY}&sort_by=popularity.desc`;
    if (genreId) url += `&with_genres=${genreId}`;
    if (year) url += `&primary_release_year=${year}`;

    const response = await fetch(url, fetchOptions);
    if (!response.ok) throw new Error('Failed to discover movies');
    const data: TMDBResponse = await response.json();
    return { results: data.results, total_pages: data.total_pages };
  } catch (error) {
    console.error("Error discovering movies:", error);
    return { results: [], total_pages: 0 };
  }
};



export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  try {
    // Notice the &append_to_response=videos at the end of the URL!
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};







///////////////////////// Auth /////////////////////////////////////////

// ==========================================
// AUTHENTICATION & USER ACCOUNT ENDPOINTS
// ==========================================

export interface AccountDetails {
  id: number;
  username: string;
  name: string;
}

// Step 1: Get a temporary request token
export const createRequestToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/token/new?api_key=${API_KEY}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to create request token');
    const data = await response.json();
    return data.request_token;
  } catch (error) {
    console.error("Error creating request token:", error);
    return null;
  }
};

// Step 3: Trade the approved request token for a permanent Session ID
export const createSession = async (requestToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/authentication/session/new?api_key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ request_token: requestToken }),
    });
    if (!response.ok) throw new Error('Failed to create session');
    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
};

// Step 4: Get the user's Account ID (Required to fetch/modify their specific watchlist)
export const getAccountDetails = async (sessionId: string): Promise<AccountDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/account?api_key=${API_KEY}&session_id=${sessionId}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch account details');
    return await response.json();
  } catch (error) {
    console.error("Error fetching account details:", error);
    return null;
  }
};

// ==========================================
// USER SPECIFIC WATCHLIST ENDPOINTS
// ==========================================

// Fetch the user's actual database watchlist from TMDB
export const getAccountWatchlist = async (accountId: number, sessionId: string): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/account/${accountId}/watchlist/movies?api_key=${API_KEY}&session_id=${sessionId}&language=en-US&page=1`, 
      fetchOptions
    );
    if (!response.ok) throw new Error('Failed to fetch user watchlist');
    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching user watchlist:", error);
    return [];
  }
};

// Add or Remove a movie directly to/from the TMDB database
export const mutateWatchlist = async (accountId: number, sessionId: string, movieId: number, adding: boolean): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/account/${accountId}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        media_type: 'movie',
        media_id: movieId,
        watchlist: adding, // true adds it, false removes it
      }),
    });
    if (!response.ok) throw new Error('Failed to update watchlist');
    const data = await response.json();
    return data.success; // Returns true if TMDB successfully updated the database
  } catch (error) {
    console.error("Error mutating watchlist:", error);
    return false;
  }
};



////////////////////////////////////// the categorizer  //////////////////////////
// Add this interface near your others
export interface Genre {
  id: number;
  name: string;
}

// Fetch the list of official TMDB genres
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`, fetchOptions);
    if (!response.ok) throw new Error('Failed to fetch genres');
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// Discover movies by specific Genre ID
export const discoverMoviesByGenre = async (genreId: number, page: number = 1): Promise<SearchResult> => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&api_key=${API_KEY}&sort_by=popularity.desc`, 
      fetchOptions
    );
    if (!response.ok) throw new Error('Failed to discover movies');
    const data: TMDBResponse = await response.json();
    return { results: data.results, total_pages: data.total_pages };
  } catch (error) {
    console.error("Error discovering movies:", error);
    return { results: [], total_pages: 0 };
  }
};