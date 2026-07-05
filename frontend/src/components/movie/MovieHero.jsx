import React, { useState } from 'react';
import { Bookmark, Award, HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MovieHero = ({ movie }) => {
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  return (
    <section className="flex flex-col lg:flex-row gap-10 mb-16">
      {/* Left: Poster with clean border frame */}
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl shadow-2xl">
          <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5">
            <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Right: Layout Split */}
      <div className="flex-1 flex flex-col pt-2">
        {/* Title Block */}
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 tracking-tight">
          {movie.title} ({movie.year})
        </h1>
        <div className="text-xs text-gray-500 font-black uppercase tracking-widest mb-6">
          {movie.pgRating}
        </div>

        {/* Scores */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-3 rounded-xl min-w-[90px] text-center shadow-lg">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">CL Score</span>
            <span className="text-2xl font-black text-[#FACC15]">{movie.clScore}</span>
          </div>
          <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-3 rounded-xl min-w-[90px] text-center shadow-lg">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">User Score</span>
            <span className="text-2xl font-black text-[#FACC15]">{movie.userScore}</span>
          </div>
        </div>

        {/* Specs List */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 border-b border-white/5 pb-8">
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Genre</span>
            <span className="text-white font-bold text-sm">{movie.genre}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Runtime</span>
            <span className="text-white font-bold text-sm">{movie.runtime}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Release</span>
            <span className="text-white font-bold text-sm">{movie.releaseDate}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Awards</span>
            <span className="text-white font-bold text-sm">{movie.awards}</span>
          </div>
        </div>

        {/* Overview & Crew Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview description */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-lg font-black text-white tracking-tight">Overview</h3>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
              {showFullOverview ? movie.description : `${movie.description.slice(0, 200)}...`}
            </p>
            <button 
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="text-[#FACC15] hover:underline font-bold text-xs w-fit cursor-pointer"
            >
              {showFullOverview ? 'Read Less' : 'Read More'}
            </button>
          </div>

          {/* Crew & Awards Logos */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Director(s)</span>
              <span className="text-white font-bold text-sm">{movie.director}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Writer(s)</span>
              <span className="text-white font-bold text-sm">{movie.writer}</span>
            </div>

            {/* Awards & Recognition Badges */}
            <div className="flex flex-col gap-3">
              <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Awards & Recognition</span>
              <div className="flex items-center gap-2">
                <div title="Academy Award" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[#FACC15] hover:bg-white/10 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div title="Golden Globe" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-emerald-400 hover:bg-white/10 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
                <div title="BAFTA" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-blue-400 hover:bg-white/10 transition-colors">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watchlist Toggle */}
        <Button 
          onClick={() => setInWatchlist(!inWatchlist)}
          className={`w-fit mt-8 font-black text-xs px-6 py-4 rounded-xl transition-all shadow-lg ${
            inWatchlist 
              ? 'bg-white/10 border border-white/20 text-white' 
              : 'bg-[#FACC15] text-black hover:bg-[#E2B710]'
          }`}
        >
          <Bookmark className="w-4 h-4 mr-2 fill-current" />
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>
    </section>
  );
};

export default MovieHero;
