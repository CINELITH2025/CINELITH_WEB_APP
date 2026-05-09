import React from 'react';
import { Link } from 'react-router-dom';

const Rankings = () => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Rankings</h2>
      
      <div className="flex flex-col gap-8">
        {/* Top Actor */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium mb-1">Top Actors Ranked</span>
            <h3 className="text-2xl font-bold text-white mb-2">Ethan Blake</h3>
            <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              View More
            </Link>
          </div>
          
          <div className="w-full md:w-[400px] h-[160px] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            <img 
              src="/images/actor_1.png" 
              alt="Ethan Blake" 
              className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
            />
          </div>
        </div>

        {/* Top Movie */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground font-medium mb-1">Top Movies Ranked</span>
            <h3 className="text-2xl font-bold text-white mb-2">The Silent Echo</h3>
            <Link to="#" className="text-sm text-muted-foreground hover:text-white transition-colors">
              View More
            </Link>
          </div>
          
          <div className="w-full md:w-[400px] h-[160px] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
            <img 
              src="/images/poster_2.png" 
              alt="The Silent Echo" 
              className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rankings;
