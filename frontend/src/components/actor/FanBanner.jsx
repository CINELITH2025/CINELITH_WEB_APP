import React from 'react';

const FanBanner = ({ percentage, name }) => {
  return (
    <section className="relative w-full max-w-4xl mx-auto my-16 py-12 rounded-3xl border border-white/5 bg-gradient-to-b from-[#1a1712] to-background overflow-hidden flex flex-col items-center justify-center text-center px-4">
      
      {/* Glow Effect behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-primary/30 blur-[80px] rounded-full pointer-events-none"></div>

      <h3 className="relative z-10 text-2xl md:text-3xl font-semibold text-white mb-2 drop-shadow">
        Watched by <span className="text-primary font-bold">{percentage}%</span> of users
      </h3>
      <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-white drop-shadow">
        You're a big fan of <span className="text-primary">{name}!</span>
      </h2>
    </section>
  );
};

export default FanBanner;
