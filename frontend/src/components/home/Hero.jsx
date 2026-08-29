import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';
import { Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <section className="relative w-full max-w-[1400px] mx-auto h-[480px] md:h-[520px] rounded-3xl overflow-hidden my-6 group shadow-2xl border border-white/5">
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
        {/* Dynamic Personalization Tag */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 bg-[#F5BF26]/10 border border-[#F5BF26]/30 px-4 py-2.5 rounded-full w-fit mb-5 shadow-lg animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#F5BF26] fill-current" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white">
              Welcome back, <span className="text-[#F5BF26]">{user.name}</span> • Score: {user.cinephileScore?.toLocaleString()} • Streak: {user.streak}d
            </span>
          </div>
        ) : (
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#F5BF26] mb-4 block">
            The Ultimate Platform for Cinephiles
          </span>
        )}

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight max-w-3xl">
          Your Gateway to <span className="text-[#F5BF26]">the World of Cinema.</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 mb-8 max-w-md leading-relaxed font-medium">
          Discover, discuss, and connect with film lovers across the globe. Daily updated movie battles, trivia quizzes, and community analytics.
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Button 
            onClick={() => navigate('/movies')}
            className="bg-[#F5BF26] hover:bg-[#F5BF26] text-black font-black text-sm px-6 py-5 rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            Explore Movies
            <ArrowRight className="w-4 h-4 ml-2" strokeWidth={3} />
          </Button>
          <Button 
            onClick={() => navigate('/community')}
            variant="outline"
            className="border-white/20 hover:border-white/40 text-white hover:bg-white/5 font-bold text-sm px-6 py-5 rounded-xl transition-all hover:scale-105 cursor-pointer"
          >
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
