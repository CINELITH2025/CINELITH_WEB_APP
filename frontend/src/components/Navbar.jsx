import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Bookmark } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-background text-sm">
      {/* Logo */}
      <div className="flex items-center gap-12">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary">
          CINELITH
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 font-medium text-foreground/80">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/movies" className="hover:text-primary transition-colors">Movies</Link>
          <Link to="/movies" className="hover:text-primary transition-colors">Series</Link>
          <Link to="/actor/1" className="hover:text-primary transition-colors">People</Link>
          <Link to="/community" className="hover:text-primary transition-colors">Community</Link>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 w-64 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-sm placeholder:text-muted-foreground"
          />
        </div>

        {/* Icons */}
        <Link to="/notifications" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-foreground/80" />
        </Link>
        <Link to="/profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bookmark className="w-5 h-5 text-foreground/80" />
        </Link>

        {/* Avatar Placeholder */}
        <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden ml-2 border border-white/20 cursor-pointer hover:border-primary transition-colors">
          <img src="/images/actor_1.png" alt="Profile" className="w-full h-full object-cover" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
