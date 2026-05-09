import React from 'react';

const CastAndCrew = ({ cast, crew }) => {
  return (
    <section className="mb-16">
      {/* Cast Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-8">Cast</h2>
        <div className="flex flex-wrap items-center gap-8 md:gap-12 justify-between">
          {cast.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center group cursor-pointer">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary transition-all p-1">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-110" 
                />
              </div>
              <span className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors text-center">
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crew Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-8">Crew</h2>
        <div className="flex flex-col gap-8 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground font-medium text-sm">Director</span>
              <span className="text-foreground font-bold">{crew.director}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground font-medium text-sm">Writers</span>
              <span className="text-foreground font-bold">{crew.writers.join(', ')}</span>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground font-medium text-sm">Producers</span>
              <span className="text-foreground font-bold">{crew.producers.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CastAndCrew;
