import React from 'react';
import { Trophy } from 'lucide-react';

const AwardsSection = ({ awards }) => {
  return (
    <section className="my-12 px-2">
      <h2 className="text-2xl font-bold text-foreground mb-6">Awards & Achievements</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {awards.map((award, index) => (
          <div key={index} className="flex flex-col group">
            {/* Image / Trophy Placeholder */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-[#EAD5B9] flex flex-col items-center justify-center border border-white/5 shadow-inner">
              <Trophy className="w-20 h-20 md:w-24 md:h-24 text-[#C19A5B] drop-shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" strokeWidth={1.5} />
              
              {/* Subtle gradient overlay to make it look 3D-ish */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 mix-blend-overlay"></div>
            </div>
            
            {/* Text */}
            <h3 className="font-bold text-foreground text-sm leading-snug mb-1">
              {award.title}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              {award.year}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;
