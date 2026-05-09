import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieGrid = ({ movies }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
      {movies.map((movie, idx) => (
        <div 
          key={idx} 
          className="flex flex-col group cursor-pointer"
          onClick={() => navigate(`/movie/${idx + 1}`)}
        >
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-white/5 border border-white/5 shadow-2xl">
            <img 
              src={movie.image} 
              alt={movie.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
              <p className="text-white text-sm font-bold border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                View Details
              </p>
            </div>
          </div>
          <h3 className="font-bold text-foreground text-sm md:text-base line-clamp-1 mb-1">{movie.title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            {movie.year} • {movie.genre}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
