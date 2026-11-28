import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import useUserStore from './store/useUserStore'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { Clapperboard } from 'lucide-react'

// Code-splitting via React.lazy for high-performance route chunking (<100KB per chunk)
const Home = lazy(() => import('./pages/Home'))
const Landing = lazy(() => import('./pages/Landing'))
const ActorProfile = lazy(() => import('./pages/ActorProfile'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Explore = lazy(() => import('./pages/Explore'))
const MovieDetails = lazy(() => import('./pages/MovieDetails'))
const People = lazy(() => import('./pages/People'))
const Profile = lazy(() => import('./pages/Profile'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Messages = lazy(() => import('./pages/Messages'))
const Auth = lazy(() => import('./pages/Auth'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const Recommend = lazy(() => import('./pages/Recommend'))

// High-speed sleek page fallback skeleton
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-[#08060d] text-white flex flex-col items-center justify-center p-6 select-none">
    <div className="relative mb-6">
      <div className="w-14 h-14 rounded-2xl bg-[#F5BF26]/10 border border-[#F5BF26]/30 flex items-center justify-center animate-pulse">
        <Clapperboard className="w-7 h-7 text-[#F5BF26]" />
      </div>
      <div className="absolute inset-0 rounded-2xl bg-[#F5BF26]/20 blur-xl animate-ping opacity-25 pointer-events-none" />
    </div>
    <span className="text-xs font-black tracking-[0.25em] uppercase text-gray-400">
      Loading Frame...
    </span>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const user = useUserStore((state) => state.user)
  const isReady = useUserStore((state) => state.isReady)

  if (!isReady) {
    return <PageLoadingFallback />
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
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* Primary Web Application Entry */}
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Navigate to="/" replace />} />

        {/* Pre-Launch / Early Access Landing Page */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/prelaunch" element={<Landing />} />

        {/* Authentication & Onboarding */}
        <Route path="/auth" element={<PublicAuthRoute><Auth /></PublicAuthRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

        {/* Discovery & Movies */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/movies" element={<Navigate to="/explore" replace />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/series/:id" element={<MovieDetails />} />
        <Route path="/actor/:id" element={<ActorProfile />} />

        {/* Social & Community */}
        <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
        <Route path="/community" element={<Navigate to="/people" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
