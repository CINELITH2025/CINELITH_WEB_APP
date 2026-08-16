import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, LayoutDashboard, User, Lock } from 'lucide-react';
import useUserStore from '../../store/useUserStore';

const MobileNav = () => {
  const location = useLocation();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const navItems = [
    { label: 'Home', path: '/app', icon: Home, protected: false },
    { label: 'Explore', path: '/explore', icon: Compass, protected: false },
    { label: 'Discussions', path: '/people', icon: MessageCircle, protected: true },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { label: 'Profile', path: '/profile', icon: User, protected: true }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0812]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/explore' && location.pathname.startsWith('/movie/'));
          const isLocked = item.protected && !isAuthenticated;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#FACC15]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isLocked && (
                  <span className="absolute -top-1 -right-2 bg-[#FACC15] text-black text-[9px] p-0.5 rounded-full font-bold shadow-md">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FACC15] absolute -bottom-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
