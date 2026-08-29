import React from 'react';
import { ChevronDown, X, ArrowUpDown } from 'lucide-react';

const MovieFilters = ({
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedDirector,
  setSelectedDirector,
  sortBy,
  setSortBy,
  totalCount
}) => {
  const genres = ["Sci-Fi", "Drama", "Comedy", "Thriller", "Action", "Crime", "Horror", "Romance", "Adventure", "History", "Mystery"];
  
  const directors = [
    "Denis Villeneuve",
    "Christopher Nolan",
    "Yorgos Lanthimos",
    "Alexander Payne",
    "Justine Triet",
    "Francis Ford Coppola",
    "Quentin Tarantino",
    "Stanley Kubrick",
    "Ridley Scott",
    "Orson Welles",
    "Gareth Edwards",
    "Bong Joon Ho",
    "David Fincher"
  ];

  const handleReset = () => {
    setSelectedGenre("All");
    setSelectedYear("All");
    setSelectedDirector("All");
    setSortBy("Popular");
  };

  return (
    <section className="mb-10 flex flex-col gap-6">
      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre Selector */}
        <div className="relative flex items-center">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-[#F5BF26]/40 cursor-pointer"
          >
            <option value="All" className="bg-background text-foreground">Select Genre</option>
            {genres.map(g => (
              <option key={g} value={g} className="bg-background text-foreground">{g}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Selected Genre Tag (if active) */}
        {selectedGenre !== "All" && (
          <div 
            onClick={() => setSelectedGenre("All")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F5BF26] text-black text-sm font-black shadow-md cursor-pointer hover:bg-[#F5BF26] transition-all"
          >
            {selectedGenre}
            <X className="w-4 h-4 text-black" strokeWidth={3} />
          </div>
        )}

        {/* Year Filter */}
        <div className="relative flex items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-[#F5BF26]/40 cursor-pointer"
          >
            <option value="All" className="bg-background text-foreground">Select Year</option>
            <option value="2024" className="bg-background text-foreground">2024</option>
            <option value="2023" className="bg-background text-foreground">2023</option>
            <option value="2010s" className="bg-background text-foreground">2010s</option>
            <option value="2000s" className="bg-background text-foreground">2000s</option>
            <option value="90s" className="bg-background text-foreground">1990s</option>
            <option value="Classic" className="bg-background text-foreground">Classics (&lt;1990)</option>
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Director Filter */}
        <div className="relative flex items-center">
          <select
            value={selectedDirector}
            onChange={(e) => setSelectedDirector(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white px-4 py-2.5 pr-8 rounded-lg focus:outline-none focus:border-[#F5BF26]/40 cursor-pointer max-w-[160px]"
          >
            <option value="All" className="bg-background text-foreground">Select Director</option>
            {directors.map(d => (
              <option key={d} value={d} className="bg-background text-foreground">{d}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Reset button */}
        {(selectedGenre !== "All" || selectedYear !== "All" || selectedDirector !== "All" || sortBy !== "Popular") && (
          <button 
            onClick={handleReset}
            className="text-sm font-bold text-gray-400 hover:text-white transition-all ml-4 cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results Count & Sort Dropdown */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
        <span className="text-xs md:text-sm font-medium text-gray-400">
          Showing {totalCount} {totalCount === 1 ? 'result' : 'results'}
        </span>

        {/* Sort Select */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-[#F5BF26] pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white pl-10 pr-8 py-2.5 rounded-lg focus:outline-none focus:border-[#F5BF26]/40 cursor-pointer"
          >
            <option value="Popular" className="bg-background text-foreground">Sort by: Popularity</option>
            <option value="Rating" className="bg-background text-foreground">Sort by: Rating</option>
            <option value="Year" className="bg-background text-foreground">Sort by: Release Year</option>
            <option value="Alpha" className="bg-background text-foreground">Sort by: Alphabetical</option>
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default MovieFilters;
