import React from 'react';
import { Link } from 'react-router-dom';

const MovieSection = ({ title, movies }) => {
  return (
    <section className="py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link to="#" className="text-sm font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie, idx) => (
          <div key={idx} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/5">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-medium border border-white/30 px-4 py-2 rounded-full backdrop-blur-sm">View Details</span>
              </div>
            </div>
            <h3 className="font-semibold text-foreground truncate">{movie.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{movie.genre}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
