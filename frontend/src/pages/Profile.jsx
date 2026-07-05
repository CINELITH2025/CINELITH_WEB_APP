import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

const Profile = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState("Wishlist");

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Prevents render flash before redirect
  }

  // Determine which list of movies to display based on active tab
  const getTabMovies = () => {
    switch (activeTab) {
      case "Wishlist":
        return user.watchlist || [];
      case "Liked Movies":
        return user.favoriteMovies || [];
      case "Rated Movies":
        return user.watchedMovies || [];
      default:
        return [];
    }
  };

  // Helper to calculate top director dynamically
  const getTopDirector = () => {
    const movies = [...(user.favoriteMovies || []), ...(user.watchedMovies || [])];
    if (movies.length === 0) return "None";
    
    const counts = {};
    movies.forEach(m => {
      if (m.director) {
        counts[m.director] = (counts[m.director] || 0) + 1;
      }
    });

    let topDir = "Denis Villeneuve"; // sensible fallback
    let max = 0;
    Object.keys(counts).forEach(dir => {
      if (counts[dir] > max) {
        max = counts[dir];
        topDir = dir;
      }
    });
    return topDir;
  };

  const currentMovies = getTabMovies();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-10">
        
        {/* Profile Card Header */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar circle */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#FACC15]/20 p-1 bg-white/5 shrink-0 shadow-lg">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Profile detail details */}
            <div className="flex-1 text-center md:text-left flex flex-col pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{user.name}</h1>
                  <p className="text-xs text-gray-500 font-bold tracking-wider mt-1">{user.username}</p>
                </div>
                
                {/* Buttons row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Button 
                    onClick={() => navigate('/onboarding')}
                    className="bg-[#E2B710] hover:bg-[#C59E0C] text-black font-black text-xs px-6 py-4.5 rounded-lg shadow-md cursor-pointer"
                  >
                    Retake Onboarding
                  </Button>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="outline" 
                    className="border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold text-xs px-6 py-4.5 rounded-lg cursor-pointer"
                  >
                    Dashboard
                  </Button>
                </div>
              </div>

              {/* Bio quote */}
              <p className="text-sm text-gray-400 max-w-xl leading-relaxed italic mb-6">
                "{user.bio}"
              </p>

              {/* Followers metric */}
              <div className="flex items-center justify-center md:justify-start gap-6 font-bold">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg text-white font-black">1,234</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Following</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg text-white font-black">5,678</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left / Middle: Tab collection & Grid */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-white/5 mb-8">
              {["Wishlist", "Liked Movies", "Rated Movies"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-xs md:text-sm font-black tracking-wider uppercase transition-all relative cursor-pointer ${
                    activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FACC15]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Poster Grid */}
            {currentMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
                {currentMovies.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate(`/movie/${item.id}`)}
                    className="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 group cursor-pointer shadow-xl hover:border-[#FACC15]/40 transition-all duration-300"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl mb-12">
                <p className="text-gray-500 text-sm font-medium">No movies in this list yet.</p>
                <Button 
                  onClick={() => navigate('/movies')}
                  className="mt-4 bg-[#FACC15] hover:bg-[#E2B710] text-black font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Browse Movies
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Quick Stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
              <h3 className="text-lg font-black text-white tracking-tight border-b border-white/5 pb-4 mb-2">
                Quick Stats
              </h3>

              {/* Stat 1 */}
              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Total Movies Watched</span>
                <span className="text-2xl font-black text-white">{user.watchedMovies?.length || 0}</span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Favorite Genre</span>
                <span className="text-2xl font-black text-[#FACC15]">{user.favoriteGenres?.[0] || "None"}</span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Top Director</span>
                <span className="text-lg font-black text-white truncate">{getTopDirector()}</span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cinephile Score</span>
                <span className="text-2xl font-black text-[#FACC15]">{user.cinephileScore?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Profile;
