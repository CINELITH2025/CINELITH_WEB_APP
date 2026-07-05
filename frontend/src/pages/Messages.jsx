import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Search, Send, Film, MessageCircle, Phone, Video, Info, User, CheckCheck } from 'lucide-react';
import useUserStore from '../store/useUserStore';

// Preset avatar and details for community contacts to ensure high visual quality
const CONTACT_METADATA = {
  "Liam": { avatar: "/images/actor_1.png", role: "Nolan Fanatic", match: "94%" },
  "Sophia": { avatar: "/images/actor_1.png", role: "Indie Film Critic", match: "89%" },
  "Ethan": { avatar: "/images/actor_1.png", role: "Sci-Fi Geek", match: "82%" },
  "Olivia": { avatar: "/images/actor_1.png", role: "Classic Noir Lover", match: "78%" },
  "Caleb": { avatar: "/images/actor_1.png", role: "Tarantino Scholar", match: "85%" },
  "Emma": { avatar: "/images/actor_1.png", role: "Horror Buff", match: "73%" }
};

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userParam = searchParams.get('user');

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.user);
  const chats = useUserStore((state) => state.chats) || {};
  const sendMessage = useUserStore((state) => state.sendMessage);

  // Default fallback if a contact is not in pre-seeded logs
  const [activeContact, setActiveContact] = useState("Liam");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const messageEndRef = useRef(null);

  // Redirect if anonymous
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/auth');
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Set active contact from URL parameter if passed
  useEffect(() => {
    if (userParam && CONTACT_METADATA[userParam]) {
      setActiveContact(userParam);
    }
  }, [userParam]);

  // Scroll to bottom of message list on updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeContact, isTyping]);

  // Handle typing indicator simulation
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeContact, inputText.trim());
    setInputText("");
    setIsTyping(true);

    // Turn off typing indicator after simulated reply time
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const showFeatureNotice = (featureName) => {
    setNotificationMsg(`${featureName} calls are coming in a post-MVP update!`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Combine pre-defined contacts with metadata
  const contactsList = Object.keys(CONTACT_METADATA).map(name => {
    const meta = CONTACT_METADATA[name];
    const log = chats[name] || [];
    const lastMsg = log[log.length - 1];
    return {
      name,
      avatar: meta.avatar,
      role: meta.role,
      match: meta.match,
      lastText: lastMsg ? lastMsg.text : "No messages yet",
      lastTime: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""
    };
  });

  // Filter contacts list by search query
  const filteredContacts = contactsList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeLog = chats[activeContact] || [];
  const activeMeta = CONTACT_METADATA[activeContact] || { avatar: "/images/actor_1.png", role: "Cinephile", match: "80%" };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#FACC15] text-black text-xs font-black px-6 py-3 rounded-full shadow-2xl z-50 animate-bounce">
          {notificationMsg}
        </div>
      )}

      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8 flex gap-6 min-h-[calc(100vh-140px)]">
        
        {/* === LEFT COLUMN: CONVERSATION SIDEBAR === */}
        <div className="w-full md:w-[350px] shrink-0 bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col gap-6 shadow-2xl h-[650px]">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white tracking-tight">Messages</h1>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              1-on-1 Chat
            </div>
          </div>

          {/* Search bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat or taste..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-xs placeholder:text-gray-600 text-white"
            />
          </div>

          {/* Sidebar scrollable contacts */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-white/10">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((c) => {
                const isActive = activeContact === c.name;
                return (
                  <div
                    key={c.name}
                    onClick={() => setActiveContact(c.name)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all border group ${
                      isActive
                        ? 'bg-[#FACC15]/10 border-[#FACC15]/30 text-white'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    {/* Avatar with dynamic online indicator */}
                    <div className="relative shrink-0 w-11 h-11 rounded-full overflow-hidden border border-white/10">
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background shadow-md"></div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-extrabold text-sm text-white group-hover:text-[#FACC15] transition-colors">{c.name}</span>
                        <span className="text-[10px] text-gray-500 font-bold">{c.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium truncate mb-1">{c.role}</p>
                      <p className={`text-xs truncate ${isActive ? 'text-gray-300 font-medium' : 'text-gray-400 font-medium'}`}>
                        {c.lastText}
                      </p>
                    </div>

                    {/* Compatibility Match overlay */}
                    <div className="text-[9px] font-black bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400 shrink-0">
                      {c.match} Match
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600 text-xs font-semibold">No contacts found</p>
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN: CHAT WINDOW === */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl h-[650px] relative">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/10">
                <img src={activeMeta.avatar} alt={activeContact} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background shadow-md"></div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-black text-sm text-white leading-tight tracking-tight">{activeContact}</h3>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Online • Taste Match: {activeMeta.match}</span>
              </div>
            </div>

            {/* Quick Action Calls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => showFeatureNotice("Voice")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button 
                onClick={() => showFeatureNotice("Video")}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer text-gray-400 hover:text-white"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages scroll pane */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
            {activeLog.map((msg, index) => {
              const isMe = msg.sender === "You";
              return (
                <div key={index} className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  {/* Message bubble */}
                  <div className={`p-4.5 rounded-2xl text-sm font-medium leading-relaxed shadow-lg ${
                    isMe 
                      ? 'bg-[#FACC15] text-black rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {/* Message meta information */}
                  <div className="flex items-center gap-1.5 mt-1.5 px-1">
                    <span className="text-[9px] text-gray-500 font-bold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#FACC15]" />}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator Bubble */}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[70%] self-start">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Send form footer */}
          <form onSubmit={handleSend} className="p-4 bg-black/10 border-t border-white/10 flex items-center gap-3.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send a message to ${activeContact}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4.5 text-xs md:text-sm focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-white placeholder:text-gray-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-4.5 rounded-2xl bg-[#FACC15] hover:bg-[#E2B710] disabled:bg-white/5 disabled:text-gray-600 text-black transition-all shadow-lg shrink-0 cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              title="Send Message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Messages;
