import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const wishlist = [
  { image: "/images/poster_1.png" },
  { image: "/images/poster_2.png" },
  { image: "/images/poster_1.png" },
  { image: "/images/poster_2.png" },
  { image: "/images/poster_1.png" },
  { image: "/images/poster_2.png" }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("My Wishlist");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1000px] mx-auto pb-16 px-4 md:px-8 pt-12 flex flex-col items-center">
        {/* Profile Header */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 mb-6 p-1 bg-primary/10">
          <img src="/images/actor_1.png" alt="Sophia Carter" className="w-full h-full object-cover rounded-full" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Sophia Carter</h1>
          <p className="text-muted-foreground font-medium mb-3">@sophiacarter</p>
          <p className="text-sm text-foreground/80 max-w-sm mx-auto leading-relaxed italic">
            Film enthusiast | Aspiring director | Sharing my cinematic journey
          </p>
        </div>

        <Button className="w-full max-w-lg py-6 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-bold mb-10 transition-all">
          Edit Profile
        </Button>

        {/* Stats Summary */}
        <div className="w-full grid grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center group hover:border-primary/50 transition-colors">
            <p className="text-4xl font-bold text-primary mb-2">250</p>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">Followers</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center group hover:border-primary/50 transition-colors">
            <p className="text-4xl font-bold text-primary mb-2">180</p>
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full mb-8 flex border-b border-white/5">
          {["My Wishlist", "My Reviews", "My Lists"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </div>

        {/* Wishlist Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-20">
          {wishlist.map((item, idx) => (
            <div key={idx} className="aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-white/5 group cursor-pointer shadow-xl">
              <img src={item.image} alt="movie" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-8 text-left">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stat Box 1 */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Movies Watched</span>
              <span className="text-3xl font-bold text-white">520</span>
              <span className="text-xs font-bold text-green-400">+10%</span>
            </div>
            {/* Stat Box 2 */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Top Actor Watched</span>
              <span className="text-2xl font-bold text-white truncate">Ethan Blake</span>
              <span className="text-xs font-bold text-green-400">+5%</span>
            </div>
            {/* Stat Box 3 */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Favorite Genre</span>
              <span className="text-3xl font-bold text-white">Drama</span>
              <span className="text-xs font-bold text-green-400">+15%</span>
            </div>
            {/* Stat Box 4 */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Cinephile Score</span>
              <span className="text-3xl font-bold text-white">95</span>
              <span className="text-xs font-bold text-green-400">+20%</span>
            </div>
          </div>
          <button className="w-full text-center text-sm text-muted-foreground hover:text-white transition-colors font-medium">
            View Full Stats
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
