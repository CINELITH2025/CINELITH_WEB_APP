import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActorSection = ({ title, actors }) => {
  const navigate = useNavigate();

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#E2B710] tracking-wide">{title}</h2>
      </div>

      {/* Actor List */}
      <div className="flex flex-wrap items-center gap-10 md:gap-14 justify-between">
        {actors.map((actor, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(`/actor/${idx + 1}`)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-[#FACC15] transition-all p-1 bg-white/5 shadow-xl">
              <img 
                src={actor.image} 
                alt={actor.name} 
                className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="text-xs md:text-sm font-bold text-gray-300 group-hover:text-[#FACC15] transition-colors text-center whitespace-nowrap">
              {actor.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActorSection;
