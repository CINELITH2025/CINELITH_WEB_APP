import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ActorProfile from './pages/ActorProfile'
import Dashboard from './pages/Dashboard'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Community from './pages/Community'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actor/:id" element={<ActorProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
