import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MovieHero = ({ movie }) => {
  return (
    <section className="flex flex-col md:flex-row gap-8 mb-12">
      {/* Left: Large Poster */}
      <div className="w-full md:w-[380px] shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
      </div>

      {/* Right: Details */}
      <div className="flex-1 flex flex-col pt-4">
        <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-6 tracking-tight uppercase">
          {movie.title}
        </h1>
        
        <p className="text-lg text-foreground/80 leading-relaxed mb-8 max-w-2xl">
          {movie.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Genre</span>
            <span className="text-foreground font-medium">{movie.genre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Runtime</span>
            <span className="text-foreground font-medium">{movie.runtime}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Release</span>
            <span className="text-foreground font-medium">{movie.releaseDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Awards</span>
            <span className="text-foreground font-medium">{movie.awards}</span>
          </div>
        </div>

        <Button className="w-fit bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-8 py-6 rounded-xl flex items-center gap-2 group transition-all">
          <Bookmark className="w-5 h-5 group-hover:text-primary transition-colors" />
          <span className="font-bold">Watchlist</span>
        </Button>
      </div>
    </section>
  );
};

export default MovieHero;
