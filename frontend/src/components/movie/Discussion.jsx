import React, { useEffect, useMemo, useState } from 'react';
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useUserStore from '../../store/useUserStore';

const Discussion = ({ comments: initialComments, movieId, movieTitle, onCommentsChange }) => {
  const [activeTab, setActiveTab] = useState("Newest");
  const [comments, setComments] = useState(initialComments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const addReviewPoints = useUserStore((state) => state.addReviewPoints);
  const postMovieComment = useUserStore((state) => state.postMovieComment);
  const likeMovieComment = useUserStore((state) => state.likeMovieComment);
  const friendIds = (user?.friends || []).map((friend) => String(friend._id || friend));

  useEffect(() => {
    setComments(initialComments || []);
  }, [initialComments]);

  const publish = (next) => {
    setComments(next);
    onCommentsChange?.(next);
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !isAuthenticated) return;
    try {
      const saved = await postMovieComment(movieId, newCommentText.trim());
      publish([{ ...saved, replies: [] }, ...comments]);
      setNewCommentText("");
      addReviewPoints(movieId, newCommentText.trim(), movieTitle);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (parent) => {
    if (!replyText.trim() || !isAuthenticated) return;
    try {
      const saved = await postMovieComment(movieId, replyText.trim(), parent.id);
      publish(
        comments.map((comment) =>
          String(comment.id) === String(parent.id)
            ? { ...comment, replies: [...(comment.replies || []), saved] }
            : comment
        )
      );
      setReplyText("");
      setReplyTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const patchComment = (id, updated) => {
    publish(
      comments.map((comment) => {
        if (String(comment.id) === String(id)) return { ...comment, ...updated, replies: comment.replies || [] };
        return {
          ...comment,
          replies: (comment.replies || []).map((reply) =>
            String(reply.id) === String(id) ? { ...reply, ...updated } : reply
          )
        };
      })
    );
  };

  const handleLike = async (comment) => {
    if (!isAuthenticated) return;
    const me = String(user._id);
    const likedBy = comment.likedBy || [];
    const liked = likedBy.includes(me);
    patchComment(comment.id, {
      likes: Math.max(0, (comment.likes || 0) + (liked ? -1 : 1)),
      likedBy: liked ? likedBy.filter((id) => id !== me) : [...likedBy, me]
    });
    try {
      const saved = await likeMovieComment(movieId, comment.id);
      patchComment(comment.id, saved);
    } catch (err) {
      console.error(err);
    }
  };

  const visibleComments = useMemo(() => {
    let roots = [...comments];
    if (activeTab === "Friends") {
      roots = roots.filter((comment) => friendIds.includes(String(comment.userId)));
    }
    if (activeTab === "Top") {
      roots.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return roots;
  }, [comments, activeTab, friendIds]);

  const renderItem = (comment, isReply = false) => {
    const liked = isAuthenticated && (comment.likedBy || []).includes(String(user._id));
    return (
      <div key={comment.id} className={`flex gap-4 ${isReply ? "pt-4" : "p-5 rounded-2xl bg-white/5 border border-white/10 shadow-md"}`}>
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
          <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-white text-sm">{comment.user}</span>
            <span className="text-[10px] text-gray-500 font-bold">
              {comment.time ? new Date(comment.time).toLocaleString() : ""}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-medium mb-3">{comment.text}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment)}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                liked ? "text-[#F5BF26]" : "text-gray-500 hover:text-white"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-[#F5BF26]" : ""}`} />
              {comment.likes || 0}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyTo(String(replyTo) === String(comment.id) ? null : comment.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-white transition-all cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply
              </button>
            )}
          </div>
          {!isReply && String(replyTo) === String(comment.id) && (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${comment.user}...`}
                className="w-full min-h-[64px] bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F5BF26]/50"
              />
              <Button
                onClick={() => handleReply(comment)}
                disabled={!isAuthenticated || !replyText.trim()}
                className="w-fit bg-[#F5BF26] text-black font-extrabold text-xs px-4 py-2 rounded-lg"
              >
                Post reply
              </Button>
            </div>
          )}
          {!isReply && (comment.replies || []).length > 0 && (
            <div className="mt-4 ml-2 pl-4 border-l border-white/10 flex flex-col">
              {comment.replies.map((reply) => renderItem(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-black text-white tracking-tight mb-8">Community Discussion</h2>

      <div className="flex gap-4 items-start mb-8 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20">
          <img src={user?.avatar || "/images/actor_1.png"} alt="User avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a review..."
            className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5BF26]/50 focus:bg-white/10 transition-all text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handlePostComment}
            disabled={!isAuthenticated}
            className="w-fit bg-[#F5BF26] hover:bg-[#C59E0C] text-black font-extrabold text-xs px-6 py-3 rounded-lg shadow-md cursor-pointer ml-auto disabled:opacity-50"
          >
            {isAuthenticated ? "Post review" : "Sign in to post"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-white/5 pb-4 mb-8">
        {["Top", "Newest", "Friends"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold transition-all relative pb-4 cursor-pointer ${
              activeTab === tab ? "text-white" : "text-gray-500 hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5BF26]"></div>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {visibleComments.map((comment) => renderItem(comment))}
        {visibleComments.length === 0 && (
          <p className="text-sm text-gray-500 font-medium">No reviews in this thread yet.</p>
        )}
      </div>
    </section>
  );
};

export default Discussion;
