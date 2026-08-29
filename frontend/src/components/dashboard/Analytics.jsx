import React from 'react';
import useUserStore from '../../store/useUserStore';

const Analytics = () => {
  const user = useUserStore((state) => state.user);

  // Helper to determine the visual height of a genre bar based on onboarding preferences
  const getGenreBarHeight = (genreName) => {
    const isFavorite = user?.favoriteGenres?.some(
      g => g.toLowerCase() === genreName.toLowerCase()
    );

    if (isFavorite) {
      // Return a tall bar (e.g., between 80% and 100% height)
      return "h-32 bg-[#EAB513] shadow-[0_0_10px_rgba(234,181,19,0.2)]";
    }
    // Return a short placeholder bar (e.g., between 15% and 25% height)
    return "h-10 bg-[#424131]";
  };

  const genres = [
    { name: "Action" },
    { name: "Drama" },
    { name: "Comedy" },
    { name: "Thriller" },
    { name: "Sci-Fi" },
    { name: "Romance" }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Genre-wise Watch Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-8">Genre-wise Watch Distribution</h3>
          
          <div className="flex items-end justify-between h-40 mt-4 px-2">
            {genres.map((g, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                <div className={`w-8 rounded-t-md transition-all duration-500 group-hover:scale-y-105 origin-bottom ${getGenreBarHeight(g.name)}`}></div>
                <span className="text-[10px] md:text-xs text-gray-500 font-semibold group-hover:text-white transition-colors">{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Watch Trend Over Time */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <h3 className="text-sm font-semibold text-white mb-8">Watch Trend Over Time</h3>
          
          <div className="relative h-40 w-full flex items-end">
            {/* Custom SVG Line Chart representation */}
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EAB513" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#EAB513" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 100 Q 20 20 40 40 T 80 80 T 120 40 T 160 90 T 200 60 T 240 110 T 280 20 T 320 90 T 360 40 T 400 30 L 400 120 L 0 120 Z" 
                fill="url(#glow)" 
              />
              <path 
                d="M 0 100 Q 20 20 40 40 T 80 80 T 120 40 T 160 90 T 200 60 T 240 110 T 280 20 T 320 90 T 360 40 T 400 30" 
                fill="none" 
                stroke="#EAB513" 
                strokeWidth="3" 
                className="drop-shadow-[0_0_8px_rgba(234,181,19,0.5)]"
              />
            </svg>
            
            {/* Labels overlay */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Jan</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Feb</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Mar</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Apr</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">May</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Jun</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Jul</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
