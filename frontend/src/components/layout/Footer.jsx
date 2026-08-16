import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Video, Film } from 'lucide-react';

const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 pt-12 pb-8 px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-sm text-muted-foreground font-medium">
        <Link to="/" className="hover:text-primary transition-colors">About Us</Link>
        <a href="mailto:team@cinelith.com" className="hover:text-primary transition-colors">Contact (team@cinelith.com)</a>
        <a href="https://www.instagram.com/cinelithofficial" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
        <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <a href="https://www.instagram.com/cinelithofficial" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white" title="Instagram @cinelithofficial">
          <Instagram />
        </a>
        <a href="mailto:team@cinelith.com" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white" title="Email team@cinelith.com">
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} CINELITH. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
