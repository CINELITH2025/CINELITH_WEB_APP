import React, { useEffect, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InteractiveActivities from '../components/dashboard/InteractiveActivities';
import Analytics from '../components/dashboard/Analytics';
import UnlockGate from '../components/auth/UnlockGate';
import { Link } from 'react-router-dom';
import useUserStore, { MOVIE_CATALOG } from '../store/useUserStore';
import { Sparkles, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const loggedUser = useUserStore((state) => state.user);

  // Fallback demo user for guest lock preview
  const user = loggedUser || {
    name: "Alex Mercer",
    username: "@alex_cinephile",
    avatar: "/images/actor_1.png",
    bio: "Cinephile exploring sci-fi epics, Criterion classics, and film history.",
    cinephileScore: 88,
    streak: 14,
    favoriteMovies: MOVIE_CATALOG.slice(0, 5),
    watchedMovies: MOVIE_CATALOG.slice(0, 12),
    favoriteActors: ["Timothée Chalamet", "Cillian Murphy", "Zendaya", "Emma Stone"],
    favoriteGenres: ["Sci-Fi", "Drama", "Thriller"]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const persona = useMemo(() => {
    return {
      topActor: "Cillian Murphy",
      topDirector: "Christopher Nolan",
      topGenre: user.favoriteGenres?.[0] || "Sci-Fi"
    };
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#08060d] text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8 space-y-10">
        <UnlockGate
          title="Unlock Personal Dashboard & Taste Analytics"
          subtitle="Access your entire film history, viewing stats, watch streak, Cinephile score (88%), and interactive taste radar charts by logging in."
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
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#EAB513]/20 p-0.5 bg-white/5 shrink-0 shadow-lg">
                <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt={user.name} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">Welcome, {user.name}</h1>
                <p className="text-xs text-gray-500 font-bold tracking-wider mt-0.5">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Cinephile Score</span>
                <span className="text-xl font-black text-[#EAB513]">{user.cinephileScore || 88}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Streak</span>
                <span className="text-xl font-black text-white">{user.streak || 14}d</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONA STATS & QUICK HIGHLIGHTS */}
          <section className="space-y-4 mb-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EAB513]" /> Cinematic Persona & Highlights
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Top Actor */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#EAB513]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Actor</span>
                <div>
                  <span className="text-base font-extrabold text-white block truncate">{persona.topActor}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Most Watched Lead</span>
                </div>
              </div>

              {/* Top Director */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#EAB513]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Director</span>
                <div>
                  <span className="text-base font-extrabold text-white block truncate">{persona.topDirector}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Highly rated director</span>
                </div>
              </div>

              {/* Movies Watched */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#EAB513]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Media Logged</span>
                <div>
                  <span className="text-2xl font-black text-[#EAB513] block">{user.watchedMovies?.length || 12}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Watched count</span>
                </div>
              </div>

              {/* Active Streak */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#EAB513]/30 transition-colors shadow-lg flex flex-col justify-between">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Login Streak</span>
                <div>
                  <span className="text-2xl font-black text-white block">{user.streak || 14}d</span>
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
