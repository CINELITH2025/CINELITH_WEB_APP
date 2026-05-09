import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ActorProfile from './pages/ActorProfile'
import Dashboard from './pages/Dashboard'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actor/:id" element={<ActorProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
