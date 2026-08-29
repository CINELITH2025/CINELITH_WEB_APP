import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut } from 'lucide-react';
import useUserStore from '../../store/useUserStore';
import Logo from '../ui/Logo';
import MobileNav from './MobileNav';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/10 bg-[#08060d]/95 backdrop-blur-sm sticky top-0 z-50">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          {/* Logo with final ribbon path */}
          <Link to="/" className="flex items-center">
            <Logo className="h-9 w-auto" />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-white transition-colors">Explore</Link>
            <Link to="/people" className="hover:text-white transition-colors">People</Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:flex items-center group">
            <Search className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-[#EAB513] transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 w-48 lg:w-64 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-sm placeholder:text-gray-600 text-white"
            />
          </div>

          {/* Bell */}
          <Link to="/notifications" className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </Link>

          {/* Dynamic Auth Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Sign Out Icon */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* User Profile Avatar Link */}
              <Link 
                to="/profile" 
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer hover:border-[#EAB513] transition-colors shrink-0"
                title={`${user?.name}'s Profile`}
              >
                <img src={user?.avatar || "/images/actor_1.png"} alt="Profile" className="w-full h-full object-cover" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign In Button */}
              <Link 
                to="/auth"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm font-bold text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              {/* Default Placeholder linking to login */}
              <Link 
                to="/auth" 
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors shrink-0"
                title="Guest Profile"
              >
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-gray-500 font-bold">
                  ?
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </>
  );
};

export default Navbar;
