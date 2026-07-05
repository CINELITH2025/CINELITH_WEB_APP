import React from 'react';

const ActorBio = ({ bio, facts }) => {
  return (
    <section className="flex flex-col lg:flex-row gap-12 my-16 px-4 md:px-6">
      {/* Biography Column */}
      <div className="flex-1">
        <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Biography</h2>
        <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base font-medium">
          {bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Quick Facts Column */}
      <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
        {facts.map((fact, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-1 shadow-md">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{fact.label}</span>
            <span className="font-bold text-white text-[15px]">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActorBio;
