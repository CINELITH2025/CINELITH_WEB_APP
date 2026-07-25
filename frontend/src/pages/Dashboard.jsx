import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InteractiveActivities from '../components/dashboard/InteractiveActivities';
import Analytics from '../components/dashboard/Analytics';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore, { MOVIE_CATALOG, ACTOR_CATALOG } from '../store/useUserStore';
import { Star, Film, Sparkles, User, Award, Video, Heart, Calendar, ArrowRight, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuthenticated || !user) {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  // Compute Persona Metrics dynamically based on activity weights
  const persona = useMemo(() => {
    if (!user) return null;

    const maleActors = ["Timothée Chalamet", "Austin Butler", "Cillian Murphy", "Mark Ruffalo", "Leonardo DiCaprio", "Christian Bale", "Bryan Cranston", "Aaron Paul", "Bob Odenkirk", "Al Pacino", "John Travolta", "Samuel L. Jackson", "Harrison Ford", "Ryan Gosling", "Matthew McConaughey", "Brad Pitt", "Edward Norton", "Paul Giamatti", "Marlon Brando", "John David Washington", "Heath Ledger", "Song Kang-ho", "Lee Sun-kyun", "Jared Harris", "Stellan Skarsgård", "Lee Jung-jae", "Park Hae-soo"];
    const femaleActors = ["Zendaya", "Emma Stone", "Florence Pugh", "Emily Blunt", "Sandra Hüller", "Uma Thurman", "Ana de Armas", "Anne Hathaway", "Jessica Chastain", "Cho Yeo-jeong", "Helena Bonham Carter", "Emilia Clarke", "Sarah Snook", "Patricia Arquette", "Emily Watson", "Jung Ho-yeon", "Da'Vine Joy Randolph", "Sean Young", "Dorothy Comingore", "Gemma Chan", "Elliot Page"];

    const actorCounts = {};
    const actressCounts = {};
    const dirCounts = {};
    const genreCounts = {};

    // 1. Weight onboarding preferences higher (+3 points)
    user.favoriteActors?.forEach(actName => {
      if (maleActors.includes(actName)) {
        actorCounts[actName] = (actorCounts[actName] || 0) + 3;
      } else if (femaleActors.includes(actName)) {
        actressCounts[actName] = (actressCounts[actName] || 0) + 3;
      }
    });

    user.favoriteGenres?.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 3;
    });

    // 2. Count watched and liked movies (+1 point)
    const allMovies = [...(user.favoriteMovies || []), ...(user.watchedMovies || [])];
    allMovies.forEach(m => {
      // Aggregate directors
      if (m.director) {
        dirCounts[m.director] = (dirCounts[m.director] || 0) + 1;
      }

      // Aggregate genres
      if (m.genre) {
        m.genre.split(',').forEach(g => {
          const cleanG = g.trim();
          genreCounts[cleanG] = (genreCounts[cleanG] || 0) + 1;
        });
      }

      // Aggregate cast
      if (m.cast) {
        m.cast.forEach(a => {
          if (maleActors.includes(a)) {
            actorCounts[a] = (actorCounts[a] || 0) + 1;
          } else if (femaleActors.includes(a)) {
            actressCounts[a] = (actressCounts[a] || 0) + 1;
          }
        });
      }
    });

    // Calculate Top Actor
    let topActor = "Cillian Murphy";
    let maxActorCount = 0;
    Object.keys(actorCounts).forEach(a => {
      if (actorCounts[a] > maxActorCount) {
        topActor = a;
        maxActorCount = actorCounts[a];
      }
    });

    // Calculate Top Actress
    let topActress = "Zendaya";
    let maxActressCount = 0;
    Object.keys(actressCounts).forEach(a => {
      if (actressCounts[a] > maxActressCount) {
        topActress = a;
        maxActressCount = actressCounts[a];
      }
    });

    // Calculate Top Director
    let topDirector = "Christopher Nolan";
    let maxDirCount = 0;
    Object.keys(dirCounts).forEach(d => {
      if (dirCounts[d] > maxDirCount) {
        topDirector = d;
        maxDirCount = dirCounts[d];
      }
    });

    // Calculate Favorite Genre
    let favoriteGenre = user.favoriteGenres?.[0] || "Sci-Fi";
    let maxGenreCount = 0;
    Object.keys(genreCounts).forEach(g => {
      if (genreCounts[g] > maxGenreCount) {
        favoriteGenre = g;
        maxGenreCount = genreCounts[g];
      }
    });

    // Determine Cinephile Level Badge based on score
    const score = user.cinephileScore || 0;
    let badge = "Apprentice";
    if (score >= 500 && score < 1500) badge = "Film Critic";
    else if (score >= 1500 && score < 4000) badge = "Director's Cut";
    else if (score >= 4000) badge = "Cinema Grandmaster";

    return {
      topActor,
      topActress,
      topDirector,
      favoriteGenre,
      badge
    };
  }, [user]);

  if (!isAuthenticated || !user || !persona) {
    return null;
  }

  // Get onboarding selected actor objects
  const onboardingActors = ACTOR_CATALOG.filter(a => user.favoriteActors?.includes(a.name));

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4.5">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FACC15]/20 p-0.5 bg-white/5 shrink-0 shadow-lg">
              <img src={user.avatar} className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">Welcome, {user.name}</h1>
              <p className="text-xs text-gray-500 font-bold tracking-wider mt-0.5">{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl shadow-xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Cinephile Score</span>
              <span className="text-xl font-black text-[#FACC15]">{user.cinephileScore?.toLocaleString()}</span>
            </div>
            <div className="w-[1px] h-8 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Rank Badge</span>
              <span className="text-xs font-black text-white px-2 py-0.5 rounded bg-[#FACC15]/10 border border-[#FACC15]/20 uppercase tracking-widest mt-0.5">{persona.badge}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: ONBOARDING PREFERENCES */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FACC15] fill-[#FACC15]" />
              Your Onboarding Choices
            </h2>
            <span className="text-xs text-gray-500 font-semibold italic">Saved after registration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Favorite Movies */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6.5">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-[#FACC15]" /> Top 5 Favorite Movies
              </h3>
              {user.favoriteMovies && user.favoriteMovies.length > 0 ? (
                <div className="grid grid-cols-5 gap-3">
                  {user.favoriteMovies.slice(0, 5).map((movie) => (
                    <Link 
                      key={movie.id} 
                      to={`/movie/${movie.id}`}
                      className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/5 group shadow-md"
                    >
                      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-semibold italic">No movies selected</p>
              )}
            </div>

            {/* Favorite Actors */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6.5">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#FACC15]" /> Top 5 Favorite Actors
              </h3>
              {user.favoriteActors && user.favoriteActors.length > 0 ? (
                <div className="grid grid-cols-5 gap-3">
                  {user.favoriteActors.slice(0, 5).map((actorName, idx) => {
                    const actObj = ACTOR_CATALOG.find(a => a.name === actorName);
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 p-0.5 bg-white/5">
                          <img src={actObj?.image || "/images/actor_1.png"} alt={actorName} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <span className="text-[9px] text-gray-300 font-bold truncate text-center w-full">{actorName}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-semibold italic">No actors selected</p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: DYNAMIC PERSONA METRICS */}
        <section className="mb-12">
          <h2 className="text-xl font-black text-white tracking-tight mb-6 flex items-center gap-2">
            <Award className="w-5.5 h-5.5 text-[#FACC15]" />
            Your Cinephile Persona
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {/* Top Actor */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Actor</span>
              <div>
                <span className="text-base font-extrabold text-white block truncate">{persona.topActor}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Most watched male star</span>
              </div>
            </div>

            {/* Top Actress */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Actress</span>
              <div>
                <span className="text-base font-extrabold text-white block truncate">{persona.topActress}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Most watched female star</span>
              </div>
            </div>

            {/* Top Director */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Top Director</span>
              <div>
                <span className="text-base font-extrabold text-white block truncate">{persona.topDirector}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Highly rated director</span>
              </div>
            </div>

            {/* Favourite Genre */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Favourite Genre</span>
              <div>
                <span className="text-base font-extrabold text-[#FACC15] block truncate">{persona.favoriteGenre}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Highest watch count</span>
              </div>
            </div>

            {/* Movies Watched */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Media Logged</span>
              <div>
                <span className="text-2xl font-black text-[#FACC15] block">{user.watchedMovies?.length || 0}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Watched count</span>
              </div>
            </div>

            {/* Active Streak */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#FACC15]/30 transition-colors shadow-lg flex flex-col justify-between">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Login Streak</span>
              <div>
                <span className="text-2xl font-black text-white block">{user.streak || 1}d</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Consecutive days active</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE QUIZZES & BATTLES */}
        <InteractiveActivities />

        {/* SECTION 4: STATS TREND ANALYTICS */}
        <Analytics />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
