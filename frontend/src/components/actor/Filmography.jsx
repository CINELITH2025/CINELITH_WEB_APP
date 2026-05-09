import React, { useState } from 'react';

const tabs = ["All", "Movies", "Series", "Upcoming"];

const Filmography = ({ movies }) => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <section className="my-12 px-2">
      <h2 className="text-2xl font-bold text-foreground mb-6">Filmography</h2>
      
      {/* Tabs */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              activeTab === tab 
                ? 'bg-[#3E3C36] text-white border border-transparent' 
                : 'bg-transparent text-muted-foreground border border-white/10 hover:border-white/30 hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie, idx) => (
          <div key={idx} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/5">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="font-bold text-foreground text-sm md:text-base line-clamp-1">{movie.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              {movie.year} • {movie.views}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Filmography;
