import React from 'react';

const RelatedMovies = ({ movies }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-8">Related Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {movies.map((movie, idx) => (
          <div key={idx} className="flex flex-col group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-white/5 border border-white/5">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedMovies;
