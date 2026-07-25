import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore, { MOVIE_CATALOG, ACTOR_CATALOG, GENRE_CATALOG } from '../store/useUserStore';
import { Search, Film, Star, Check, Sparkles, User, Bookmark } from 'lucide-react';
import Logo from '../components/ui/Logo';

const Onboarding = () => {
  const navigate = useNavigate();
  const saveOnboarding = useUserStore((state) => state.saveOnboarding);
  const user = useUserStore((state) => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [favoriteActors, setFavoriteActors] = useState([]);
  const [favoriteGenres, setFavoriteGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);

  const loaderMessages = [
    "Analyzing your cinema taste...",
    "Building your taste graph...",
    "Looking for similar cinephiles...",
    "Generating your custom dashboard...",
    "Ready!"
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Loader Message rotation logic
  useEffect(() => {
    if (currentStep === 5) {
      const interval = setInterval(() => {
        setLoaderMessageIndex((prev) => {
          if (prev < loaderMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setLoadingComplete(true);
            return prev;
          }
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Once loading completes, save to Zustand and redirect to dashboard
  useEffect(() => {
    if (loadingComplete) {
      saveOnboarding(favoriteMovies, watchlist, watchedMovies, favoriteActors, favoriteGenres);
      navigate('/dashboard');
    }
  }, [loadingComplete, navigate]);

  // Filter Catalog Movies based on search query
  const filteredCatalog = MOVIE_CATALOG.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Catalog Actors
  const filteredActors = ACTOR_CATALOG.filter((actor) =>
    actor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavoriteMovie = (movie) => {
    if (favoriteMovies.some(m => m.id === movie.id)) {
      setFavoriteMovies(favoriteMovies.filter(m => m.id !== movie.id));
    } else if (favoriteMovies.length < 5) {
      setFavoriteMovies([...favoriteMovies, movie]);
    }
  };

  const toggleFavoriteActor = (actorName) => {
    if (favoriteActors.includes(actorName)) {
      setFavoriteActors(favoriteActors.filter(name => name !== actorName));
    } else if (favoriteActors.length < 5) {
      setFavoriteActors([...favoriteActors, actorName]);
    }
  };

  const toggleGenre = (genre) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter(g => g !== genre));
    } else if (favoriteGenres.length < 5) {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const toggleWatched = (movie) => {
    if (watchedMovies.some(m => m.id === movie.id)) {
      setWatchedMovies(watchedMovies.filter(m => m.id !== movie.id));
    } else {
      setWatchedMovies([...watchedMovies, movie]);
      // Remove from watchlist if marked watched
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    }
  };

  const toggleWatchlist = (movie) => {
    if (watchlist.some(m => m.id === movie.id)) {
      setWatchlist(watchlist.filter(m => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, movie]);
      // Remove from watched if added to watchlist
      setWatchedMovies(watchedMovies.filter(m => m.id !== movie.id));
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    setSearchQuery('');
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-white flex flex-col justify-between font-sans">
      
      {/* Upper Navigation Indicator bar */}
      {currentStep < 5 && (
        <header className="w-full border-b border-white/5 py-4 px-6 bg-black/40 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-auto" />
              <span className="text-sm font-black tracking-wider border-l border-white/20 pl-3">ONBOARDING</span>
            </div>
            
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    currentStep === step 
                      ? 'bg-[#FACC15] w-12' 
                      : currentStep > step 
                        ? 'bg-[#FACC15]/40' 
                        : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1000px] mx-auto py-10 px-6 flex flex-col justify-center">
        
        {/* STEP 1: TOP 5 FAVORITE MOVIES */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#FACC15] text-xs font-black uppercase tracking-widest">Step 1 of 4</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-1">What are your top 5 favorite movies?</h1>
              <p className="text-sm text-gray-400 mt-2">Selecting exactly 5 helps us match you with similar cinephiles.</p>
            </div>

            <div className="relative group w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title or director..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-2 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCatalog.map((movie) => {
                const isSelected = favoriteMovies.some(m => m.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    onClick={() => toggleFavoriteMovie(movie)}
                    className={`flex flex-col group cursor-pointer border rounded-2xl p-2 bg-white/[0.02] transition-all duration-300 ${
                      isSelected 
                        ? 'border-[#FACC15] bg-[#FACC15]/5' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
                      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-black">
                            <Check className="w-5 h-5" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-xs truncate text-white leading-tight">{movie.title}</span>
                    <span className="text-[10px] text-gray-500 mt-1">{movie.year}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <span className="text-xs text-gray-500 font-semibold">
                Selected: <span className="text-white font-bold">{favoriteMovies.length} / 5</span>
              </span>
              <button
                disabled={favoriteMovies.length !== 5}
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#E2B710] disabled:bg-white/5 text-black disabled:text-gray-500 font-black text-sm transition-all cursor-pointer shadow-lg"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MOVIES WATCHED / WATCHLIST */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#FACC15] text-xs font-black uppercase tracking-widest">Step 2 of 4</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Which of these have you watched?</h1>
              <p className="text-sm text-gray-400 mt-2">Mark movies as Watched or Add to Watchlist to start tracking stats.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-2 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {MOVIE_CATALOG.map((movie) => {
                const isWatched = watchedMovies.some(m => m.id === movie.id);
                const isWatchlist = watchlist.some(m => m.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    className={`flex flex-col border rounded-2xl p-3 bg-white/[0.02] transition-all duration-300 ${
                      isWatched 
                        ? 'border-emerald-500/50 bg-emerald-500/5' 
                        : isWatchlist 
                          ? 'border-[#FACC15]/50 bg-[#FACC15]/5' 
                          : 'border-white/10'
                    }`}
                  >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
                      <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                      {isWatched && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-xs font-black tracking-widest text-emerald-400 border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase">Watched</span>
                        </div>
                      )}
                      {isWatchlist && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                          <span className="text-xs font-black tracking-widest text-[#FACC15] border border-[#FACC15]/40 bg-[#FACC15]/10 px-3 py-1.5 rounded-full uppercase">Watchlist</span>
                        </div>
                      )}
                    </div>
                    
                    <span className="font-bold text-xs truncate text-white leading-tight mb-2">{movie.title}</span>
                    
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => toggleWatched(movie)}
                        className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase transition-all tracking-wider cursor-pointer ${
                          isWatched 
                            ? 'bg-emerald-500 text-black' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        Watched
                      </button>
                      <button
                        onClick={() => toggleWatchlist(movie)}
                        className={`py-2 px-2.5 rounded-lg transition-all cursor-pointer ${
                          isWatchlist 
                            ? 'bg-[#FACC15] text-black' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                        title="Add to Watchlist"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <button
                onClick={handleBack}
                className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              
              <div className="flex gap-4 text-xs font-semibold text-gray-400">
                <span>Watched: <span className="text-white font-bold">{watchedMovies.length}</span></span>
                <span>Watchlist: <span className="text-white font-bold">{watchlist.length}</span></span>
              </div>

              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#E2B710] text-black font-black text-sm transition-all cursor-pointer shadow-lg"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TOP 5 FAVORITE ACTORS */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#FACC15] text-xs font-black uppercase tracking-widest">Step 3 of 4</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Select your top 5 favorite actors</h1>
              <p className="text-sm text-gray-400 mt-2">Choose exactly 5 stars who always make a movie worth watching.</p>
            </div>

            <div className="relative group w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actors..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredActors.map((actor) => {
                const isSelected = favoriteActors.includes(actor.name);
                return (
                  <div
                    key={actor.id}
                    onClick={() => toggleFavoriteActor(actor.name)}
                    className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer bg-white/[0.01] border transition-all duration-300 ${
                      isSelected 
                        ? 'border-[#FACC15] bg-[#FACC15]/5' 
                        : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-20 h-20 rounded-full overflow-hidden mb-3 border-2 transition-all p-1 bg-white/5 relative ${
                      isSelected ? 'border-[#FACC15]' : 'border-transparent'
                    }`}>
                      <img src={actor.image} alt={actor.name} className="w-full h-full object-cover rounded-full" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#FACC15]/20 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-[#FACC15] flex items-center justify-center text-black shadow-lg">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-xs text-center text-gray-300 leading-tight">{actor.name}</span>
                    <span className="text-[9px] text-gray-500 mt-1">{actor.facts.nationality}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <button
                onClick={handleBack}
                className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              
              <span className="text-xs text-gray-500 font-semibold">
                Selected: <span className="text-white font-bold">{favoriteActors.length} / 5</span>
              </span>

              <button
                disabled={favoriteActors.length !== 5}
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#E2B710] disabled:bg-white/5 text-black disabled:text-gray-500 font-black text-sm transition-all cursor-pointer shadow-lg"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TOP 5 FAVORITE GENRES */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <span className="text-[#FACC15] text-xs font-black uppercase tracking-widest">Step 4 of 4</span>
              <h1 className="text-3xl md:text-4xl font-black text-white mt-1">Select your top 5 favorite genres</h1>
              <p className="text-sm text-gray-400 mt-2">Which categories define your ideal movie night? Choose up to 5.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {GENRE_CATALOG.map((genre) => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`py-4 px-6 rounded-2xl font-black text-xs md:text-sm tracking-wider uppercase border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#FACC15] bg-[#FACC15]/5 text-[#FACC15] shadow-[0_0_15px_rgba(250,204,21,0.05)]'
                        : 'border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span>{genre}</span>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-[#FACC15]" strokeWidth={3} />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/20"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
              <button
                onClick={handleBack}
                className="px-6 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-sm transition-all cursor-pointer"
              >
                Back
              </button>
              
              <span className="text-xs text-gray-500 font-semibold">
                Selected: <span className="text-white font-bold">{favoriteGenres.length} / 5</span>
              </span>

              <button
                disabled={favoriteGenres.length === 0}
                onClick={handleNext}
                className="px-8 py-3.5 rounded-xl bg-[#FACC15] hover:bg-[#E2B710] text-black font-black text-sm transition-all cursor-pointer shadow-lg"
              >
                Finalize Profile
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: LOADER TRANSITION */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center justify-center py-20 text-center relative">
            <div className="absolute inset-0 bg-radial-gradient from-[#FACC15]/5 to-transparent pointer-events-none"></div>

            {/* Pulsing logo box */}
            <div className="relative mb-10 w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FACC15]/20 rounded-full blur-xl animate-pulse"></div>
              <Logo className="h-10 w-auto relative z-10 animate-bounce" />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white mb-2">Creating Your Cinephile Identity</h2>
            <p className="text-sm font-semibold text-[#FACC15] tracking-widest uppercase h-6 transition-all duration-300">
              {loaderMessages[loaderMessageIndex]}
            </p>
          </div>
        )}

      </main>

      {/* Onboarding Footer */}
      {currentStep < 5 && (
        <footer className="w-full border-t border-white/5 py-4 px-6 text-center text-xs text-gray-500 bg-black/20">
          CINELITH Onboarding Wizard © 2026. Custom cinematic algorithm active.
        </footer>
      )}

    </div>
  );
};

export default Onboarding;
