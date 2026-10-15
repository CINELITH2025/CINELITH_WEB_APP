import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useUserStore from '../store/useUserStore';
import { apiErrorMessage } from '../lib/api';
import { Search, Sparkles, Check, Clapperboard } from 'lucide-react';

const Recommend = () => {
  const user = useUserStore((state) => state.user);
  const searchRecommendMovies = useUserStore((state) => state.searchRecommendMovies);
  const recommendMovie = useUserStore((state) => state.recommendMovie);

  const [searchQuery, setSearchQuery] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsSearching(true);
      try {
        const movies = await searchRecommendMovies(searchQuery);
        if (!cancelled) setCatalog(movies);
      } catch (err) {
        if (!cancelled) setError(apiErrorMessage(err, 'Could not load the recommendation catalog.'));
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    const timer = setTimeout(load, searchQuery ? 200 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery, searchRecommendMovies]);

  const selectMovie = (movie) => {
    setSelected(movie);
    setRecommendations([]);
    setError('');
  };

  const useProfileFavorite = async () => {
    const titles = (user?.favoriteMovies || []).map((movie) => movie.title).filter(Boolean);
    if (!titles.length) {
      setError('No saved favorite on your profile yet. Search and pick one film below.');
      return;
    }
    setError('');
    setIsSearching(true);
    try {
      for (const title of titles) {
        const results = await searchRecommendMovies(title);
        if (results[0]) {
          selectMovie(results[0]);
          return;
        }
      }
      setError('Your saved titles are not in this ratings dataset. Pick a film from the catalog below.');
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not match your saved favorite.'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecommend = async () => {
    if (!selected) return;
    setIsRecommending(true);
    setError('');
    try {
      const data = await recommendMovie(selected);
      setRecommendations(data.recommendations || []);
      if (!data.recommendations?.length) {
        setError(data.message || 'Not enough reviews');
      }
    } catch (err) {
      setError(apiErrorMessage(err, 'Recommendation failed.'));
      setRecommendations([]);
    } finally {
      setIsRecommending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08060d] text-foreground overflow-x-hidden font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#F5BF26] text-xs font-black uppercase tracking-widest">get_movie_recommendation(movie_name)</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1 tracking-tight">Films For You</h1>
            <p className="text-sm text-gray-400 mt-2 max-w-2xl">
              Choose one film. We return its 10 cosine KNN neighbors from the ratings matrix — same input as the notebook.
              Likes, ratings, reviews, and onboarding favorites from CINELITH users are stored and merged back into that matrix.
            </p>
          </div>
          {user?.favoriteMovies?.length > 0 && (
            <button
              onClick={useProfileFavorite}
              className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-wider hover:border-[#F5BF26]/40 cursor-pointer"
            >
              Use my top saved favorite
            </button>
          )}
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {selected && (
          <section className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 bg-[#F5BF26]/10 border border-[#F5BF26]/30 rounded-2xl pl-2 pr-4 py-2">
              <img src={selected.image || selected.poster} alt="" className="w-10 h-14 rounded-lg object-cover" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Selected title</p>
                <p className="text-sm font-black text-white">{selected.title}</p>
              </div>
            </div>
            <button
              onClick={handleRecommend}
              disabled={isRecommending}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#F5BF26] text-black font-black text-sm cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              {isRecommending ? 'Finding neighbors...' : 'Recommend 10 films'}
            </button>
          </section>
        )}

        <section className="space-y-4">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#F5BF26] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search one title: Gladiator, Toy Story, American Psycho..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#F5BF26]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
            />
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            {isSearching ? 'Searching catalog...' : `${catalog.length} titles`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
            {catalog.map((movie) => {
              const isSelected = selected?.movieId === movie.movieId;
              return (
                <div
                  key={movie.movieId}
                  onClick={() => selectMovie(movie)}
                  className={`flex flex-col group cursor-pointer border rounded-2xl p-2 bg-white/[0.02] transition-all ${
                    isSelected ? 'border-[#F5BF26] bg-[#F5BF26]/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Clapperboard className="w-8 h-8" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#F5BF26] flex items-center justify-center text-black">
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
        </section>

        {recommendations.length > 0 && selected && (
          <section className="space-y-4 pt-4 border-t border-white/5">
            <h2 className="text-xl font-black text-white tracking-tight">Neighbors of {selected.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {recommendations.map((movie) => (
                <article key={movie.movieId} className="flex flex-col border border-white/10 rounded-2xl p-2 bg-white/[0.02]">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Clapperboard className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-xs text-white leading-tight">{movie.title}</span>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {movie.year}{movie.distance != null ? ` · d=${movie.distance}` : ''}
                  </span>
                  {movie.overview && (
                    <p className="text-[10px] text-gray-500 mt-2 line-clamp-3 leading-relaxed">{movie.overview}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recommend;
