import React from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

const Discussion = ({ comments }) => {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-foreground">Discussion</h2>
        <MessageCircle className="w-6 h-6 text-primary" />
      </div>

      <div className="flex flex-col gap-8">
        {comments.map((comment, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-primary transition-all">
              <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-white">{comment.user}</span>
                <span className="text-xs text-muted-foreground font-medium">{comment.time}</span>
              </div>
              
              <p className="text-foreground/90 leading-relaxed mb-4 max-w-2xl">
                {comment.text}
              </p>
              
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all">
                  <ThumbsUp className="w-4 h-4" />
                  {comment.likes}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-all">
                  <ThumbsDown className="w-4 h-4" />
                  {comment.dislikes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discussion;
