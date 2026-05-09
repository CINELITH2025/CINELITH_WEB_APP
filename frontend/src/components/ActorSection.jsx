import React from 'react';
import { Link } from 'react-router-dom';

const ActorSection = ({ title, actors }) => {
  return (
    <section className="py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link to="#" className="text-sm font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>

      {/* Actor List */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {actors.map((actor, idx) => (
          <div key={idx} className="flex flex-col items-center group cursor-pointer">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-colors p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white/5">
                <img 
                  src={actor.image} 
                  alt={actor.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
            <h3 className="font-medium text-foreground text-center">{actor.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActorSection;
