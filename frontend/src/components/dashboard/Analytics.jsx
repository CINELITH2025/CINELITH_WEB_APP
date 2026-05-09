import React from 'react';

const Analytics = () => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Genre-wise Watch Distribution */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-8">Genre-wise Watch Distribution</h3>
          
          <div className="flex items-end justify-between h-40 mt-4">
            {/* Bars */}
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-32 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Action</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-28 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Drama</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-20 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Comedy</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-36 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Thriller</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-24 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Sci-Fi</span>
            </div>
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-8 h-16 bg-[#424131] rounded-sm group-hover:bg-primary transition-colors"></div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Romance</span>
            </div>
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
                  <stop offset="0%" stopColor="#d6d194" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d6d194" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 100 Q 20 20 40 40 T 80 80 T 120 40 T 160 90 T 200 60 T 240 110 T 280 20 T 320 90 T 360 40 T 400 30 L 400 120 L 0 120 Z" 
                fill="url(#glow)" 
              />
              <path 
                d="M 0 100 Q 20 20 40 40 T 80 80 T 120 40 T 160 90 T 200 60 T 240 110 T 280 20 T 320 90 T 360 40 T 400 30" 
                fill="none" 
                stroke="#d6d194" 
                strokeWidth="3" 
                className="drop-shadow-[0_0_8px_rgba(214,209,148,0.5)]"
              />
            </svg>
            
            {/* Labels overlay */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Jan</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Feb</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Mar</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Apr</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">May</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Jun</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-semibold">Jul</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
