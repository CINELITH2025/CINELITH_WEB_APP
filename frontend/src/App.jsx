import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ActorProfile from './pages/ActorProfile'
import Dashboard from './pages/Dashboard'
import Explore from './pages/Explore'
import MovieDetails from './pages/MovieDetails'
import People from './pages/People'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/actor/:id" element={<ActorProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/movies" element={<Navigate to="/explore" replace />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/people" element={<People />} />
        <Route path="/community" element={<Navigate to="/people" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
