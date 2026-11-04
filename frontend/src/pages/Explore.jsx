import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useUserStore from '../store/useUserStore';
import { Star, Clapperboard, ChevronDown, X, ArrowUpDown, Search } from 'lucide-react';

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
    return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="flex items-center justify-between gap-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-xs md:text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all cursor-pointer min-w-[150px] shadow-md"
      >
        <span className="truncate">{value === "All" ? `Select ${label}` : value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#F5BF26]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#121016]/95 border border-white/15 rounded-xl shadow-2xl z-50 p-2.5 backdrop-blur-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#F5BF26]/40 mb-2 placeholder:text-gray-600"
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            <button
              type="button"
              onClick={() => { onChange("All"); setIsOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${value === "All" ? 'bg-[#F5BF26] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
            >
              All {label}s
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${value === opt ? 'bg-[#F5BF26] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchCatalog = useUserStore((state) => state.fetchCatalog);
  const fetchCatalogFilters = useUserStore((state) => state.fetchCatalogFilters);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState({ genres: [], years: [] });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCatalogFilters()
      .then((data) => setFilterOptions({ genres: data.genres || [], years: data.years || [] }))
      .catch(() => setFilterOptions({ genres: [], years: [] }));
  }, [fetchCatalogFilters]);

  useEffect(() => {
    const sort = sortBy === "Alpha" ? "alpha" : sortBy === "Rating" ? "rating" : "year";
    const timer = setTimeout(() => {
      fetchCatalog({
        q: searchQuery,
        genre: selectedGenre === "All" ? "" : selectedGenre,
        year: selectedYear === "All" ? "" : selectedYear,
        sort,
        limit: 60
      })
        .then((data) => {
          setMovies(data.movies || []);
          setTotal(data.total || 0);
        })
        .catch(() => {
          setMovies([]);
          setTotal(0);
        });
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedGenre, selectedYear, sortBy, fetchCatalog]);

  const handleReset = () => {
    setSelectedGenre("All");
    setSelectedYear("All");
    setSearchQuery("");
    setSortBy("Popular");
  };

  const hasActiveFilters = selectedGenre !== "All" || selectedYear !== "All" || searchQuery !== "" || sortBy !== "Popular";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight text-center">Explore Cinema</h1>
          <p className="text-sm text-gray-400 mt-2 text-center">Live catalog from the ratings dataset — not demo posters.</p>
        </div>

        <div className="relative w-full group mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#F5BF26] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies by title..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#F5BF26]/40 focus:bg-white/10 transition-all text-base placeholder:text-gray-600 text-white shadow-2xl"
          />
        </div>

        <section className="mb-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <SearchableSelect label="Genre" value={selectedGenre} onChange={setSelectedGenre} options={filterOptions.genres} placeholder="Search genres..." />
            <SearchableSelect label="Release Year" value={selectedYear} onChange={setSelectedYear} options={filterOptions.years} placeholder="Search release years..." />
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer flex items-center gap-1.5">
                Reset Filters <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-2">
            <span className="text-xs md:text-sm font-medium text-gray-400">
              Showing {movies.length} of {total} {total === 1 ? "result" : "results"}
            </span>
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-3.5 w-4 h-4 text-[#F5BF26] pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white pl-10 pr-8 py-2.5 rounded-lg focus:outline-none cursor-pointer"
              >
                <option value="Popular" className="bg-[#121016]">Sort by: Year</option>
                <option value="Rating" className="bg-[#121016]">Sort by: CL Score</option>
                <option value="Year" className="bg-[#121016]">Sort by: Release Year</option>
                <option value="Alpha" className="bg-[#121016]">Sort by: Alphabetical</option>
              </select>
              <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </section>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
            {movies.map((item) => (
              <div key={item.id} className="flex flex-col group cursor-pointer" onClick={() => navigate(`/movie/${item.id}`)}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-white/5 border border-white/10 shadow-2xl group-hover:border-[#F5BF26]/40 transition-all">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm group-hover:text-[#F5BF26] truncate flex-1">{item.title}</h3>
                  {item.clScore ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#F5BF26] text-[#F5BF26]" />
                      <span className="text-xs font-black text-gray-200">{item.clScore}</span>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 font-medium">{item.year} • {item.genre || "Film"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-16 rounded-3xl bg-white/5 border border-white/10 text-center max-w-lg mx-auto">
            <Clapperboard className="w-12 h-12 text-[#F5BF26] mb-6" strokeWidth={1.5} />
            <h3 className="text-lg font-black text-white mb-2">No results found</h3>
            <p className="text-xs text-gray-400">Try a different title, genre, or year from the ratings catalog.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
