import React from 'react';
import { Star, Film, Calendar } from 'lucide-react';
import useUserStore from '../../store/useUserStore';

const SummaryCards = () => {
  const user = useUserStore((state) => state.user);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6">Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-[#F5BF26]/50 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Cinephile Score</h3>
            <p className="text-4xl font-black text-[#F5BF26]">{user?.cinephileScore?.toLocaleString() || 0}</p>
          </div>
          <Star className="w-10 h-10 text-white/20 group-hover:text-[#F5BF26] transition-colors" strokeWidth={1.5} />
        </div>

        {/* Movies Watched */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-[#F5BF26]/50 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Movies Watched</h3>
            <p className="text-4xl font-black text-[#F5BF26]">{user?.watchedMovies?.length || 0}</p>
          </div>
          <Film className="w-10 h-10 text-white/20 group-hover:text-[#F5BF26] transition-colors" strokeWidth={1.5} />
        </div>

        {/* Streak */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-[#F5BF26]/50 transition-colors">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Active Streak</h3>
            <p className="text-4xl font-black text-[#F5BF26]">{user?.streak || 1} {user?.streak === 1 ? 'Day' : 'Days'}</p>
          </div>
          <Calendar className="w-10 h-10 text-white/20 group-hover:text-[#F5BF26] transition-colors" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
};

export default SummaryCards;
