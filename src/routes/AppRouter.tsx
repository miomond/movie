import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Discover from "../pages/Discover"
import MovieDetails from "../pages/MovieDetails"
import Watchlist from "../pages/Watchlist"
import Layout from "../components/Layout"

function AppRouter() {
  return (
   <>
     <Routes>
      <Route path="/"  element={<Layout/>} >
        <Route index element={<Home/>} /> 
        <Route path="/movies" element={<Discover/>} /> 
        <Route path="/movie/:id" element={<MovieDetails/>} /> 
        <Route path="/watchlist" element={<Watchlist/>} /> 
      </Route>
      </Routes>
 
   </>
  )
}

export default AppRouter