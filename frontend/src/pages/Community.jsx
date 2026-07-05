import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ChevronDown, Check, UserPlus, MessageCircle, X, Sparkles } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import { Button } from '@/components/ui/button';

// Detailed community member preferences for dynamic taste matching computations
const COMMUNITY_USERS = [
  { name: "Sophia Bennett", handle: "@sophia_b", role: "Film enthusiast", genres: ["Sci-Fi", "Drama", "Thriller"], actors: ["Timothée Chalamet", "Zendaya", "Cillian Murphy"], bio: "Lover of sci-fi epics and character dramas. Always dissecting screenplays.", followers: 1420, avatar: "/images/actor_1.png" },
  { name: "Ethan Carter", handle: "@ethan_c", role: "Movie buff", genres: ["Action", "Sci-Fi", "Crime"], actors: ["Austin Butler", "Leonardo DiCaprio", "Christian Bale"], bio: "Action movie collector and soundtrack collector. Big Christopher Nolan fan.", followers: 850, avatar: "/images/actor_1.png" },
  { name: "Olivia Davis", handle: "@olivia_d", role: "Cinema lover", genres: ["Drama", "Crime", "History"], actors: ["Cillian Murphy", "Emma Stone", "Christian Bale"], bio: "Classic noir films and historical stories are my jam. Cinephile since childhood.", followers: 1040, avatar: "/images/actor_1.png" },
  { name: "Liam Foster", handle: "@liam_f", role: "Avid watcher", genres: ["Comedy", "Romance", "Drama"], actors: ["Emma Stone", "Mark Ruffalo", "Zendaya"], bio: "Indie dramedies and romantic stories. I review every single movie I watch.", followers: 2310, avatar: "/images/actor_1.png" },
  { name: "Ava Green", handle: "@ava_g", role: "Film critic", genres: ["Thriller", "Horror", "Crime"], actors: ["Christian Bale", "Leonardo DiCaprio", "Emma Stone"], bio: "Nothing beats a good psychological thriller or suspense. Horror lover.", followers: 3410, avatar: "/images/actor_1.png" },
  { name: "Noah Harris", handle: "@noah_h", role: "Indie film fan", genres: ["Sci-Fi", "Adventure", "Action"], actors: ["Timothée Chalamet", "Zendaya", "Austin Butler"], bio: "Big screen spectacles and space operas. Amateur filmmaker.", followers: 980, avatar: "/images/actor_1.png" },
  { name: "Isabella Jones", handle: "@isabella_j", role: "Classic movie lover", genres: ["History", "Drama", "Romance"], actors: ["Cillian Murphy", "Emma Stone", "Zendaya"], bio: "Historical dramas and period pieces. Enjoys old Hollywood classics.", followers: 1150, avatar: "/images/actor_1.png" },
  { name: "Jackson King", handle: "@jackson_k", role: "Documentary enthusiast", genres: ["Crime", "Thriller", "Action"], actors: ["Leonardo DiCaprio", "Christian Bale", "Austin Butler"], bio: "Fascinated by crime sagas, thrillers, and deep-dive investigative docs.", followers: 730, avatar: "/images/actor_1.png" },
  { name: "Mia Lewis", handle: "@mia_l", role: "Foreign film aficionado", genres: ["Comedy", "Drama", "Romance"], actors: ["Emma Stone", "Mark Ruffalo", "Timothée Chalamet"], bio: "Feel-good movies and complex relationships. Exploring international cinema.", followers: 1670, avatar: "/images/actor_1.png" },
  { name: "Lucas Morgan", handle: "@lucas_m", role: "Horror movie fan", genres: ["Horror", "Thriller", "Mystery"], actors: ["Christian Bale", "Mark Ruffalo", "Cillian Murphy"], bio: "Midnight movies and horror marathons. Slasher and psychological horror fan.", followers: 520, avatar: "/images/actor_1.png" },
  { name: "Chloe Nelson", handle: "@chloe_n", role: "Sci-fi movie lover", genres: ["Sci-Fi", "Thriller", "Mystery"], actors: ["Timothée Chalamet", "Zendaya", "Leonardo DiCaprio"], bio: "Sci-fi mysteries and cyberpunk aesthetics. Huge Philip K. Dick reader.", followers: 1290, avatar: "/images/actor_1.png" },
  { name: "Owen Parker", handle: "@owen_p", role: "Comedy movie fan", genres: ["Comedy", "Action", "Adventure"], actors: ["Mark Ruffalo", "Austin Butler", "Zendaya"], bio: "Love blockbuster action comedies and lighthearted stories. Popcorn movie lover.", followers: 880, avatar: "/images/actor_1.png" }
];

const SUGGESTED_USERS = [
  { name: "Caleb Reed", handle: "@caleb_r", avatar: "/images/actor_1.png", genres: ["Action", "Thriller"], actors: ["Leonardo DiCaprio"] },
  { name: "Emma Turner", handle: "@emma_t", avatar: "/images/actor_1.png", genres: ["Drama", "Romance"], actors: ["Timothée Chalamet"] },
  { name: "Daniel Walker", handle: "@daniel_w", avatar: "/images/actor_1.png", genres: ["Sci-Fi", "Adventure"], actors: ["Zendaya"] },
  { name: "Grace Young", handle: "@grace_y", avatar: "/images/actor_1.png", genres: ["Horror", "Mystery"], actors: ["Christian Bale"] },
  { name: "Henry Adams", handle: "@henry_a", avatar: "/images/actor_1.png", genres: ["Comedy", "Drama"], actors: ["Emma Stone"] },
  { name: "Isabelle Baker", handle: "@isabelle_b", avatar: "/images/actor_1.png", genres: ["History", "Crime"], actors: ["Cillian Murphy"] }
];

const Community = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const following = useUserStore((state) => state.following) || [];
  const toggleFollowUser = useUserStore((state) => state.toggleFollowUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState("All");
  const [selectedActorFilter, setSelectedActorFilter] = useState("All");
  const [sortByMatch, setSortByMatch] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState(null);

  // Available filter choices
  const availableGenres = ["All", "Sci-Fi", "Drama", "Thriller", "Action", "Crime", "Comedy", "Horror", "Romance", "History"];
  const availableActors = ["All", "Timothée Chalamet", "Zendaya", "Cillian Murphy", "Austin Butler", "Leonardo DiCaprio", "Christian Bale", "Emma Stone", "Mark Ruffalo"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute Taste Match score dynamically for a member based on overlap with current user onboarding choices
  const calculateMatchScore = (member) => {
    if (!user) return 75; // baseline fallback for guests

    const userGenres = user.favoriteGenres || [];
    const userActors = user.favoriteActors || [];

    let genreMatches = 0;
    member.genres.forEach(g => {
      if (userGenres.some(ug => ug.toLowerCase() === g.toLowerCase())) genreMatches++;
    });

    let actorMatches = 0;
    member.actors.forEach(a => {
      if (userActors.some(ua => ua.toLowerCase() === a.toLowerCase())) actorMatches++;
    });

    // Score: 60% base + 10% per genre + 12% per actor. Cap at 99%.
    const calculated = 60 + (genreMatches * 10) + (actorMatches * 12);
    return Math.min(calculated, 99);
  };

  // Compile full user list with match percentage
  const processedMembers = useMemo(() => {
    return COMMUNITY_USERS.map(m => ({
      ...m,
      matchScore: calculateMatchScore(m)
    }));
  }, [user]);

  // Filter and Sort members list
  const filteredAndSortedMembers = useMemo(() => {
    let result = processedMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenreFilter === "All" || 
                           m.genres.some(g => g.toLowerCase() === selectedGenreFilter.toLowerCase());

      const matchesActor = selectedActorFilter === "All" || 
                           m.actors.some(a => a.toLowerCase() === selectedActorFilter.toLowerCase());

      return matchesSearch && matchesGenre && matchesActor;
    });

    if (sortByMatch) {
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  }, [processedMembers, searchQuery, selectedGenreFilter, selectedActorFilter, sortByMatch]);

  const handleMessageRedirect = (name) => {
    setSelectedProfileUser(null);
    navigate(`/messages?user=${name}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        
        {/* Intro */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">Cinephile Community</h1>
          <p className="text-sm md:text-base text-gray-400">Discover and connect with movie lovers sharing your cinematic taste.</p>
        </div>

        {/* Search & Filters Row */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, bio, or taste..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-base placeholder:text-gray-600 text-white"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Genre Filter */}
              <div className="relative flex items-center">
                <select
                  value={selectedGenreFilter}
                  onChange={(e) => setSelectedGenreFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white px-4 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-[#FACC15]/40 cursor-pointer"
                >
                  {availableGenres.map(g => (
                    <option key={g} value={g} className="bg-background text-foreground">{g} Genre</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Actor Filter */}
              <div className="relative flex items-center">
                <select
                  value={selectedActorFilter}
                  onChange={(e) => setSelectedActorFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 text-xs md:text-sm font-bold text-white px-4 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-[#FACC15]/40 cursor-pointer"
                >
                  {availableActors.map(a => (
                    <option key={a} value={a} className="bg-background text-foreground">{a} Star</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
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
              <Sparkles className="w-4 h-4" />
              Sort by Taste Match
            </button>
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-20">
          {filteredAndSortedMembers.map((member, idx) => {
            const isFollowingMember = following.includes(member.handle);
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedProfileUser(member)}
                className="flex flex-col group cursor-pointer bg-white/5 border border-white/10 hover:border-[#FACC15]/30 p-5 rounded-2xl transition-all duration-300 shadow-xl"
              >
                {/* Photo frame */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-white/5 border border-white/5">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  
                  {/* Dynamic Match Score Tag */}
                  <div className="absolute bottom-2.5 right-2.5 bg-[#FACC15] text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    {member.matchScore}% Match
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-extrabold text-white text-sm md:text-base leading-tight group-hover:text-[#FACC15] transition-colors mb-0.5">
                    {member.name}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-bold tracking-wider mb-2">{member.handle}</span>
                  <p className="text-xs text-gray-400 leading-normal font-medium line-clamp-2">{member.bio}</p>

                  <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4.5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{member.role}</span>
                    {isFollowingMember && (
                      <span className="text-[10px] font-black text-[#FACC15] uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} /> Followed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Connections */}
        <section className="border-t border-white/5 pt-16">
          <h2 className="text-xl md:text-2xl font-black text-white mb-10 tracking-tight">Suggested Connections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {SUGGESTED_USERS.map((sUser, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedProfileUser({
                  name: sUser.name,
                  handle: sUser.handle,
                  avatar: sUser.avatar,
                  genres: sUser.genres,
                  actors: sUser.actors,
                  role: "Taste Match Suggested",
                  bio: "Cinephile exploring film lists and discussing comments.",
                  followers: 430
                })}
                className="flex flex-col items-center p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer group transition-all"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[#FACC15] transition-all p-0.5 bg-white/5 shrink-0">
                  <img src={sUser.avatar} alt={sUser.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-[#FACC15] transition-colors text-center truncate w-full">
                  {sUser.name}
                </span>
                <span className="text-[9px] text-gray-500 font-medium tracking-wide mt-0.5">{sUser.handle}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* === GLASSMORPHIC PROFILE MODAL === */}
      {selectedProfileUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121016]/95 border border-white/15 w-full max-w-[480px] rounded-3xl p-6.5 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-left">
            {/* Close */}
            <button 
              onClick={() => setSelectedProfileUser(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header Details */}
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

            {/* Match score bar */}
            <div className="bg-white/5 rounded-2xl p-4.5 border border-white/5 mb-6 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FACC15] fill-current" />
                  Taste Compatibility
                </span>
                <span className="text-sm font-black text-[#FACC15]">{calculateMatchScore(selectedProfileUser)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-[#FACC15]" 
                  style={{ width: `${calculateMatchScore(selectedProfileUser)}%` }}
                ></div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-300 leading-relaxed font-medium mb-6 italic">
              "{selectedProfileUser.bio}"
            </p>

            {/* Favorites details */}
            <div className="flex flex-col gap-4 border-t border-b border-white/5 py-5.5 mb-6">
              {/* Genres */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Favorite Genres</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.genres.map(g => (
                    <span key={g} className="text-[10px] font-extrabold bg-white/5 border border-white/5 px-2.5 py-1 rounded text-white">{g}</span>
                  ))}
                </div>
              </div>
              {/* Actors */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Favorite Actors</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfileUser.actors.map(a => (
                    <span key={a} className="text-[10px] font-extrabold bg-[#FACC15]/10 border border-[#FACC15]/20 px-2.5 py-1 rounded text-[#FACC15]">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => toggleFollowUser(selectedProfileUser.handle)}
                className={`flex-1 font-black text-xs py-4.5 rounded-xl cursor-pointer transition-all border ${
                  following.includes(selectedProfileUser.handle)
                    ? 'bg-[#FACC15]/10 border-[#FACC15]/40 text-[#FACC15]'
                    : 'bg-white text-black hover:bg-gray-200 border-white'
                }`}
              >
                {following.includes(selectedProfileUser.handle) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" strokeWidth={3} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow User
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

export default Community;
