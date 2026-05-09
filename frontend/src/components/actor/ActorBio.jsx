import React from 'react';

const ActorBio = ({ bio, facts }) => {
  return (
    <section className="flex flex-col lg:flex-row gap-12 my-12 px-2">
      {/* Biography Column */}
      <div className="flex-1 lg:pr-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Biography</h2>
        <div className="space-y-6 text-foreground/80 leading-relaxed text-[15px]">
          {bio.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Quick Facts Column */}
      <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-4">
        {facts.map((fact, index) => (
          <div key={index} className="bg-[#2A261A] p-4 rounded-xl border border-white/5">
            <span className="block text-primary font-bold text-sm mb-1">{fact.label}</span>
            <span className="block font-bold text-foreground">{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActorBio;
