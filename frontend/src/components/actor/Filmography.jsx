import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Filmography = ({ movies }) => {
  const navigate = useNavigate();

  return (
    <section className="my-16 px-4 md:px-6">
      {/* Heading + Dropdowns row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-black text-white tracking-tight">Filmography</h2>
        
        {/* Dropdown triggers */}
        <div className="flex flex-wrap items-center gap-3">
          {["Year", "Genre", "Role"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-md"
            >
              {filter}
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Grid - 6 columns matching Mockup 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {movies.map((movie, idx) => (
          <div 
            key={idx} 
            className="flex flex-col group cursor-pointer"
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/10 shadow-lg group-hover:border-[#EAB513]/40 transition-all duration-300">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold text-white text-xs leading-tight truncate group-hover:text-[#EAB513] transition-colors">{movie.title}</h3>
            <p className="text-[10px] text-gray-500 mt-1">
              {movie.year} • {movie.views}
            </p>
          </div>
        ))}

        {/* 6th poster "Show More" placeholder as in Mockup 3 */}
        <div 
          onClick={() => navigate('/movies')}
          className="flex flex-col group cursor-pointer"
        >
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-[#131118] border border-dashed border-white/20 flex flex-col items-center justify-center p-4 transition-all duration-300 group-hover:border-[#EAB513]/40 shadow-inner">
            <span className="text-3xl md:text-4xl font-extrabold text-[#EAB513] mb-1">6</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">And More</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filmography;
