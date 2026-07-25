import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, ChevronDown, Check, UserPlus, MessageCircle, X, Sparkles, Hourglass, UserCheck } from 'lucide-react';
import useUserStore, { MOVIE_CATALOG, ACTOR_CATALOG } from '../store/useUserStore';
import { Button } from '@/components/ui/button';

// Mock list of community users with extended attributes (genres, actors, movies, profile type)
const COMMUNITY_USERS = [
  { name: "Sophia Bennett", handle: "@sophia_b", role: "Film enthusiast", genres: ["Sci-Fi", "Drama", "Thriller"], actors: ["Timothée Chalamet", "Zendaya", "Cillian Murphy"], movies: ["Dune: Part Two", "Oppenheimer", "Interstellar"], bio: "Lover of sci-fi epics and character dramas. Always dissecting screenplays.", followers: 1420, avatar: "/images/actor_1.png", isPrivate: true },
  { name: "Ethan Carter", handle: "@ethan_c", role: "Movie buff", genres: ["Action", "Sci-Fi", "Crime"], actors: ["Austin Butler", "Leonardo DiCaprio", "Christian Bale"], movies: ["The Dark Knight", "Inception", "Blade Runner"], bio: "Action movie collector and soundtrack collector. Big Christopher Nolan fan.", followers: 850, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Olivia Davis", handle: "@olivia_d", role: "Cinema lover", genres: ["Drama", "Crime", "History"], actors: ["Cillian Murphy", "Emma Stone", "Christian Bale"], movies: ["Oppenheimer", "The Godfather", "Citizen Kane"], bio: "Classic noir films and historical stories are my jam. Cinephile since childhood.", followers: 1040, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Liam Foster", handle: "@liam_f", role: "Avid watcher", genres: ["Comedy", "Romance", "Drama"], actors: ["Emma Stone", "Mark Ruffalo", "Zendaya"], movies: ["Poor Things", "The Holdovers", "Anatomy of a Fall"], bio: "Indie dramedies and romantic stories. I review every single movie I watch.", followers: 2310, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Ava Green", handle: "@ava_g", role: "Film critic", genres: ["Thriller", "Horror", "Crime"], actors: ["Christian Bale", "Leonardo DiCaprio", "Emma Stone"], movies: ["Fight Club", "Pulp Fiction", "Anatomy of a Fall"], bio: "Nothing beats a good psychological thriller or suspense. Horror lover.", followers: 3410, avatar: "/images/actor_1.png", isPrivate: true },
  { name: "Noah Harris", handle: "@noah_h", role: "Indie film fan", genres: ["Sci-Fi", "Adventure", "Action"], actors: ["Timothée Chalamet", "Zendaya", "Austin Butler"], movies: ["Dune: Part Two", "Blade Runner 2049", "The Creator"], bio: "Big screen spectacles and space operas. Amateur filmmaker.", followers: 980, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Isabella Jones", handle: "@isabella_j", role: "Classic movie lover", genres: ["History", "Drama", "Romance"], actors: ["Cillian Murphy", "Emma Stone", "Zendaya"], movies: ["Oppenheimer", "The Godfather", "Citizen Kane"], bio: "Historical dramas and period pieces. Enjoys old Hollywood classics.", followers: 1150, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Jackson King", handle: "@jackson_k", role: "Documentary enthusiast", genres: ["Crime", "Thriller", "Action"], actors: ["Leonardo DiCaprio", "Christian Bale", "Austin Butler"], movies: ["The Dark Knight", "Fight Club", "Pulp Fiction"], bio: "Fascinated by crime sagas, thrillers, and deep-dive investigative docs.", followers: 730, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Mia Lewis", handle: "@mia_l", role: "Foreign film aficionado", genres: ["Comedy", "Drama", "Romance"], actors: ["Emma Stone", "Mark Ruffalo", "Timothée Chalamet"], movies: ["Poor Things", "Anatomy of a Fall", "Parasite"], bio: "Feel-good movies and complex relationships. Exploring international cinema.", followers: 1670, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Lucas Morgan", handle: "@lucas_m", role: "Horror movie fan", genres: ["Horror", "Thriller", "Mystery"], actors: ["Christian Bale", "Mark Ruffalo", "Cillian Murphy"], movies: ["Fight Club", "Oppenheimer", "The Dark Knight"], bio: "Midnight movies and horror marathons. Slasher and psychological horror fan.", followers: 520, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Chloe Nelson", handle: "@chloe_n", role: "Sci-fi movie lover", genres: ["Sci-Fi", "Thriller", "Mystery"], actors: ["Timothée Chalamet", "Zendaya", "Leonardo DiCaprio"], movies: ["Blade Runner", "Inception", "2001: A Space Odyssey"], bio: "Sci-fi mysteries and cyberpunk aesthetics. Huge Philip K. Dick reader.", followers: 1290, avatar: "/images/actor_1.png", isPrivate: false },
  { name: "Owen Parker", handle: "@owen_p", role: "Comedy movie fan", genres: ["Comedy", "Action", "Adventure"], actors: ["Mark Ruffalo", "Austin Butler", "Zendaya"], movies: ["The Holdovers", "Dune: Part Two", "The Creator"], bio: "Love blockbuster action comedies and lighthearted stories. Popcorn movie lover.", followers: 880, avatar: "/images/actor_1.png", isPrivate: false }
];

const SUGGESTED_USERS = [
  { name: "Caleb Reed", handle: "@caleb_r", avatar: "/images/actor_1.png", genres: ["Action", "Thriller"], actors: ["Leonardo DiCaprio"], movies: ["Inception", "Fight Club"], bio: "Avid collector of high-stakes thriller screenplays.", followers: 420, role: "Action Fanatic", isPrivate: true },
  { name: "Emma Turner", handle: "@emma_t", avatar: "/images/actor_1.png", genres: ["Drama", "Romance"], actors: ["Timothée Chalamet"], movies: ["Dune: Part Two", "Poor Things"], bio: "Enjoying indie films and deep romance cinema.", followers: 310, role: "Dramatist", isPrivate: false },
  { name: "Daniel Walker", handle: "@daniel_w", avatar: "/images/actor_1.png", genres: ["Sci-Fi", "Adventure"], actors: ["Zendaya"], movies: ["Interstellar", "The Creator"], bio: "Exploring the boundary of sci-fi world-building.", followers: 190, role: "Future Seeker", isPrivate: false },
  { name: "Grace Young", handle: "@grace_y", avatar: "/images/actor_1.png", genres: ["Horror", "Mystery"], actors: ["Christian Bale"], movies: ["The Dark Knight", "Fight Club"], bio: "Psycho horror analyzer. Slasher expert.", followers: 580, role: "Horror Guru", isPrivate: true },
  { name: "Henry Adams", handle: "@henry_a", avatar: "/images/actor_1.png", genres: ["Comedy", "Drama"], actors: ["Emma Stone"], movies: ["The Holdovers", "Poor Things"], bio: "Lover of dark humour and coming of age classics.", followers: 260, role: "Humourist", isPrivate: false },
  { name: "Isabelle Baker", handle: "@isabelle_b", avatar: "/images/actor_1.png", genres: ["History", "Crime"], actors: ["Cillian Murphy"], movies: ["Oppenheimer", "The Godfather"], bio: "Period pieces and organized crime movies reviewer.", followers: 410, role: "Historian", isPrivate: false }
];

// Reusable Searchable Dropdown for filtering people
const PeopleFilterDropdown = ({ label, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); setSearch(''); }}
        className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-xs md:text-sm font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer min-w-[160px]"
      >
        <span className="truncate">{value === "All" ? `Filter by ${label}` : value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180 text-[#FACC15]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#121016]/95 border border-white/15 rounded-xl shadow-2xl z-50 p-2.5 backdrop-blur-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FACC15]/40 mb-2 placeholder:text-gray-600"
            autoFocus
          />
          <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            <button
              type="button"
              onClick={() => { onChange("All"); setIsOpen(false); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${value === "All" ? 'bg-[#FACC15] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
            >
              All {label}s
            </button>
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${value === opt ? 'bg-[#FACC15] text-black font-black' : 'text-gray-300 hover:bg-white/5'}`}
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

const People = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const following = useUserStore((state) => state.following) || [];
  const followRequests = useUserStore((state) => state.followRequests) || [];
  const toggleFollowUser = useUserStore((state) => state.toggleFollowUser);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedActor, setSelectedActor] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState("All");
  const [sortByMatch, setSortByMatch] = useState(true);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  // Dynamic values extraction
  const availableGenres = useMemo(() => {
    const genres = new Set();
    COMMUNITY_USERS.forEach(u => u.genres.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, []);

  const availableActors = useMemo(() => {
    const actors = new Set();
    COMMUNITY_USERS.forEach(u => u.actors.forEach(a => actors.add(a)));
    return Array.from(actors).sort();
  }, []);

  const availableMovies = useMemo(() => {
    const movies = new Set();
    COMMUNITY_USERS.forEach(u => u.movies.forEach(m => movies.add(m)));
    return Array.from(movies).sort();
  }, []);

  // Compute taste score based on: Genres (10% each), Actors (12% each), Movies (15% each)
  const calculateMatchScore = (member) => {
    if (!user) return 75; // guest baseline

    const userGenres = user.favoriteGenres || [];
    const userActors = user.favoriteActors || [];
    const userMovies = user.favoriteMovies || [];

    let genreMatches = 0;
    member.genres.forEach(g => {
      if (userGenres.some(ug => ug.toLowerCase() === g.toLowerCase())) genreMatches++;
    });

    let actorMatches = 0;
    member.actors.forEach(a => {
      if (userActors.some(ua => ua.toLowerCase() === a.toLowerCase())) actorMatches++;
    });

    let movieMatches = 0;
    member.movies.forEach(m => {
      if (userMovies.some(um => um.title.toLowerCase() === m.toLowerCase())) movieMatches++;
    });

    const calculated = 55 + (genreMatches * 10) + (actorMatches * 12) + (movieMatches * 15);
    return Math.min(calculated, 99);
  };

  // Build members list with dynamic match scores
  const processedMembers = useMemo(() => {
    return COMMUNITY_USERS.map(m => ({
      ...m,
      matchScore: calculateMatchScore(m)
    }));
  }, [user]);

  // Filter & sort members
  const filteredMembers = useMemo(() => {
    let result = processedMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenre === "All" || m.genres.includes(selectedGenre);
      const matchesActor = selectedActor === "All" || m.actors.includes(selectedActor);
      const matchesMovie = selectedMovie === "All" || m.movies.includes(selectedMovie);

      return matchesSearch && matchesGenre && matchesActor && matchesMovie;
    });

    if (sortByMatch) {
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [processedMembers, searchQuery, selectedGenre, selectedActor, selectedMovie, sortByMatch]);

  const handleMessageRedirect = (name) => {
    setSelectedProfileUser(null);
    navigate(`/messages?user=${name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">Cinephile Connections</h1>
          <p className="text-sm md:text-base text-gray-400">Search, filter, and connect with other users based on overlapping cinematic tastes.</p>
        </div>

        {/* Global User Search Bar */}
        <div className="mb-8 flex flex-col gap-6">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, handle, or bio..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-base placeholder:text-gray-600 text-white shadow-xl"
            />
          </div>

          {/* Search Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <PeopleFilterDropdown 
                label="Genre" 
                value={selectedGenre} 
                onChange={setSelectedGenre} 
                options={availableGenres} 
                placeholder="Search genres..." 
              />
              <PeopleFilterDropdown 
                label="Actor" 
                value={selectedActor} 
                onChange={setSelectedActor} 
                options={availableActors} 
                placeholder="Search actors..." 
              />
              <PeopleFilterDropdown 
                label="Movie" 
                value={selectedMovie} 
                onChange={setSelectedMovie} 
                options={availableMovies} 
                placeholder="Search movies..." 
              />

              {(selectedGenre !== "All" || selectedActor !== "All" || selectedMovie !== "All" || searchQuery !== "") && (
                <button
                  onClick={() => { setSelectedGenre("All"); setSelectedActor("All"); setSelectedMovie("All"); setSearchQuery(""); }}
                  className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortByMatch(!sortByMatch)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs md:text-sm font-black transition-all cursor-pointer ${
                sortByMatch 
                  ? 'bg-[#FACC15] text-black border-[#FACC15]' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Sort by Taste Match
            </button>
          </div>
        </div>

        {/* Similar Movie Taste Grid */}
        <h2 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FACC15] fill-[#FACC15]" />
          Users with Similar Taste
        </h2>
        
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {filteredMembers.map((member, idx) => {
              const isFollowing = following.includes(member.handle);
              const isRequested = followRequests.includes(member.handle);

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedProfileUser(member)}
                  className="flex flex-col group cursor-pointer bg-white/5 border border-white/10 hover:border-[#FACC15]/30 p-5 rounded-2xl transition-all duration-300 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FACC15]/5 rounded-bl-full blur-xl pointer-events-none group-hover:bg-[#FACC15]/10 transition-all"></div>
                  
                  {/* Photo frame */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5 border border-white/5 shrink-0">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                    
                    {/* Dynamic Match Score Tag */}
                    <div className="absolute bottom-2.5 right-2.5 bg-[#FACC15] text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      {member.matchScore}% Match
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-base leading-tight group-hover:text-[#FACC15] transition-colors mb-0.5">
                        {member.name}
                      </h3>
                      <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-2 block">{member.handle}</span>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-2 italic">"{member.bio}"</p>
                    </div>

                    <div className="flex items-center justify-between mt-5 border-t border-white/5 pt-4">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{member.role}</span>
                      {isFollowing ? (
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} /> Following
                        </span>
                      ) : isRequested ? (
                        <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-wider flex items-center gap-0.5">
                          <Hourglass className="w-3.5 h-3.5 animate-pulse" /> Requested
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#FACC15] font-black uppercase tracking-wider hover:underline">
                          View profile
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-16 rounded-3xl bg-white/5 border border-white/10 text-center max-w-lg mx-auto shadow-2xl mb-16">
            <span className="text-gray-500 text-sm font-semibold mb-2">No similar taste profiles found</span>
            <p className="text-xs text-gray-600 font-medium">Try clearing or shifting your filter parameters.</p>
          </div>
        )}

        {/* Suggested Connections */}
        <section className="border-t border-white/5 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Suggested Connections</h2>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Based on similar film collections</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {SUGGESTED_USERS.map((sUser, idx) => {
              const isFollowing = following.includes(sUser.handle);
              const isRequested = followRequests.includes(sUser.handle);

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedProfileUser(sUser)}
                  className="flex flex-col items-center p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer group transition-all"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[#FACC15] transition-all p-0.5 bg-white/5 shrink-0 relative">
                    <img src={sUser.avatar} alt={sUser.name} className="w-full h-full object-cover rounded-full" />
                    {(isFollowing || isRequested) && (
                      <div className="absolute -bottom-1 -right-1 bg-[#FACC15] text-black w-5 h-5 rounded-full flex items-center justify-center border border-background">
                        {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <Hourglass className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-[#FACC15] transition-colors text-center truncate w-full">
                    {sUser.name}
                  </span>
                  <span className="text-[9px] text-gray-500 font-medium tracking-wide mt-0.5">{sUser.handle}</span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* === GLASSMORPHIC PROFILE MODAL === */}
      {selectedProfileUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121016]/95 border border-white/15 w-full max-w-[480px] rounded-3xl p-6.5 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            
            <button 
              onClick={() => setSelectedProfileUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                <img src={selectedProfileUser.avatar} alt={selectedProfileUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="text-xl font-black text-white leading-tight tracking-tight">{selectedProfileUser.name}</h3>
                <span className="text-xs text-[#FACC15] font-extrabold tracking-wide mt-0.5">{selectedProfileUser.handle}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2.5">{selectedProfileUser.role}</span>
              </div>
            </div>

            {/* Taste Compatibility Score */}
            <div className="bg-white/5 rounded-2xl p-4.5 border border-white/5 mb-6 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FACC15] fill-current" />
                  Taste Compatibility
                </span>
                <span className="text-sm font-black text-[#FACC15]">{selectedProfileUser.matchScore || calculateMatchScore(selectedProfileUser)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-[#FACC15]" 
                  style={{ width: `${selectedProfileUser.matchScore || calculateMatchScore(selectedProfileUser)}%` }}
                ></div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-300 leading-relaxed font-medium mb-6 italic">
              "{selectedProfileUser.bio}"
            </p>

            {/* Taste details */}
            <div className="flex flex-col gap-4 border-t border-b border-white/5 py-5.5 mb-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Favorite Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.genres.map(g => (
                    <span key={g} className="text-[10px] font-extrabold bg-white/5 border border-white/5 px-2.5 py-1 rounded text-white">{g}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Favorite Actors</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.actors.map(a => (
                    <span key={a} className="text-[10px] font-extrabold bg-[#FACC15]/10 border border-[#FACC15]/20 px-2.5 py-1 rounded text-[#FACC15]">{a}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Favorite Movies</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.movies.map(m => (
                    <span key={m} className="text-[10px] font-extrabold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded text-blue-400">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => toggleFollowUser(selectedProfileUser.handle)}
                className={`flex-1 font-black text-xs py-4.5 rounded-xl cursor-pointer transition-all border ${
                  following.includes(selectedProfileUser.handle)
                    ? 'bg-[#FACC15]/10 border-[#FACC15]/40 text-[#FACC15]'
                    : followRequests.includes(selectedProfileUser.handle)
                      ? 'bg-yellow-500/5 border-yellow-500/30 text-yellow-500/80'
                      : 'bg-white text-black hover:bg-gray-200 border-white'
                }`}
              >
                {following.includes(selectedProfileUser.handle) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" strokeWidth={3} />
                    Following
                  </>
                ) : followRequests.includes(selectedProfileUser.handle) ? (
                  <>
                    <Hourglass className="w-4 h-4 mr-2 animate-pulse" />
                    Requested
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {selectedProfileUser.isPrivate ? "Request to Follow" : "Follow"}
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleMessageRedirect(selectedProfileUser.name)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs py-4.5 rounded-xl cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default People;
