import { useNavigate } from 'react-router-dom';

const Filmography = ({ movies }) => {
  const navigate = useNavigate();

  return (
    <section className="my-16 px-4 md:px-6">
      <h2 className="text-2xl font-black text-white tracking-tight mb-8">Filmography</h2>

      {/* Grid - 6 columns matching Mockup 3 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id || movie.title}
            className="flex flex-col group cursor-pointer"
            onClick={() => navigate(movie.id ? `/movie/${movie.id}` : `/explore?q=${encodeURIComponent(movie.title)}`)}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-white/5 border border-white/10 shadow-lg group-hover:border-[#F5BF26]/40 transition-all duration-300">
              <img 
                src={movie.image} 
                alt={movie.title} 
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="font-bold text-white text-xs leading-tight truncate group-hover:text-[#F5BF26] transition-colors">{movie.title}</h3>
            <p className="text-[10px] text-gray-500 mt-1">
              {movie.year}{movie.genre ? ` • ${movie.genre}` : ''}
            </p>
          </div>
        ))}

        {movies.length === 0 && (
          <p className="col-span-full text-sm text-gray-500">No matching titles are available in the catalog yet.</p>
        )}
      </div>
    </section>
  );
};

export default Filmography;
