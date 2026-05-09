import React, { useState } from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';

const filterOptions = [
  "Sort By", "Genre", "Actors", "Director", "Year", "Region", "Language"
];

const tabs = ["Popular", "Trending", "Latest"];

const MovieFilters = () => {
  const [activeTab, setActiveTab] = useState("Popular");

  return (
    <section className="mb-10 flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative w-full group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search for movies, actors, directors..."
          className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-base placeholder:text-muted-foreground"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {filter}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-bold text-foreground hover:bg-white/10 transition-all ml-auto">
          Reset Filters
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center p-1 bg-white/5 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab 
                ? 'bg-[#2A261A] text-white shadow-lg' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </section>
  );
};

export default MovieFilters;
