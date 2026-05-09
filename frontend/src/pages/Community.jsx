import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, ChevronDown } from 'lucide-react';

const communityUsers = [
  { name: "Sophia Bennett", role: "Film enthusiast", match: "80%", avatar: "/images/actor_1.png" },
  { name: "Ethan Carter", role: "Movie buff", avatar: "/images/actor_1.png" },
  { name: "Olivia Davis", role: "Cinema lover", avatar: "/images/actor_1.png" },
  { name: "Liam Foster", role: "Avid watcher", avatar: "/images/actor_1.png" },
  { name: "Ava Green", role: "Film critic", avatar: "/images/actor_1.png" },
  { name: "Noah Harris", role: "Indie film fan", avatar: "/images/actor_1.png" },
  { name: "Isabella Jones", role: "Classic movie lover", avatar: "/images/actor_1.png" },
  { name: "Jackson King", role: "Documentary enthusiast", avatar: "/images/actor_1.png" },
  { name: "Mia Lewis", role: "Foreign film aficionado", avatar: "/images/actor_1.png" },
  { name: "Lucas Morgan", role: "Horror movie fan", avatar: "/images/actor_1.png" },
  { name: "Chloe Nelson", role: "Sci-fi movie lover", avatar: "/images/actor_1.png" },
  { name: "Owen Parker", role: "Comedy movie fan", avatar: "/images/actor_1.png" }
];

const suggestedUsers = [
  { name: "Caleb Reed", avatar: "/images/actor_1.png" },
  { name: "Emma Turner", avatar: "/images/actor_1.png" },
  { name: "Daniel Walker", avatar: "/images/actor_1.png" },
  { name: "Grace Young", avatar: "/images/actor_1.png" },
  { name: "Henry Adams", avatar: "/images/actor_1.png" },
  { name: "Isabelle Baker", avatar: "/images/actor_1.png" }
];

const Community = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto pb-16 px-4 md:px-8 pt-8">
        {/* Search & Filters */}
        <div className="mb-12 flex flex-col gap-6">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-base placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {["Favorite Actor", "Genre", "Taste Match %", "Activity Level", "Location"].map((filter) => (
              <button
                key={filter}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {filter}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-20">
          {communityUsers.map((user, idx) => (
            <div key={idx} className="flex flex-col group cursor-pointer">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-white/5 border border-white/5">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                {user.match && (
                  <div className="absolute bottom-2 right-2 bg-primary/90 text-black text-[10px] font-black px-2 py-1 rounded-md backdrop-blur-md shadow-lg">
                    {user.match} Match
                  </div>
                )}
              </div>
              <h3 className="font-bold text-white text-sm md:text-base leading-tight group-hover:text-primary transition-colors">{user.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{user.role}</p>
            </div>
          ))}
        </div>

        {/* Suggested Users */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-10">Suggested Users</h2>
          <div className="flex flex-wrap items-center gap-10 md:gap-14 justify-between">
            {suggestedUsers.map((user, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all p-1 bg-white/5">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary transition-colors text-center whitespace-nowrap">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
