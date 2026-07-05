import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full max-w-[1400px] mx-auto h-[480px] md:h-[520px] rounded-3xl overflow-hidden my-6 group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: 'url("/images/hero_bg.png")' }}
      ></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight max-w-3xl">
          Your Gateway to <span className="text-[#FACC15]">the World of Cinema.</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 mb-8 max-w-md leading-relaxed">
          Discover, discuss, and connect with film lovers across the globe. Daily updated recommendations and stats.
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            onClick={() => navigate('/movies')}
            className="bg-[#FACC15] hover:bg-[#E2B710] text-black font-black text-sm px-6 py-5 rounded-lg transition-all"
          >
            Explore Movies
          </Button>
          <Button 
            onClick={() => navigate('/community')}
            variant="outline"
            className="border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold text-sm px-6 py-5 rounded-lg transition-all"
          >
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
