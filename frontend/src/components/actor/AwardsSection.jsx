import React from 'react';
import { Trophy } from 'lucide-react';

const AwardsSection = ({ awards }) => {
  return (
    <section className="my-16 px-4 md:px-6">
      <h2 className="text-2xl font-black text-white tracking-tight mb-8">Awards & Nominations</h2>
      
      <div className="flex flex-col gap-4">
        {awards.map((award, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-[#FACC15]/30 hover:bg-white/10 transition-all duration-300 shadow-lg group"
          >
            {/* Left Side: Icon & Details */}
            <div className="flex items-center gap-5">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 shadow-inner text-[#FACC15] group-hover:scale-105 transition-transform duration-300">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white text-sm md:text-base mb-1">
                  {award.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  {award.details}
                </p>
              </div>
            </div>

            {/* Right Side: Year */}
            <span className="text-sm font-black text-[#FACC15] shrink-0 ml-4">
              {award.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;
