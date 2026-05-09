import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden my-8 group">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: 'url("/images/hero_bg.png")' }}
      ></div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-24 max-w-3xl">
        <p className="text-lg md:text-xl font-medium text-foreground/80 mb-2 drop-shadow-md">
          Your Gateway to the
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-primary leading-tight mb-6 drop-shadow-xl tracking-tight">
          World of Cinema
        </h1>
        <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-md leading-relaxed drop-shadow">
          Discover, discuss, and track your favorite films. Join a community of passionate movie enthusiasts.
        </p>
        
        <Button size="lg" className="w-fit text-black font-bold text-base px-8 py-6 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all">
          Watch Now
        </Button>
      </div>
    </section>
  );
};

export default Hero;
