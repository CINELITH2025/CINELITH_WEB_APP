import React from 'react';
import { ChevronDown, X, ArrowUpDown } from 'lucide-react';

const MovieFilters = () => {
  return (
    <section className="mb-10 flex flex-col gap-6">
      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre Filter */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
          Genre
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Selected Genre Tag */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FACC15] text-black text-sm font-black shadow-md cursor-pointer hover:bg-[#E2B710] transition-all">
          Action
          <X className="w-4 h-4 text-black" strokeWidth={3} />
        </div>

        {/* Year Filter */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
          Year
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Director Filter */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
          Director
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Actors Filter */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
          Actors
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Language Filter */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
          Language
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Reset button - plain style matching Mockup 1 */}
        <button className="text-sm font-bold text-gray-400 hover:text-white transition-all ml-4 cursor-pointer">
          Reset Filters
        </button>
      </div>

      {/* Results Count & Sort Dropdown */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
        <span className="text-sm font-medium text-gray-400">
          Showing 24 results
        </span>

        {/* Sort Select */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer">
          <ArrowUpDown className="w-4 h-4 text-[#FACC15]" />
          Sort by: Popular
        </button>
      </div>
    </section>
  );
};

export default MovieFilters;
