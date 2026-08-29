import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { MOVIE_CATALOG } from '../store/useUserStore';
import { Star, Clapperboard, ChevronDown, X, ArrowUpDown, Search } from 'lucide-react';

// Reusable custom Searchable Dropdown Selector (Combobox)
const SearchableSelect = ({ label, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="flex items-center justify-between gap-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-xs md:text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer min-w-[150px] shadow-md"
      >
        <span className="truncate">{value === "All" ? `Select ${label}` : value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#EAB513]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#121016]/95 border border-white/15 rounded-xl shadow-2xl z-50 p-2.5 animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#EAB513]/40 mb-2 placeholder:text-gray-600"
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            <button
              type="button"
              onClick={() => { onChange("All"); setIsOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${value === "All" ? 'bg-[#EAB513] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
            >
              All {label}s
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${value === opt ? 'bg-[#EAB513] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
              >
                {opt}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <span className="text-[10px] text-gray-600 text-center py-2 font-medium">No options found</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Explore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("movie"); // "movie" or "tv"
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedActor, setSelectedActor] = useState("All");
  const [selectedDirector, setSelectedDirector] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extract unique options dynamically from central catalog
  const filterOptions = useMemo(() => {
    const list = MOVIE_CATALOG.filter(m => m.type === activeTab);
    
    const genres = new Set();
    const actors = new Set();
    const directors = new Set();
    const years = new Set();
    const regions = new Set();
    const languages = new Set();

    list.forEach(m => {
      if (m.genre) m.genre.split(',').forEach(g => genres.add(g.trim()));
      if (m.cast) m.cast.forEach(a => actors.add(a));
      if (m.director) directors.add(m.director);
      if (m.year) years.add(m.year);
      if (m.region) regions.add(m.region);
      if (m.language) languages.add(m.language);
    });

    return {
      genres: Array.from(genres).sort(),
      actors: Array.from(actors).sort(),
      directors: Array.from(directors).sort(),
      years: Array.from(years).sort((a, b) => b - a),
      regions: Array.from(regions).sort(),
      languages: Array.from(languages).sort()
    };
  }, [activeTab]);

  // Handle Tab Switch & Reset Filters
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGenre("All");
    setSelectedActor("All");
    setSelectedDirector("All");
    setSelectedYear("All");
    setSelectedRegion("All");
    setSelectedLanguage("All");
  };

  const handleReset = () => {
    setSelectedGenre("All");
    setSelectedActor("All");
    setSelectedDirector("All");
    setSelectedYear("All");
    setSelectedRegion("All");
    setSelectedLanguage("All");
    setSearchQuery("");
    setSortBy("Popular");
  };

  // Filter & Sort dynamic computation
  const filteredAndSortedMedia = useMemo(() => {
    let result = MOVIE_CATALOG.filter(item => {
      if (item.type !== activeTab) return false;

      const matchesGenre = selectedGenre === "All" || item.genre.toLowerCase().includes(selectedGenre.toLowerCase());
      const matchesActor = selectedActor === "All" || (item.cast && item.cast.includes(selectedActor));
      const matchesDirector = selectedDirector === "All" || item.director === selectedDirector;
      const matchesYear = selectedYear === "All" || item.year === selectedYear;
      const matchesRegion = selectedRegion === "All" || item.region === selectedRegion;
      const matchesLanguage = selectedLanguage === "All" || item.language === selectedLanguage;

      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.director && item.director.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            item.genre.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGenre && matchesActor && matchesDirector && matchesYear && matchesRegion && matchesLanguage && matchesSearch;
    });

    if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "Year") {
      result.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    } else if (sortBy === "Alpha") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [activeTab, selectedGenre, selectedActor, selectedDirector, selectedYear, selectedRegion, selectedLanguage, searchQuery, sortBy]);

  const hasActiveFilters = selectedGenre !== "All" || selectedActor !== "All" || selectedDirector !== "All" || selectedYear !== "All" || selectedRegion !== "All" || selectedLanguage !== "All" || searchQuery !== "" || sortBy !== "Popular";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        
        {/* Unified Tab Switcher Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white/5 border border-white/10 p-1 rounded-2xl flex gap-1 mb-6 shadow-inner">
            <button
              onClick={() => handleTabChange("movie")}
              className={`px-8 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === "movie" ? 'bg-[#EAB513] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Movies
            </button>
            <button
              onClick={() => handleTabChange("tv")}
              className={`px-8 py-3 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === "tv" ? 'bg-[#EAB513] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              TV Shows
            </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center">
            Explore {activeTab === "movie" ? "Cinema" : "Television"}
          </h1>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Discover {activeTab === "movie" ? "films" : "shows"} by mood, genre, cast, language, and origin.
          </p>
        </div>

        {/* Global Search Box */}
        <div className="relative w-full group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#EAB513] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "movie" ? "movies" : "TV shows"} by title, director, or tags...`}
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-base placeholder:text-gray-600 text-white shadow-2xl"
          />
        </div>

        {/* Dynamic Filters Row */}
        <section className="mb-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <SearchableSelect 
              label="Genre" 
              value={selectedGenre} 
              onChange={setSelectedGenre} 
              options={filterOptions.genres} 
              placeholder="Search genres..." 
            />

            <SearchableSelect 
              label="Actor" 
              value={selectedActor} 
              onChange={setSelectedActor} 
              options={filterOptions.actors} 
              placeholder="Search actors..." 
            />

            <SearchableSelect 
              label={activeTab === "movie" ? "Director" : "Creator"} 
              value={selectedDirector} 
              onChange={setSelectedDirector} 
              options={filterOptions.directors} 
              placeholder="Search directors..." 
            />

            <SearchableSelect 
              label="Release Year" 
              value={selectedYear} 
              onChange={setSelectedYear} 
              options={filterOptions.years} 
              placeholder="Search release years..." 
            />

            <SearchableSelect 
              label="Region" 
              value={selectedRegion} 
              onChange={setSelectedRegion} 
              options={filterOptions.regions} 
              placeholder="Search regions..." 
            />

            <SearchableSelect 
              label="Language" 
              value={selectedLanguage} 
              onChange={setSelectedLanguage} 
              options={filterOptions.languages} 
              placeholder="Search languages..." 
            />

            {hasActiveFilters && (
              <button 
                onClick={handleReset}
                className="text-xs font-bold text-gray-400 hover:text-white transition-all ml-3 cursor-pointer flex items-center gap-1.5"
              >
                Reset Filters
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Result Count and Sort controls */}
          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
            <span className="text-xs md:text-sm font-medium text-gray-400">
              Showing {filteredAndSortedMedia.length} {filteredAndSortedMedia.length === 1 ? 'result' : 'results'}
            </span>

            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-[#EAB513] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white pl-10 pr-8 py-2.5 rounded-lg focus:outline-none focus:border-[#EAB513]/40 cursor-pointer shadow-md"
              >
                <option value="Popular" className="bg-[#121016] text-white">Sort by: Popularity</option>
                <option value="Rating" className="bg-[#121016] text-white">Sort by: Rating</option>
                <option value="Year" className="bg-[#121016] text-white">Sort by: Release Year</option>
                <option value="Alpha" className="bg-[#121016] text-white">Sort by: Alphabetical</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Media Results Grid */}
        {filteredAndSortedMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
            {filteredAndSortedMedia.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col group cursor-pointer"
                onClick={() => navigate(`/movie/${item.id}`)}
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-white/5 border border-white/10 shadow-2xl group-hover:border-[#EAB513]/40 transition-all duration-300">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                    <p className="text-white text-xs font-bold border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                      View Details
                    </p>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm md:text-[15px] group-hover:text-[#EAB513] transition-colors leading-tight truncate flex-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#EAB513] text-[#EAB513]" />
                    <span className="text-xs font-black text-gray-200">{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium">
                  {item.year} • {item.genre}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-16 rounded-3xl bg-white/5 border border-white/10 text-center max-w-lg mx-auto shadow-2xl">
            <div className="p-5 bg-white/5 rounded-2xl mb-6 border border-white/5 shadow-inner">
              <Clapperboard className="w-12 h-12 text-[#EAB513]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-black text-white mb-2">No results found</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xs font-medium">
              We couldn't find any {activeTab === "movie" ? "movies" : "TV shows"} matching those criteria. Try widening your filters.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
