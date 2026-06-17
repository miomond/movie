# 🎬 MovieFlix - Your Ultimate Movie Discovery App 🍿

Welcome to **MovieFlix**! This is a dynamic, Single Page Application (SPA) built with React, TypeScript, and Vite. It serves as an engaging platform for discovering trending movies, searching for your favorites, and building a personalized watchlist. 🚀

## 🌐 Live Demo

You can view and interact with the live version of the app here:
👉 **https://spa-movie.vercel.app/**

## 🌟 What This App Does

MovieFlix is designed to be your go-to companion for movie nights. With a sleek, dark-mode compatible UI and smooth GSAP animations, the app allows you to:
- **🔥 Explore Trending Movies:** See what's popular right now on the home page.
- **🔍 Search & Discover:** Find specific movies by title, or filter the catalog by genres and release years to discover hidden gems.
- **📖 View Detailed Information:** Dive deep into movie details, check out official trailers, runtimes, ratings, and read the plot overviews.
- **⭐ Manage Your Watchlist:** Log in securely using your TMDB account and save movies to your personal watchlist to watch later!

## 📡 TMDB API Integration

The app is powered by the [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs). Here is how the data fetching logic works behind the scenes:
- **Service Layer:** The `src/services/tmdb.ts` file acts as the dedicated service layer, handling all REST API calls using the native `fetch` API. It securely references your `API_KEY` via Vite's environment variables.
- **Dynamic Queries:** Functions like `searchMovies` and `discoverMovies` accept dynamic parameters (e.g., text query, genre ID, release year) and construct the endpoint URLs on the fly to return paginated results.
- **Bundled Responses:** The movie details fetch leverages the `append_to_response=videos` parameter. This clever optimization bundles the official YouTube trailer data alongside the movie's core metadata in a single network request! 🎥

## 🗂️ Watchlist Context & State Management

Managing user sessions and cross-component state is handled gracefully via the React Context API (`src/context/WatchlistContext.tsx`).
- **TMDB Authentication Flow:** The context manages a 3-step OAuth-like authentication flow: requesting a temporary token, redirecting for user approval, and trading that token for a permanent `session_id`.
- **Global Provider:** Once authenticated, the user's account details and remote Watchlist are fetched and stored globally, making them accessible to any component (like the Navbar or Movie Details page) without prop drilling.
- **Optimistic UI Updates:** When you click "+ Add to Watchlist", the app instantly updates the local state so the UI reacts blazingly fast. Simultaneously, it fires a background `POST` request to synchronize the change with the remote TMDB database. ⚡

