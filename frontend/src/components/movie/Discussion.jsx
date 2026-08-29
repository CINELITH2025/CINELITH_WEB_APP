import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUserStore from '../../store/useUserStore';

const Discussion = ({ comments: initialComments, movieId }) => {
  const [activeTab, setActiveTab] = useState("Top");
  const [comments, setComments] = useState(initialComments);
  const [newCommentText, setNewCommentText] = useState("");

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const addReviewPoints = useUserStore((state) => state.addReviewPoints);

  const handlePostComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      user: isAuthenticated ? user?.name || "You" : "Guest",
      time: "Just now",
      text: newCommentText,
      likes: 0,
      avatar: user?.avatar || "/images/actor_1.png"
    };
    setComments([newComment, ...comments]);
    setNewCommentText("");

    // Award +30 Cinephile points for posting a review
    if (isAuthenticated && movieId) {
      addReviewPoints(movieId, newCommentText);
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-black text-white tracking-tight mb-8">Community Discussion</h2>

      {/* Input box */}
      <div className="flex gap-4 items-start mb-8 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
          <img src="/images/actor_1.png" alt="User avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#EAB513]/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-500"
          />
          <Button 
            onClick={handlePostComment}
            className="w-fit bg-[#EAB513] hover:bg-[#C59E0C] text-black font-extrabold text-xs px-6 py-3 rounded-lg shadow-md cursor-pointer ml-auto"
          >
            Post
          </Button>
        </div>
      </div>

      {/* Selector tabs */}
      <div className="flex items-center gap-6 border-b border-white/5 pb-4 mb-8">
        {["Top", "Newest", "Friends"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold transition-all relative pb-4 cursor-pointer ${
              activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EAB513]"></div>
            )}
          </button>
        ))}
      </div>

      {/* Comment List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment, idx) => {
          // Nest the second comment (idx === 1) as a reply under the first (idx === 0) for mockup visuals
          const isNested = idx === 1;

          return (
            <div 
              key={idx} 
              className={`flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 transition-colors shadow-md ${
                isNested ? 'ml-12 border-l-2 border-l-[#EAB513]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
                <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-white text-sm">{comment.user}</span>
                  <span className="text-[10px] text-gray-500 font-bold">{comment.time}</span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed font-medium mb-4">
                  {comment.text}
                </p>
                
                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-all cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {comment.likes}
                  </button>
                  <button className="text-xs font-bold text-gray-500 hover:text-white transition-all cursor-pointer">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Discussion;
