import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Video, Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 pt-12 pb-8 px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-sm text-muted-foreground font-medium">
        <Link to="#" className="hover:text-primary transition-colors">About Us</Link>
        <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
        <Link to="#" className="hover:text-primary transition-colors">FAQ</Link>
        <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <a href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
          <MessageCircle className="w-5 h-5" />
        </a>
        <a href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
          <Video className="w-5 h-5" />
        </a>
        <a href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
          <Film className="w-5 h-5" />
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground/60">
        @2024 CINELITH. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
