import React from 'react';
import { Button } from '@/components/ui/button';

const ActorBanner = ({ name, stats, image }) => {
  return (
    <section className="w-full mb-12">
      {/* Hero Banner Image */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden mb-6 group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">{name}</h1>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 px-2">
        <div className="flex items-center gap-4 md:gap-6 flex-1">
          {/* Stat Box: Movies */}
          <div className="flex flex-col min-w-[100px] md:min-w-[140px] bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-3xl font-bold text-primary">{stats.movies}</span>
            <span className="text-sm text-muted-foreground font-medium mt-1">Movies</span>
          </div>
          
          {/* Stat Box: Series */}
          <div className="flex flex-col min-w-[100px] md:min-w-[140px] bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-3xl font-bold text-primary">{stats.series}</span>
            <span className="text-sm text-muted-foreground font-medium mt-1">Series</span>
          </div>
          
          {/* Stat Box: Rating */}
          <div className="flex flex-col min-w-[100px] md:min-w-[140px] bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-3xl font-bold text-primary">{stats.rating}</span>
            <span className="text-sm text-muted-foreground font-medium mt-1">Rating</span>
          </div>
        </div>

        {/* Follow Button */}
        <div className="ml-auto shrink-0 pr-2">
          <Button className="bg-primary text-black font-bold hover:bg-primary/90 px-8 py-6 text-base rounded-xl shadow-lg">
            + Follow
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActorBanner;
