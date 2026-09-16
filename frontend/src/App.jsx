import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
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

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const user = useUserStore((state) => state.user)
  const isReady = useUserStore((state) => state.isReady)

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#08060d] text-white flex items-center justify-center text-sm font-bold tracking-widest uppercase">
        Loading CINELITH...
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

const PublicAuthRoute = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const user = useUserStore((state) => state.user)
  const isReady = useUserStore((state) => state.isReady)

  if (!isReady) return null
  if (isAuthenticated && user) {
    return <Navigate to={user.onboardingCompleted ? '/dashboard' : '/onboarding'} replace />
  }
  return children
}

function AppRoutes() {
  const bootstrap = useUserStore((state) => state.bootstrap)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<PublicAuthRoute><Auth /></PublicAuthRoute>} />

      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/app" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/actor/:id" element={<ActorProfile />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/movies" element={<Navigate to="/" replace />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
      <Route path="/community" element={<Navigate to="/" replace />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
