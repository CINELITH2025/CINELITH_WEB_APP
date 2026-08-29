import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';

const Rankings = () => {
  const user = useUserStore((state) => state.user);

  // Fallbacks if onboarding is retaken or custom selections are empty
  const topActorName = user?.favoriteActors?.[0] || "Timothée Chalamet";
  const topMovie = user?.favoriteMovies?.[0] || { title: "Dune: Part Two", image: "/images/poster_1.png" };

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Rankings</h2>
      
      <div className="flex flex-col gap-8">
        {/* Top Actor */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Top Actor Ranked</span>
            <h3 className="text-2xl font-black text-white mb-2">{topActorName}</h3>
            <Link to="/actor/1" className="text-sm text-gray-500 hover:text-white transition-colors">
              View Actor Profile
            </Link>
          </div>
          
          <div className="w-full md:w-[400px] h-[160px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#F5BF26]/30 transition-all duration-300">
            <img 
              src="/images/actor_hero_bg.png" 
              alt={topActorName} 
              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
            />
          </div>
        </div>

        {/* Top Movie */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Top Movie Ranked</span>
            <h3 className="text-2xl font-black text-white mb-2">{topMovie.title}</h3>
            <Link to="/movies" className="text-sm text-gray-500 hover:text-white transition-colors">
              Explore Movie Details
            </Link>
          </div>
          
          <div className="w-full md:w-[400px] h-[160px] rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#F5BF26]/30 transition-all duration-300">
            <img 
              src={topMovie.image} 
              alt={topMovie.title} 
              className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rankings;
