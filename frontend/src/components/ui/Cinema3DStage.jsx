import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Film, Star, Play, Layers, Compass, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CAROUSEL_MOVIES = [
  { id: 1, title: "Dune: Part Two", director: "Denis Villeneuve", rating: "8.8", match: "98%", genre: "Sci-Fi / Epic", image: "/images/poster_1.jpg" },
  { id: 2, title: "Oppenheimer", director: "Christopher Nolan", rating: "8.9", match: "95%", genre: "Drama / History", image: "/images/poster_2.jpg" },
  { id: 13, title: "Blade Runner 2049", director: "Denis Villeneuve", rating: "8.0", match: "94%", genre: "Sci-Fi / Cyberpunk", image: "/images/poster_14.jpg" },
  { id: 14, title: "Inception", director: "Christopher Nolan", rating: "8.8", match: "92%", genre: "Sci-Fi / Action", image: "/images/poster_2.jpg" },
  { id: 15, title: "Interstellar", director: "Christopher Nolan", rating: "8.7", match: "96%", genre: "Sci-Fi / Adventure", image: "/images/poster_1.jpg" },
  { id: 16, title: "Parasite", director: "Bong Joon Ho", rating: "8.6", match: "91%", genre: "Thriller / Drama", image: "/images/poster_11.jpg" }
];

const Cinema3DStage = () => {
  const navigate = useNavigate();
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(10);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationY((prev) => prev - 60);
      setActiveCardIndex((prev) => (prev + 1) % CAROUSEL_MOVIES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Parallax mouse follow effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
    setRotationX(12 - y * 15);
  };

  const handleNext = () => {
    setIsAutoRotating(false);
    setRotationY((prev) => prev - 60);
    setActiveCardIndex((prev) => (prev + 1) % CAROUSEL_MOVIES.length);
  };

  const handlePrev = () => {
    setIsAutoRotating(false);
    setRotationY((prev) => prev + 60);
    setActiveCardIndex((prev) => (prev - 1 + CAROUSEL_MOVIES.length) % CAROUSEL_MOVIES.length);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsAutoRotating(false)}
      onMouseLeave={() => setIsAutoRotating(true)}
      className="relative w-full py-16 px-4 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e0c18] via-[#090812] to-[#08060d] shadow-[0_25px_60px_rgba(0,0,0,0.9)] select-none"
    >
      {/* Dynamic 3D Header */}
      <div className="text-center space-y-3 mb-10 relative z-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(250,204,21,0.2)]">
          <Sparkles className="w-3.5 h-3.5" /> Interactive 3D Cinema Stage
        </div>
        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Experience Cinema in 3D Space
        </h3>
        <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium">
          Move your cursor to tilt perspective. Click cards to inspect films in 3D depth.
        </p>
      </div>

      {/* 3D Stage Viewport Container */}
      <div 
        className="w-full h-[420px] md:h-[480px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        {/* Glowing 3D Base Platform Grid */}
        <div 
          className="absolute w-[450px] md:w-[600px] h-[450px] md:h-[600px] rounded-full border border-[#FACC15]/20 bg-radial from-[#FACC15]/10 via-transparent to-transparent pointer-events-none transition-transform duration-300"
          style={{
            transform: `rotateX(75deg) rotateZ(${rotationY * 0.2}deg) translateZ(-180px)`,
            boxShadow: '0 0 80px rgba(250, 204, 21, 0.15)'
          }}
        />

        {/* 3D Carousel Cylinder Ring */}
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
          }}
        >
          {CAROUSEL_MOVIES.map((movie, index) => {
            const angle = index * 60; // 360 / 6 = 60 degrees apart
            const radius = 260; // distance from center in 3D space

            return (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="absolute w-48 md:w-56 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 bg-[#121019] shadow-[0_20px_40px_rgba(0,0,0,0.9)] hover:border-[#FACC15] transition-all duration-300 group cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`
                }}
              >
                {/* Movie Poster Image */}
                <img 
                  src={movie.image} 
                  alt={movie.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end text-left">
                  {/* Taste Match Pill */}
                  <div className="absolute top-3 right-3 bg-[#FACC15] text-black text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-black" />
                    {movie.match}
                  </div>

                  <span className="text-[9px] text-[#FACC15] font-extrabold uppercase tracking-widest mb-0.5">
                    {movie.genre}
                  </span>
                  <h4 className="text-sm md:text-base font-black text-white leading-tight group-hover:text-[#FACC15] transition-colors truncate">
                    {movie.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                    Directed by {movie.director}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 text-xs">
                    <span className="text-[#FACC15] font-bold">★ {movie.rating} Rating</span>
                    <span className="text-[10px] text-gray-400 font-semibold">Cinelith Curator</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex items-center justify-center gap-4 mt-4 relative z-30">
        <button
          onClick={handlePrev}
          className="bg-white/5 hover:bg-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer"
        >
          ◄ Previous
        </button>

        <div className="flex gap-1.5">
          {CAROUSEL_MOVIES.map((_, idx) => (
            <span
              key={idx}
              onClick={() => {
                setIsAutoRotating(false);
                setRotationY(-idx * 60);
                setActiveCardIndex(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                activeCardIndex === idx
                  ? 'bg-[#FACC15] w-6'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-white/5 hover:bg-white/15 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer"
        >
          Next ►
        </button>
      </div>

    </div>
  );
};

export default Cinema3DStage;
