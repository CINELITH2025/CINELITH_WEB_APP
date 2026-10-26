import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X } from "lucide-react";
import useUserStore from "../../store/useUserStore";

const ShareToChat = ({ open, onClose, payload }) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const sendMessage = useUserStore((state) => state.sendMessage);
  const friends = user?.friends || [];
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");

  if (!open || !payload) return null;

  const handleShare = (friend) => {
    const id = String(friend._id || friend);
    if (!id) return;
    try {
      sendMessage(id, payload.text, payload.share);
      setSentTo(friend.name || "Cinephile");
      setError("");
      setTimeout(() => {
        onClose?.();
        setSentTo("");
        navigate(`/messages?user=${id}`);
      }, 600);
    } catch (err) {
      setError(err.message || "Could not send. Open Messages once so chat connects.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#121016] border border-white/15 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-black text-white mb-1">Share to chat</h3>
        <p className="text-xs text-gray-500 font-medium mb-5 truncate">{payload.text}</p>

        {sentTo ? (
          <p className="text-sm font-bold text-[#F5BF26]">Sent to {sentTo}</p>
        ) : friends.length === 0 ? (
          <div className="text-sm text-gray-400">
            Connect with someone first.
            <button
              onClick={() => navigate("/people")}
              className="block mt-3 text-[#F5BF26] font-black text-xs uppercase"
            >
              Find people
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {friends.map((friend) => (
              <button
                key={String(friend._id || friend)}
                onClick={() => handleShare(friend)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F5BF26]/40 text-left"
              >
                <img
                  src={friend.avatar || "/images/actor_1.png"}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="flex-1 font-bold text-white text-sm">{friend.name || "Cinephile"}</span>
                <Send className="w-4 h-4 text-[#F5BF26]" />
              </button>
            ))}
          </div>
        )}
        {error ? <p className="text-xs text-red-400 font-semibold mt-3">{error}</p> : null}
      </div>
    </div>
  );
};

export default ShareToChat;
