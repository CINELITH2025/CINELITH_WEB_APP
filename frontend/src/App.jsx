import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useUserStore from './store/useUserStore'
import Home from './pages/Home'
import Landing from './pages/Landing'
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

// Strict Pre-Launch Guard: Restricts public visitors strictly to the Pre-Launch Landing Page
const PreLaunchGuard = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC PRE-LAUNCH LANDING PAGE (Primary & Only Entry) */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* PROTECTED INTERNAL APP ROUTES (Locked in Pre-Launch Mode) */}
        <Route path="/app" element={<PreLaunchGuard><Home /></PreLaunchGuard>} />
        <Route path="/onboarding" element={<PreLaunchGuard><Onboarding /></PreLaunchGuard>} />
        <Route path="/actor/:id" element={<PreLaunchGuard><ActorProfile /></PreLaunchGuard>} />
        <Route path="/dashboard" element={<PreLaunchGuard><Dashboard /></PreLaunchGuard>} />
        <Route path="/explore" element={<PreLaunchGuard><Explore /></PreLaunchGuard>} />
        <Route path="/movies" element={<Navigate to="/" replace />} />
        <Route path="/movie/:id" element={<PreLaunchGuard><MovieDetails /></PreLaunchGuard>} />
        <Route path="/people" element={<PreLaunchGuard><People /></PreLaunchGuard>} />
        <Route path="/community" element={<Navigate to="/" replace />} />
        <Route path="/profile" element={<PreLaunchGuard><Profile /></PreLaunchGuard>} />
        <Route path="/notifications" element={<PreLaunchGuard><Notifications /></PreLaunchGuard>} />
        <Route path="/messages" element={<PreLaunchGuard><Messages /></PreLaunchGuard>} />

        {/* Catch-all fallback redirects back to Pre-Launch Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

