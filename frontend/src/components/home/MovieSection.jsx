import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieSection = ({ title, movies }) => {
  const navigate = useNavigate();

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#EAB513] tracking-wide">{title}</h2>
      </div>

      {/* Movie Grid - 5 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {movies.map((movie, idx) => (
          <div 
            key={idx} 
            className="flex flex-col group cursor-pointer"
            onClick={() => navigate(`/movie/${movie.id || (idx + 1)}`)}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/10 shadow-xl group-hover:border-[#EAB513]/40 transition-all duration-300">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-bold bg-[#EAB513]/20 border border-[#EAB513]/30 px-3 py-1.5 rounded-md backdrop-blur-md">
                  View Info
                </span>
              </div>
            </div>
            <h3 className="font-bold text-white text-sm truncate group-hover:text-[#EAB513] transition-colors leading-tight">{movie.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{movie.genre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
