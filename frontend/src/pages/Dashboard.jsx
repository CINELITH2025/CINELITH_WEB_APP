import React, { useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InteractiveActivities from '../components/dashboard/InteractiveActivities';
import Analytics from '../components/dashboard/Analytics';
import UnlockGate from '../components/auth/UnlockGate';
import CinephileScoreCard from '../components/dashboard/CinephileScoreCard';
import { Link } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { Sparkles, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loggedUser = useUserStore((state) => state.user);

  // Fallback demo user for guest lock preview
  const user = loggedUser || {
    name: "Guest",
    username: "",
    avatar: "/images/actor_1.png",
    cinephileScore: 0,
    cinephileLevel: "Newcomer",
    cinephileBreakdown: { wa: 0, eg: 0, ac: 0, rq: 0, dv: 0, ct: 0, cr: 0 },
    streak: 0,
    favoriteMovies: [],
    watchedMovies: [],
    favoriteActors: [],
    favoriteGenres: []
  };

  const fetchMe = useUserStore((state) => state.fetchMe);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated) fetchMe().catch(() => null);
  }, [isAuthenticated, fetchMe]);

  const persona = useMemo(() => {
    return {
      topActor: user.favoriteActors?.[0] || "—",
      topDirector: user.favoriteMovies?.[0]?.director || "—",
      topGenre: user.favoriteGenres?.[0] || "—"
    };
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#08060d] text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8 space-y-10">
        <UnlockGate
          title="Unlock Personal Dashboard & Taste Analytics"
          subtitle="Access your entire film history, viewing stats, watch streak, Cinephile Score (0–10), and interactive taste radar charts by logging in."
          features={[
            "Personalized film history & watch log diary tracking",
            "Cinephile Taste Radar charts across directors, eras, and genres",
            "Interactive daily film quizzes & movie battles",
            "Taste Match recommendations connected to your profile"
          ]}
        >
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4.5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F5BF26]/20 p-0.5 bg-white/5 shrink-0 shadow-lg">
                <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt={user.name} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">Welcome, {user.name}</h1>
                <p className="text-xs text-gray-500 font-bold tracking-wider mt-0.5">{user.username}</p>
              </div>
            </div>
            <Link
              to="/recommend"
              className="flex items-center gap-2 bg-[#F5BF26] text-black font-black text-xs px-5 py-3 rounded-2xl hover:bg-[#F5C400] transition-colors"
            >
              Films For You <ArrowRight className="w-4 h-4" />
            </Link>
            <CinephileScoreCard user={user} />
          </div>

          {/* SECTION 2: PERSONA STATS & QUICK HIGHLIGHTS */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F5BF26]" /> Cinematic Persona & Highlights
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Top Actor */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F5BF26]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Actor</span>
                <div>
                  <span className="text-base font-extrabold text-white block truncate">{persona.topActor}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Most Watched Lead</span>
                </div>
              </div>

              {/* Top Director */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F5BF26]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Director</span>
                <div>
                  <span className="text-base font-extrabold text-white block truncate">{persona.topDirector}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Highly rated director</span>
                </div>
              </div>

              {/* Movies Watched */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F5BF26]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Media Logged</span>
                <div>
                  <span className="text-2xl font-black text-[#F5BF26] block">{user.watchedMovies?.length || 0}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Watched count</span>
                </div>
              </div>

              {/* Active Streak */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#F5BF26]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Login Streak</span>
                <div>
                  <span className="text-2xl font-black text-white block">{user?.streak || 0}d</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Consecutive days active</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: INTERACTIVE QUIZZES & BATTLES */}
          <InteractiveActivities />

          {/* SECTION 4: STATS TREND ANALYTICS */}
          <Analytics />
        </UnlockGate>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
