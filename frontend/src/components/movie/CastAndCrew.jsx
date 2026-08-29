import React from 'react';
import { useNavigate } from 'react-router-dom';

const CastAndCrew = ({ cast }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-16">
      {/* Cast Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white tracking-tight mb-8">Cast</h2>
        <div className="flex flex-wrap items-center gap-10 md:gap-14 justify-between">
          {cast.map((member, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/actor/${idx + 1}`)}
              className="flex flex-col items-center group cursor-pointer text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[#EAB513] transition-all p-1 bg-white/5 shadow-xl">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-105" 
                />
              </div>
              <span className="text-xs md:text-sm font-bold text-white group-hover:text-[#EAB513] transition-colors leading-tight">
                {member.name}
              </span>
              <span className="text-[10px] text-gray-500 font-bold mt-0.5 leading-tight">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CastAndCrew;
