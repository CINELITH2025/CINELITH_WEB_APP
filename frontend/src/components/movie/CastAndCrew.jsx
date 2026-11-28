import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getInitials = (name = "") => {
  const parts = String(name || "").trim().split(/\s+/);
  if (!parts[0]) return "★";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const CastMember = ({ member, idx, onNavigate }) => {
  const [imgFailed, setImgFailed] = useState(!member.image);

  return (
    <button
      type="button"
      onClick={() => onNavigate(member, idx)}
      aria-label={`View ${member.name} profile`}
      className="flex flex-col items-center group cursor-pointer text-center"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[#F5BF26] transition-all p-1 bg-white/5 shadow-xl">
        {!imgFailed && member.image ? (
          <img
            src={member.image}
            alt={member.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover rounded-full transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-black text-sm md:text-base text-[#F5BF26] border border-[#F5BF26]/20">
            {getInitials(member.name)}
          </div>
        )}
      </div>
      <span className="text-xs md:text-sm font-bold text-white group-hover:text-[#F5BF26] transition-colors leading-tight max-w-[100px] truncate">
        {member.name}
      </span>
      <span className="text-[10px] text-gray-500 font-bold mt-0.5 leading-tight max-w-[100px] truncate">
        {member.role}
      </span>
    </button>
  );
};

const CastAndCrew = ({ cast }) => {
  const navigate = useNavigate();
  if (!cast?.length) return null;

  return (
    <section className="mb-16">
      {/* Cast Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-white tracking-tight mb-8">Cast</h2>
        <div className="flex flex-wrap items-center gap-8 md:gap-12 justify-start">
          {cast.map((member, idx) => (
            <CastMember
              key={member.id || idx}
              member={member}
              idx={idx}
              onNavigate={(targetMember, i) =>
                navigate(`/actor/${targetMember.id || i + 1}?${new URLSearchParams({ name: targetMember.name || '' })}`, {
                  state: { actor: targetMember }
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CastAndCrew;
