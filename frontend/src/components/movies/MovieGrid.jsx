import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clapperboard } from 'lucide-react';

const MovieGrid = ({ movies, filterQuery, setFilterQuery }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12">
      {/* Search Input inline for matching mockup search feel */}
      <div className="relative w-full group">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Search within these results..."
          className="w-full pl-6 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-base placeholder:text-gray-500 shadow-xl"
        />
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="flex flex-col group cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-white/5 border border-white/10 shadow-2xl group-hover:border-[#FACC15]/40 transition-all duration-300">
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                  <p className="text-white text-xs font-bold border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                    View Details
                  </p>
                </div>
              </div>

              {/* Title & Star Rating Row */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-white text-sm md:text-[15px] group-hover:text-[#FACC15] transition-colors leading-tight truncate flex-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
                  <span className="text-xs font-black text-gray-200">{movie.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Year & Genres */}
              <p className="text-xs text-gray-500 font-medium">
                {movie.year} • {movie.genre}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Illustration */
        <div className="w-full flex flex-col items-center justify-center p-16 rounded-3xl bg-white/5 border border-white/10 text-center max-w-lg mx-auto shadow-2xl">
          <div className="p-5 bg-white/5 rounded-2xl mb-6 border border-white/5 shadow-inner">
            <Clapperboard className="w-12 h-12 text-[#FACC15]" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-black text-white mb-2">No movies found</h3>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xs font-medium">
            No movies match your filters. Try removing some filters or explore trending films.
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
