import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ActorBanner = ({ name, stats, image }) => {
  const [following, setFollowing] = useState(false);

  return (
    <section className="w-full mb-12">
      {/* Hero Banner Image */}
      <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden mb-8 group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent"></div>
        
        {/* Text Details Overlay */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F5BF26] mb-2 block">
            The Chameleon of a Generation
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            {name}
          </h1>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-4 md:px-6">
        <div className="flex items-center gap-6">
          {/* Stat Box: Movies Count */}
          <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[120px] md:min-w-[160px] shadow-xl">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Movies Count</span>
            <span className="text-3xl font-black text-white">{stats.movies}</span>
          </div>
          
          {/* Stat Box: Awards Count */}
          <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[120px] md:min-w-[160px] shadow-xl">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Awards Count</span>
            <span className="text-3xl font-black text-white">{stats.awards}</span>
          </div>
        </div>

        {/* Follow Button */}
        <div>
          <Button 
            onClick={() => setFollowing(!following)}
            className={`font-black text-sm px-8 py-6 rounded-xl transition-all shadow-lg ${
              following 
                ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' 
                : 'bg-[#F5BF26] text-black hover:bg-[#F5BF26]'
            }`}
          >
            {following ? 'Following' : '+ Follow'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActorBanner;
