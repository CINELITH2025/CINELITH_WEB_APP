import React from 'react';
import { Eye, ThumbsUp, Share2 } from 'lucide-react';

const MovieStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div>
          <p className="text-3xl font-bold text-primary">{stats.views}</p>
          <p className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-widest">Views</p>
        </div>
        <Eye className="w-10 h-10 text-white/10 group-hover:text-primary transition-colors" strokeWidth={1.5} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div>
          <p className="text-3xl font-bold text-primary">{stats.likes}</p>
          <p className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-widest">Likes</p>
        </div>
        <ThumbsUp className="w-10 h-10 text-white/10 group-hover:text-primary transition-colors" strokeWidth={1.5} />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
        <div>
          <p className="text-3xl font-bold text-primary">{stats.shares}</p>
          <p className="text-sm text-muted-foreground font-semibold mt-1 uppercase tracking-widest">Shares</p>
        </div>
        <Share2 className="w-10 h-10 text-white/10 group-hover:text-primary transition-colors" strokeWidth={1.5} />
      </div>
    </div>
  );
};

export default MovieStats;
