import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Plus } from 'lucide-react';

const pinnedChats = [
  { name: "Liam", snippet: "Sophia", avatar: "/images/actor_1.png" },
  { name: "Sophia", snippet: "Liam", avatar: "/images/actor_1.png" }
];

const recentChats = [
  { name: "Sophia", snippet: "Liam", avatar: "/images/actor_1.png" },
  { name: "Liam", snippet: "Sophia", avatar: "/images/actor_1.png" },
  { name: "Sophia", snippet: "Liam", avatar: "/images/actor_1.png" },
  { name: "Liam", snippet: "Sophia", avatar: "/images/actor_1.png" }
];

const Messages = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1000px] mx-auto pb-16 px-4 md:px-8 pt-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10">Messages</h1>
        
        {/* Pinned Chats */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-6">Pinned Chats</h2>
          <div className="flex flex-col gap-4">
            {pinnedChats.map((chat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">{chat.name}</span>
                  <span className="text-sm text-muted-foreground">{chat.snippet}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Conversations */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-6">Recent Conversations</h2>
          <div className="flex flex-col gap-4">
            {recentChats.map((chat, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                  <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">{chat.name}</span>
                  <span className="text-sm text-muted-foreground">{chat.snippet}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAB */}
        <button className="fixed bottom-12 right-12 w-14 h-14 bg-primary text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
          <Plus className="w-8 h-8" strokeWidth={3} />
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
