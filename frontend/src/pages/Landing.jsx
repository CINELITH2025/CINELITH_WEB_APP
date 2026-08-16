import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Sparkles, Trophy, Award, Lock,
  Check, X, ChevronDown, ChevronUp, Loader2, Mail, 
  ShieldCheck, Star, ArrowUpRight, Compass, Activity,
  ChevronLeft, ChevronRight, Film, Globe, User
} from 'lucide-react';
import Cinema3DStage from '../components/ui/Cinema3DStage';

// Custom inline SVG icons since brand icons are not in the installed lucide-react version
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Helper to determine API URL
const API_URL = import.meta.env.DEV ? 'http://localhost:5050/api' : '/api';

const POSTERS = [
  { title: "Interstellar", director: "Christopher Nolan", url: "/images/poster_1.jpg" },
  { title: "Inception", director: "Christopher Nolan", url: "/images/poster_2.jpg" },
  { title: "The Dark Knight", director: "Christopher Nolan", url: "/images/poster_3.jpg" },
  { title: "Dune: Part Two", director: "Denis Villeneuve", url: "/images/poster_4.jpg" },
  { title: "Oppenheimer", director: "Christopher Nolan", url: "/images/poster_5.jpg" },
  { title: "Barbie", director: "Greta Gerwig", url: "/images/poster_6.jpg" },
  { title: "La La Land", director: "Damien Chazelle", url: "/images/poster_7.jpg" },
  { title: "Pulp Fiction", director: "Quentin Tarantino", url: "/images/poster_8.jpg" },
  { title: "Fight Club", director: "David Fincher", url: "/images/poster_9.jpg" },
  { title: "The Matrix", director: "Lana Wachowski", url: "/images/poster_10.jpg" },
  { title: "Parasite", director: "Bong Joon-ho", url: "/images/poster_11.jpg" },
  { title: "The Shawshank Redemption", director: "Frank Darabont", url: "/images/poster_12.jpg" },
  { title: "The Godfather", director: "Francis Ford Coppola", url: "/images/poster_13.jpg" },
  { title: "Blade Runner 2049", director: "Denis Villeneuve", url: "/images/poster_14.jpg" },
  { title: "Whiplash", director: "Damien Chazelle", url: "/images/poster_15.jpg" },
  { title: "Spirited Away", director: "Hayao Miyazaki", url: "/images/poster_16.jpg" },
  { title: "Spider-Man: Into the Spider-Verse", director: "Peter Ramsey", url: "/images/poster_17.jpg" },
  { title: "Gladiator", director: "Ridley Scott", url: "/images/poster_18.jpg" },
  { title: "Django Unchained", director: "Quentin Tarantino", url: "/images/poster_19.jpg" },
  { title: "Your Name.", director: "Makoto Shinkai", url: "/images/poster_20.jpg" },
  { title: "Inglourious Basterds", director: "Quentin Tarantino", url: "/images/poster_21.jpg" },
  { title: "Avatar", director: "James Cameron", url: "/images/poster_22.jpg" },
  { title: "Star Wars: A New Hope", director: "George Lucas", url: "/images/poster_23.jpg" },
  { title: "The Lord of the Rings: The Fellowship of the Ring", director: "Peter Jackson", url: "/images/poster_24.jpg" },
  { title: "Forrest Gump", director: "Robert Zemeckis", url: "/images/poster_25.jpg" }
];

const Landing = () => {
  // Waitlist form states
  const [formData, setFormData] = useState({ name: '', email: '', country: '', favoriteMovie: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waitlistCount, setWaitlistCount] = useState(384);
  const [userQueueNum, setUserQueueNum] = useState(null);

  // FAQ states
  const [openFaq, setOpenFaq] = useState(null);

  // Autoplay for movie posters carousel
  const [activePosterIndex, setActivePosterIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePosterIndex((prev) => (prev + 1) % 25);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Preview tab state
  const [activePreviewTab, setActivePreviewTab] = useState('Home Page');

  // Fetch waitlist count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${API_URL}/waitlist/count`);
        if (res.ok) {
          const data = await res.json();
          setWaitlistCount(data.count);
        }
      } catch (err) {
        console.warn("Could not fetch waitlist count:", err);
      }
    };
    fetchCount();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setSuccess(true);
      setUserQueueNum(waitlistCount + 1);
      setWaitlistCount(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Smooth scroll handler
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock previews for Product Preview section
  const previewTabs = [
    { id: 'Home Page', label: 'Home Page' },
    { id: 'Movie Detail Page', label: 'Movie Detail Page' },
    { id: 'Actor Profile', label: 'Actor Profile' },
    { id: 'Dashboard', label: 'Dashboard' },
    { id: 'Community Discussions', label: 'Discussions' }
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-white overflow-x-hidden font-sans relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-radial from-[#F4C618]/10 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] -right-[30%] w-[80%] h-[80%] rounded-full bg-radial from-[#F4C430]/8 to-transparent blur-[120px]" />
        <div className="absolute top-[60%] -left-[30%] w-[85%] h-[85%] rounded-full bg-radial from-[#F4C618]/5 to-transparent blur-[150px]" />
      </div>

      {/* A. FLOATING NAVIGATION */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 transition-all duration-300">
        <div className="backdrop-blur-xl bg-[#111111]/70 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-full px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/images/logo_text.png" alt="CINELITH" className="h-10 md:h-11 w-auto object-contain" />
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#B5B5B5]">
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
            <button onClick={() => scrollToSection('preview')} className="hover:text-white transition-colors cursor-pointer">Preview</button>
            <button onClick={() => scrollToSection('roadmap')} className="hover:text-white transition-colors cursor-pointer">Roadmap</button>
            <button onClick={() => scrollToSection('community')} className="hover:text-white transition-colors cursor-pointer">Community</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ</button>
          </div>

          {/* CTA */}
          <div>
            <button 
              onClick={() => scrollToSection('signup')}
              className="bg-gradient-to-r from-[#F4C618] to-[#F4C430] hover:from-[#F5C400] hover:to-[#E2B220] text-black font-semibold text-xs md:text-sm px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(244,198,24,0.3)] hover:shadow-[0_0_25px_rgba(244,198,24,0.5)] cursor-pointer"
            >
              Join Early Access
            </button>
          </div>
        </div>
      </nav>

      {/* B. HERO SECTION */}
            <section className="min-h-screen flex flex-col justify-center items-center pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10 text-center">
        
        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
          
          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] text-white"
          >
            Discover. Discuss. <br />
            <span className="text-[#F4C618] filter drop-shadow-[0_0_30px_rgba(244,198,24,0.15)]">
              Connect Through Cinema.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[#B5B5B5] text-base md:text-xl max-w-2xl font-normal leading-relaxed"
          >
            A premium space for film enthusiasts. No clutter, no noise. Just beautiful curation and meaningful conversation.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-2"
          >
            <button 
              onClick={() => scrollToSection('signup')}
              className="bg-[#F4C618] hover:bg-[#F4C430] text-black font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-[0_0_40px_rgba(244,198,24,0.35)] hover:shadow-[0_0_50px_rgba(244,198,24,0.55)] transform hover:scale-105 cursor-pointer text-sm md:text-base tracking-wide"
            >
              Secure Your Spot
            </button>
          </motion.div>
        </div>

        {/* Widescreen Dashboard Mockup Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="w-full max-w-5xl mt-16 border border-white/[0.08] bg-[#0c0c0c]/90 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-md relative"
        >
          {/* Top Widescreen Title Bar */}
          <div className="bg-[#111111]/80 border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-white/[0.1]" />
              <span className="w-3 h-3 rounded-full bg-white/[0.1]" />
              <span className="w-3 h-3 rounded-full bg-white/[0.1]" />
            </div>
            {/* Center Icons Menu */}
            <div className="flex items-center gap-6 text-[#B5B5B5]">
              <div className="w-4 h-4 bg-white/[0.4] rounded-sm animate-pulse" />
              <div className="w-4 h-4 bg-white/[0.15] rounded-sm" />
              <div className="w-4 h-4 bg-white/[0.15] rounded-sm" />
              <div className="w-4 h-4 bg-white/[0.15] rounded-sm" />
              <div className="w-4 h-4 bg-white/[0.15] rounded-sm" />
              <div className="w-4 h-4 bg-white/[0.15] rounded-sm" />
            </div>
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-[#F4C618] text-black font-black text-[9px] flex items-center justify-center">VA</div>
            </div>
          </div>

          {/* Grid Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 min-h-[360px] items-center">
            
            {/* Widescreen Overlapping Movie Posters Carousel */}
            <div className="lg:col-span-8 flex justify-center items-center relative min-h-[320px]">
              
              {/* Overlapping Poster Stack with Slidable Controls */}
              <div className="relative w-full max-w-xl h-[320px] flex items-center justify-center overflow-hidden group/carousel">
                
                {/* Left Arrow */}
                <button 
                  type="button"
                  onClick={() => setActivePosterIndex((prev) => (prev - 1 + 25) % 25)}
                  className="absolute left-2 z-40 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full border border-white/10 transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/carousel:opacity-100 duration-300 focus:outline-none"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Posters Wrapper */}
                <div className="flex items-center justify-center relative w-full h-full">
                  {POSTERS.map((poster, idx) => {
                    let offset = idx - activePosterIndex;
                    if (offset < -12) offset += 25;
                    if (offset > 12) offset -= 25;

                    const isVisible = offset >= -2 && offset <= 2;
                    if (!isVisible) return null;

                    let transformClass = "";
                    let zIndexClass = 0;
                    let opacityClass = 0;
                    let scaleClass = 1;
                    let borderClass = "border-white/10";
                    let shadowClass = "shadow-2xl";

                    if (offset === 0) {
                      transformClass = "translate-x-0 rotate-0 z-30 opacity-100 scale-100 pointer-events-auto";
                      borderClass = "border-[#F4C618] border-2";
                      shadowClass = "shadow-[0_0_40px_rgba(244,198,24,0.25)]";
                    } else if (offset === -1) {
                      transformClass = "-translate-x-20 md:-translate-x-28 -rotate-6 z-20 opacity-75 scale-90 pointer-events-auto";
                    } else if (offset === 1) {
                      transformClass = "translate-x-20 md:translate-x-28 rotate-6 z-20 opacity-75 scale-90 pointer-events-auto";
                    } else if (offset === -2) {
                      transformClass = "-translate-x-36 md:-translate-x-52 -rotate-12 z-10 opacity-30 scale-80 pointer-events-auto";
                    } else if (offset === 2) {
                      transformClass = "translate-x-36 md:translate-x-52 rotate-12 z-10 opacity-30 scale-80 pointer-events-auto";
                    }

                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePosterIndex(idx)}
                        className={`absolute w-36 md:w-44 aspect-[2/3] bg-neutral-900 border rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out select-none ${transformClass} ${borderClass} ${shadowClass}`}
                      >
                        <img 
                          src={poster.url} 
                          alt={poster.title} 
                          className="w-full h-full object-cover pointer-events-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent flex flex-col justify-end p-3 text-left">
                          {offset === 0 ? (
                            <>
                              <span className="text-[#F4C618] text-[9px] font-black tracking-widest uppercase">NOW PREVIEWING</span>
                              <h5 className="text-xs md:text-sm font-black text-white leading-tight mt-0.5 truncate">{poster.title}</h5>
                              <span className="text-[9px] text-[#B5B5B5] truncate mt-0.5">Directed by {poster.director}</span>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold tracking-tight text-white/70 truncate">{poster.title}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Arrow */}
                <button 
                  type="button"
                  onClick={() => setActivePosterIndex((prev) => (prev + 1) % 25)}
                  className="absolute right-2 z-40 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full border border-white/10 transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/carousel:opacity-100 duration-300 focus:outline-none"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>

            </div>

            {/* Dashboard Visual Analytics */}
            <div className="lg:col-span-4 space-y-6 text-left border-l border-white/[0.06] pl-0 lg:pl-8">
              
              {/* Custom Wave/Frequency Graph */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#B5B5B5] uppercase tracking-wider block">Rating Frequency</span>
                <div className="bg-[#151515] p-3 rounded-xl border border-white/[0.04]">
                  <svg viewBox="0 0 200 80" className="w-full h-16 text-[#F4C618]">
                    <path d="M0,50 Q25,20 50,55 T100,20 T150,60 T200,30" fill="none" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M0,50 Q25,20 50,55 T100,20 T150,60 T200,30 L200,80 L0,80 Z" fill="url(#wave-gradient)" opacity="0.1" />
                    <defs>
                      <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F4C618" />
                        <stop offset="100%" stopColor="#F4C618" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Spider/Radar Taste Profiles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#151515] p-3 rounded-xl border border-white/[0.04] flex flex-col items-center">
                  <span className="text-[9px] font-bold text-[#B5B5B5] uppercase tracking-wider mb-2">Taste Radar</span>
                  <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#F4C618]">
                    <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <polygon points="50,25 80,45 65,75 35,75 22,48" fill="rgba(255, 214, 10, 0.2)" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="bg-[#151515] p-3 rounded-xl border border-white/[0.04] flex flex-col items-center">
                  <span className="text-[9px] font-bold text-[#B5B5B5] uppercase tracking-wider mb-2">Era breakdown</span>
                  <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#F4C430]">
                    <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <polygon points="50,35 70,50 60,65 40,65 30,50" fill="rgba(244, 196, 48, 0.2)" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Recent Active Users */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#B5B5B5] uppercase tracking-wider block">Recent Discussions</span>
                <div className="space-y-2">
                  {[
                    { name: 'Dave', text: 'Nolan does it again.', level: 'Lv.4' },
                    { name: 'Sarah', text: 'Loved the cinematography!', level: 'Lv.9' }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-[#151515] px-3 py-2 rounded-lg border border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-neutral-700 text-[8px] font-bold flex items-center justify-center text-white">{user.name[0]}</div>
                        <span className="font-bold text-white/90">{user.name}</span>
                        <span className="text-[9px] text-[#B5B5B5] truncate max-w-[120px]">"{user.text}"</span>
                      </div>
                      <span className="text-[8px] bg-[#F4C618]/10 text-[#F4C618] px-1.5 py-0.5 rounded font-black">{user.level}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </section>

      {/* C. PROBLEM STATEMENT */}
      <section id="problem" className="py-24 bg-[#111111] border-y border-white/[0.04] relative z-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">The Problem</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Movie Discovery Shouldn't Be This Complicated
            </h3>
          </div>

          {/* Visual Flow diagram */}
          <div className="bg-[#090909] border border-white/[0.06] rounded-3xl p-8 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                🔍 Google
              </div>
              <span className="text-[#B5B5B5] md:rotate-0 rotate-90">➔</span>
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                📊 IMDb
              </div>
              <span className="text-[#B5B5B5] md:rotate-0 rotate-90">➔</span>
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                💚 Letterboxd
              </div>
              <span className="text-[#B5B5B5] md:rotate-0 rotate-90">➔</span>
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                📺 OTT Apps
              </div>
              <span className="text-[#B5B5B5] md:rotate-0 rotate-90">➔</span>
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                🎥 YouTube
              </div>
              <span className="text-[#B5B5B5] md:rotate-0 rotate-90">➔</span>
              
              <div className="bg-[#1A1A1A] px-4 py-3 rounded-xl border border-white/[0.05] text-xs font-semibold min-w-[120px] hover:border-red-500/30 transition-all">
                🤖 Reddit
              </div>

            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-6 flex flex-col items-center">
              <div className="text-red-500/90 text-sm font-semibold uppercase tracking-wider mb-2">
                The Frustrating Result:
              </div>
              <div className="text-2xl md:text-3xl font-black text-white">
                Information Everywhere. <span className="text-red-500">Decision Nowhere.</span>
              </div>
            </div>
          </div>

          <p className="text-[#B5B5B5] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Today, discovering what to watch requires jumping between multiple platforms, comparing ratings, searching reviews, and reading endless opinions. The experience is fragmented, time-consuming, and lacks personalization.
          </p>

          <div className="pt-4">
            <div className="inline-block bg-[#F4C618]/10 border border-[#F4C618]/20 px-6 py-3 rounded-2xl text-[#F4C618] font-bold text-sm md:text-base">
              ✨ CINELITH brings everything together in one seamless experience.
            </div>
          </div>

        </div>
      </section>

      {/* D. ABOUT CINELITH / FEATURES */}
      <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-black text-gray-200 tracking-tight">
            A unified cinematic experience.
          </h3>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Movie Discovery */}
          <div className="md:col-span-8 bg-[#141414] border border-white/[0.08] hover:border-[#F4C618]/40 transition-all duration-300 rounded-3xl p-8 min-h-[300px] flex flex-col md:flex-row justify-between relative overflow-hidden group">
            
            {/* Left Content Column */}
            <div className="w-full md:w-[48%] flex flex-col justify-between relative z-20 h-full min-h-[180px] md:min-h-0">
              <div className="w-10 h-10 rounded-full bg-[#F4C618]/10 border border-[#F4C618]/30 text-[#F4C618] flex items-center justify-center mb-6">
                <Compass className="w-5 h-5" />
              </div>
              
              <div>
                <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Movie Discovery</h4>
                <p className="text-sm text-[#B5B5B5] leading-relaxed font-medium">
                  Find hidden gems curated by a community that shares your specific cinematic language.
                </p>
              </div>
            </div>

            {/* Right Cinematic Background Column */}
            <div className="w-full md:w-[52%] h-[220px] md:h-full md:absolute md:right-0 md:top-0 z-10 border-t md:border-t-0 md:border-l border-white/[0.06] relative overflow-hidden group/bg mt-6 md:mt-0">
              <img 
                src="/images/hero_bg.png" 
                alt="Movie Discovery" 
                className="w-full h-full object-cover opacity-60 scale-105 group-hover/bg:scale-110 transition-transform duration-700 filter brightness-90" 
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
            </div>

          </div>

          {/* Card 2: Personal Dashboard */}
          <div className="md:col-span-4 bg-[#141414] border border-white/[0.08] hover:border-[#F4C618]/40 transition-all duration-300 rounded-3xl p-8 min-h-[300px] flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-xl bg-[#F4C618]/10 border border-[#F4C618]/30 text-[#F4C618] flex items-center justify-center mb-6">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Personal Dashboard</h4>
              <p className="text-sm text-[#B5B5B5] leading-relaxed font-medium">
                Your entire film history, elegantly visualized.
              </p>
            </div>
          </div>

          {/* Card 3: Taste Analytics */}
          <div className="md:col-span-4 bg-[#141414] border border-white/[0.08] hover:border-[#F4C618]/40 transition-all duration-300 rounded-3xl p-8 min-h-[300px] flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-xl bg-[#F4C618]/10 border border-[#F4C618]/30 text-[#F4C618] flex items-center justify-center mb-6">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Taste Analytics</h4>
              <p className="text-sm text-[#B5B5B5] leading-relaxed font-medium">
                Deep dive into your viewing habits with beautiful, insightful charts.
              </p>
            </div>
          </div>

          {/* Card 4: Community & Discussions */}
          <div className="md:col-span-8 bg-[#141414] border border-white/[0.08] hover:border-[#F4C618]/40 transition-all duration-300 rounded-3xl p-8 min-h-[300px] flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-xl bg-[#F4C618]/10 border border-[#F4C618]/30 text-[#F4C618] flex items-center justify-center mb-6">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Community & Discussions</h4>
              <p className="text-sm text-[#B5B5B5] leading-relaxed max-w-xl font-medium">
                Engage in nuanced conversations. Form clubs based on directors, genres, or eras.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* D2. DYNAMIC 3D CINEMA STAGE */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <Cinema3DStage />
      </section>

      {/* E. PRODUCT PREVIEW */}
      <section id="preview" className="py-24 bg-[#111111] border-y border-white/[0.04] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">Product Preview</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              A Glimpse Inside the Theatre
            </h3>
            <p className="text-[#B5B5B5] max-w-xl mx-auto text-sm md:text-base">
              Only showing a preview of what's to come. We do not reveal every secret interaction just yet.
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto bg-[#090909] p-1.5 border border-white/[0.05] rounded-2xl">
            {previewTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActivePreviewTab(tab.id);
                  if (tab.id !== 'Home Page' && !isAuthenticated) {
                    scrollToSection('signup');
                  }
                }}
                className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activePreviewTab === tab.id 
                    ? 'bg-[#F4C618] text-black shadow-md' 
                    : 'text-[#B5B5B5] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Simulator Box */}
          <div className="max-w-5xl mx-auto bg-[#090909] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
            
            {/* macOS Browser Header */}
            <div className="bg-[#111111] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.05] rounded-full px-8 py-1 text-[11px] text-[#B5B5B5] w-72 text-center select-none truncate">
                cinelith.com/app/{activePreviewTab.toLowerCase().replace(/\s+/g, '-')}
              </div>
              <div className="w-12" /> {/* spacer */}
            </div>

            {/* Sim Content Area */}
            <div className="p-6 md:p-8 min-h-[420px] flex items-center justify-center bg-[#090909] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreviewTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {/* HOME PAGE PREVIEW */}
                  {activePreviewTab === 'Home Page' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                        <h4 className="font-extrabold text-lg text-white flex items-center gap-2">
                          <Compass className="w-5 h-5 text-[#F4C618]" /> Discover Cinema
                        </h4>
                        <span className="text-xs text-[#B5B5B5]">Showing 28,491 movies</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: 'Interstellar', year: '2014', rating: '9.2', genre: 'Sci-Fi', poster: '/images/interstellar.jpg' },
                          { title: 'Inception', year: '2010', rating: '8.8', genre: 'Action', poster: '/images/inception.jpg' },
                          { title: 'Pulp Fiction', year: '1994', rating: '8.9', genre: 'Crime', poster: '/images/pulpfiction.jpg' },
                          { title: 'Parasite', year: '2019', rating: '8.6', genre: 'Thriller', poster: '/images/parasite.jpg' }
                        ].map((m, idx) => (
                          <div key={idx} className="bg-[#1A1A1A] border border-white/[0.05] rounded-xl overflow-hidden group hover:border-[#F4C618]/40 transition-all p-3">
                            <div className="w-full aspect-[2/3] bg-neutral-900 border border-white/5 rounded-lg mb-3 overflow-hidden">
                              <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-[#B5B5B5] mb-1">
                              <span>{m.genre}</span>
                              <span className="text-[#F4C618]">★ {m.rating}</span>
                            </div>
                            <h5 className="font-bold text-xs text-white truncate">{m.title}</h5>
                            <span className="text-[10px] text-[#B5B5B5]">{m.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Non-Home Tabs Lock Gate for unauthenticated guests */}
                  {activePreviewTab !== 'Home Page' && !isAuthenticated ? (
                    <div className="text-center space-y-4 p-8 bg-[#121019]/90 border border-[#F4C618]/30 rounded-2xl max-w-md mx-auto backdrop-blur-md">
                      <div className="w-12 h-12 rounded-xl bg-[#F4C618]/10 text-[#F4C618] flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-black text-white">Sign Up to Unlock Preview</h4>
                      <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        Join the early access waitlist to unlock full interactive previews for <b className="text-white">{activePreviewTab}</b>.
                      </p>
                      <button
                        onClick={() => scrollToSection('signup')}
                        className="bg-[#F4C618] hover:bg-yellow-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer"
                      >
                        Join Early Access Form →
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* MOVIE DETAIL PAGE PREVIEW */}
                      {activePreviewTab === 'Movie Detail Page' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                          <div className="md:col-span-4 aspect-[2/3] bg-neutral-900 border border-white/[0.05] rounded-2xl overflow-hidden shadow-lg">
                            <img src="/images/interstellar.jpg" alt="Interstellar" className="w-full h-full object-cover" />
                          </div>
                          <div className="md:col-span-8 space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-[#F4C618]/10 text-[#F4C618] text-[10px] px-2 py-0.5 rounded font-bold">Sci-Fi</span>
                              <span className="text-xs text-[#B5B5B5]">2014 • 2h 49m</span>
                            </div>
                            <h4 className="text-2xl font-black">Interstellar</h4>
                            <p className="text-xs text-[#B5B5B5] leading-relaxed">
                              A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.
                            </p>
                            
                            <div className="border-t border-b border-white/[0.05] py-3 flex gap-6 text-center">
                              <div>
                                <span className="text-xs text-[#B5B5B5] block">Average Rating</span>
                                <span className="text-lg font-bold text-[#F4C618]">★ 9.2</span>
                              </div>
                              <div>
                                <span className="text-xs text-[#B5B5B5] block">Your Rating</span>
                                <span className="text-lg font-bold text-purple-400">★ 10.0</span>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-white mb-2">Popular Discussion Thread</h5>
                              <div className="bg-[#1A1A1A] p-3 rounded-xl border border-white/[0.04] text-xs">
                                <span className="font-bold text-[#F4C618]">@nolan_fanatic:</span> "The library scene still brings tears. Best space odyssey ever."
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ACTOR PROFILE PREVIEW */}
                      {activePreviewTab === 'Actor Profile' && (
                        <div className="space-y-6 text-left">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex-shrink-0 overflow-hidden shadow-lg">
                              <img src="/images/chalamet.jpg" alt="Timothée Chalamet" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">Timothée Chalamet</h4>
                              <p className="text-xs text-[#B5B5B5]">Actor • 29 years old • USA</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-[10px] bg-white/[0.04] border border-white/[0.05] text-[#B5B5B5] px-2 py-0.5 rounded">Dune</span>
                                <span className="text-[10px] bg-white/[0.04] border border-white/[0.05] text-[#B5B5B5] px-2 py-0.5 rounded">Interstellar</span>
                                <span className="text-[10px] bg-white/[0.04] border border-white/[0.05] text-[#B5B5B5] px-2 py-0.5 rounded">Wonka</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-[#B5B5B5]">Filmography Performance</h5>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-[#1A1A1A] border border-white/[0.04] p-3 rounded-xl text-center">
                                <span className="text-xs text-[#B5B5B5] block">Dune: Part Two</span>
                                <span className="text-sm font-bold text-[#F4C618]">★ 9.4</span>
                              </div>
                              <div className="bg-[#1A1A1A] border border-white/[0.04] p-3 rounded-xl text-center">
                                <span className="text-xs text-[#B5B5B5] block">Call Me By Your Name</span>
                                <span className="text-sm font-bold text-[#F4C618]">★ 8.8</span>
                              </div>
                              <div className="bg-[#1A1A1A] border border-white/[0.04] p-3 rounded-xl text-center">
                                <span className="text-xs text-[#B5B5B5] block">Little Women</span>
                                <span className="text-sm font-bold text-[#F4C618]">★ 8.4</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DASHBOARD PREVIEW */}
                      {activePreviewTab === 'Dashboard' && (
                        <div className="space-y-6 text-left">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-sm uppercase tracking-wider text-[#B5B5B5] flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-[#F4C618]" /> Your Cinematic Identity
                            </h4>
                            <span className="text-xs text-green-500 font-semibold">+4 watched this week</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#1A1A1A] border border-white/[0.04] p-4 rounded-xl space-y-3">
                              <span className="text-xs font-semibold text-[#B5B5B5]">Director Preference</span>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span>C. Nolan</span> <span className="font-bold">38%</span></div>
                                <div className="w-full h-1 bg-white/[0.05] rounded-full"><div className="bg-[#F4C618] w-[38%] h-full rounded-full" /></div>
                                <div className="flex justify-between"><span>D. Villeneuve</span> <span className="font-bold">24%</span></div>
                                <div className="w-full h-1 bg-white/[0.05] rounded-full"><div className="bg-[#F4C618] w-[24%] h-full rounded-full" /></div>
                              </div>
                            </div>

                            <div className="bg-[#1A1A1A] border border-white/[0.04] p-4 rounded-xl space-y-3">
                              <span className="text-xs font-semibold text-[#B5B5B5]">Era Distribution</span>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span>2010s</span> <span className="font-bold">42%</span></div>
                                <div className="w-full h-1 bg-white/[0.05] rounded-full"><div className="bg-[#F4C430] w-[42%] h-full rounded-full" /></div>
                                <div className="flex justify-between"><span>1990s</span> <span className="font-bold">28%</span></div>
                                <div className="w-full h-1 bg-white/[0.05] rounded-full"><div className="bg-[#F4C430] w-[28%] h-full rounded-full" /></div>
                              </div>
                            </div>

                            <div className="bg-[#1A1A1A] border border-white/[0.04] p-4 rounded-xl flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-semibold text-[#B5B5B5] block">Taste Alignment</span>
                                <span className="text-2xl font-black text-[#F4C618]">Cinephile Elite</span>
                              </div>
                              <p className="text-[10px] text-[#B5B5B5] mt-2">Your tastes match closely with Criterion Collection curators.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DISCUSSIONS PREVIEW */}
                      {activePreviewTab === 'Community Discussions' && (
                        <div className="space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#B5B5B5] uppercase">Discussing: Interstellar (2014)</span>
                            <span className="text-[11px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Spoilers Allowed
                            </span>
                          </div>
                          
                          <div className="space-y-3 max-h-[250px] overflow-y-auto">
                            <div className="p-3 bg-[#1A1A1A] border border-white/[0.04] rounded-xl text-xs space-y-1">
                              <div className="flex justify-between font-bold text-[#F4C618]">
                                <span>@tars_assistant</span>
                                <span className="text-[#B5B5B5] font-normal text-[10px]">2h ago</span>
                              </div>
                              <p className="text-white">Did anyone else realize Cooper’s watch ticked in Morse code matching the gravity equations?</p>
                            </div>
                            <div className="p-3 bg-[#1A1A1A] border border-white/[0.04] rounded-xl text-xs space-y-1 ml-6">
                              <div className="flex justify-between font-bold text-white">
                                <span>@nolan_fanatic</span>
                                <span className="text-[#B5B5B5] font-normal text-[10px]">1h ago</span>
                              </div>
                              <p className="text-white">Yes! The watch itself is a Hamilton custom. Such a neat detail that links the beginning and ending.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* F. CORE EXPERIENCE */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">The Journey</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            How CINELITH Works
          </h3>
          <p className="text-[#B5B5B5] max-w-xl mx-auto text-sm md:text-base">
            Instead of giving you a massive list of features, this is the path you take on day one.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          
          {[
            { step: '1', title: 'Discover', desc: 'Find movies and series tailored to your exact taste, mood, or group recommendation preferences.' },
            { step: '2', title: 'Track', desc: 'Build lists, record watches in your diary, and keep tab of rating distributions.' },
            { step: '3', title: 'Discuss', desc: 'Join discussion hubs, write detailed reviews, and debate plot holes with the community.' },
            { step: '4', title: 'Connect', desc: 'Follow friends and top critics who share matching tastes and cinematic sensibilities.' },
            { step: '5', title: 'Build Identity', desc: 'Earn your cinematic level, collect badges, and display your personalized taste analytic dashboard.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 relative group hover:border-[#F4C618]/20 transition-all duration-300">
              <span className="absolute -top-4 -left-4 w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F4C618] to-[#F4C430] flex items-center justify-center text-black font-extrabold text-sm shadow-md">
                {item.step}
              </span>
              <h4 className="text-lg font-bold mt-2 mb-3 text-white group-hover:text-[#F4C618] transition-colors">{item.title}</h4>
              <p className="text-xs text-[#B5B5B5] leading-relaxed">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* G. WHY CINELITH? (Comparison Table) */}
      <section className="py-24 bg-[#111111] border-y border-white/[0.04] relative z-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">Comparison</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Why CINELITH?
            </h3>
            <p className="text-[#B5B5B5] max-w-xl mx-auto text-sm md:text-base">
              See how CINELITH sets the standard for the next-generation cinema experience.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#090909]">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="p-5 text-sm font-bold uppercase tracking-wider text-[#B5B5B5]">Experience Feature</th>
                  <th className="p-5 text-sm font-bold uppercase tracking-wider text-[#B5B5B5] text-center">IMDb</th>
                  <th className="p-5 text-sm font-bold uppercase tracking-wider text-[#B5B5B5] text-center">Letterboxd</th>
                  <th className="p-5 text-sm font-bold uppercase tracking-wider text-[#B5B5B5] text-center">OTT Apps</th>
                  <th className="p-5 text-sm font-bold uppercase tracking-wider text-white text-center bg-[#F4C618]/5 border-x border-[#F4C618]/10">CINELITH</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Complete Movie Database', imdb: 'check', lb: 'check', ott: 'cross', cl: 'check' },
                  { feature: 'Personalized Dashboard', imdb: 'cross', lb: 'limited', ott: 'cross', cl: 'check' },
                  { feature: 'Community Discussions', imdb: 'cross', lb: 'limited', ott: 'cross', cl: 'check' },
                  { feature: 'Taste Analytics', imdb: 'cross', lb: 'cross', ott: 'cross', cl: 'check' },
                  { feature: 'AI Recommendations', imdb: 'cross', lb: 'cross', ott: 'limited', cl: 'check' },
                  { feature: 'Social Network Features', imdb: 'cross', lb: 'partial', ott: 'cross', cl: 'check' }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-white/[0.05] hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 text-sm font-semibold text-white">{row.feature}</td>
                    
                    {/* IMDb */}
                    <td className="p-5 text-center">
                      {row.imdb === 'check' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.imdb === 'cross' && <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                    </td>

                    {/* Letterboxd */}
                    <td className="p-5 text-center text-[#B5B5B5] text-xs">
                      {row.lb === 'check' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.lb === 'limited' && <span className="bg-neutral-800 text-[10px] px-2 py-0.5 rounded font-semibold text-neutral-400">Limited</span>}
                      {row.lb === 'partial' && <span className="bg-neutral-800 text-[10px] px-2 py-0.5 rounded font-semibold text-neutral-400">Partial</span>}
                      {row.lb === 'cross' && <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                    </td>

                    {/* OTT Apps */}
                    <td className="p-5 text-center text-[#B5B5B5] text-xs">
                      {row.ott === 'check' && <Check className="w-5 h-5 text-green-500 mx-auto" />}
                      {row.ott === 'limited' && <span className="bg-neutral-800 text-[10px] px-2 py-0.5 rounded font-semibold text-neutral-400">Limited</span>}
                      {row.ott === 'cross' && <X className="w-5 h-5 text-red-500/50 mx-auto" />}
                    </td>

                    {/* CINELITH */}
                    <td className="p-5 text-center bg-[#F4C618]/5 border-x border-[#F4C618]/10 font-bold text-[#F4C618]">
                      <Check className="w-6 h-6 text-[#F4C618] mx-auto filter drop-shadow-[0_0_8px_rgba(244,198,24,0.5)]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* H. PRODUCT ROADMAP */}
      <section id="roadmap" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">Vision</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Product Roadmap
          </h3>
          <p className="text-[#B5B5B5] max-w-xl mx-auto text-sm md:text-base">
            Our long-term master plan to redefine cinematic experiences.
          </p>
        </div>

        {/* Roadmap horizontal timeline */}
        <div className="relative">
          {/* Main Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#F4C618]/10 via-[#F4C618] to-[#F4C618]/10 hidden lg:block -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {[
              { phase: 'Phase 1', title: 'Movie Discovery', desc: 'Complete catalog search, filter lists, rating index integration, and custom collections creation.' },
              { phase: 'Phase 2', title: 'Community & Social', desc: 'Direct message channels, user follows, group discussion threads, and film quizzes.' },
              { phase: 'Phase 3', title: 'OTT Platform', desc: 'Seamless integration with media streams, letting you play and rent movies directly on-platform.' },
              { phase: 'Phase 4', title: 'Cinema Experiences', desc: 'Booking cinema slots, local cinephile meetups, and real-life film group check-ins.' },
              { phase: 'Phase 5', title: 'AI Movie Studio', desc: 'Predictive analytics, movie casting analytics, script prediction tools, and creative studio modules.' }
            ].map((step, idx) => (
              <div key={idx} className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 relative flex flex-col items-center text-center space-y-3 group hover:border-[#F4C618]/40 transition-all duration-300">
                <span className="text-[11px] uppercase tracking-wider text-[#F4C618] font-bold">{step.phase}</span>
                <div className="w-3 h-3 rounded-full bg-[#F4C618] group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_rgba(244,198,24,0.5)]" />
                <h4 className="font-extrabold text-base text-white">{step.title}</h4>
                <p className="text-xs text-[#B5B5B5] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* I. EARLY ACCESS REGISTRATION (Waitlist Form matching screenshot) */}
      <section id="signup" className="py-24 bg-[#090909] relative z-10 px-4 md:px-8">
        <div className="max-w-xl mx-auto">
          
          {/* Main Card matching screenshot */}
          <div 
            className="border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden text-center bg-[#0e0e0e]"
            style={{ background: 'radial-gradient(circle at top, rgba(255, 214, 10, 0.08) 0%, transparent 70%), #0d0d0d' }}
          >
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                      Become one of CINELITH’s first members.
                    </h3>
                    <p className="text-sm md:text-base text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                      Secure your username and receive founding member benefits.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-3.5 max-w-md mx-auto pt-2">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-semibold">
                        ⚠️ {error}
                      </div>
                    )}
                    
                    {/* Vertical stacked input fields */}
                    <div className="space-y-3 text-left">
                      <div>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Name" 
                          disabled={loading}
                          className="w-full bg-[#151515] border border-white/10 focus:border-[#FFD60A] rounded-xl px-4 py-3.5 text-sm focus:outline-none text-white transition-all disabled:opacity-50 placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Email Address" 
                          disabled={loading}
                          className="w-full bg-[#151515] border border-white/10 focus:border-[#FFD60A] rounded-xl px-4 py-3.5 text-sm focus:outline-none text-white transition-all disabled:opacity-50 placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <input 
                          type="text" 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          placeholder="Country" 
                          disabled={loading}
                          className="w-full bg-[#151515] border border-white/10 focus:border-[#FFD60A] rounded-xl px-4 py-3.5 text-sm focus:outline-none text-white transition-all disabled:opacity-50 placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <input 
                          type="text" 
                          name="favoriteMovie"
                          value={formData.favoriteMovie}
                          onChange={handleInputChange}
                          placeholder="Your Favorite Movie" 
                          disabled={loading}
                          className="w-full bg-[#151515] border border-white/10 focus:border-[#FFD60A] rounded-xl px-4 py-3.5 text-sm focus:outline-none text-white transition-all disabled:opacity-50 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FFD60A] hover:bg-[#FACC15] text-black font-extrabold text-sm py-4 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(255,214,10,0.3)] hover:shadow-[0_0_35px_rgba(255,214,10,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Securing Spot...
                          </>
                        ) : (
                          "Join Early Access"
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Waitlist count proof */}
                  <div className="flex items-center justify-center gap-3 pt-6 text-xs text-[#B5B5B5]">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-700 border-2 border-[#090909] flex items-center justify-center text-[9px] font-bold">JD</div>
                      <div className="w-6 h-6 rounded-full bg-neutral-600 border-2 border-[#090909] flex items-center justify-center text-[9px] font-bold">AM</div>
                      <div className="w-6 h-6 rounded-full bg-[#F4C618]/80 border-2 border-[#090909] flex items-center justify-center text-[9px] font-black text-black">CL</div>
                    </div>
                    <span>Join <b className="text-white font-bold">{waitlistCount}</b> cinephiles waiting in line</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-4"
                >
                  {/* Interactive Pre-Launch Founding Member Pass Card */}
                  <div className="bg-gradient-to-br from-[#181524] via-[#110f1c] to-[#0a0812] border-2 border-[#FACC15]/40 p-6 md:p-8 rounded-3xl max-w-md mx-auto shadow-[0_0_50px_rgba(250,204,21,0.2)] text-left relative overflow-hidden">
                    {/* Glowing Pass Ribbon */}
                    <div className="absolute top-0 right-0 bg-[#FACC15] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-md">
                      Pre-Launch Access Pass
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <img src="/images/logo_mark.png" alt="CINELITH" className="w-8 h-8 object-contain" />
                      <div>
                        <h4 className="text-lg font-black text-white leading-none">CINELITH</h4>
                        <span className="text-[10px] text-gray-400 font-semibold">Founding Member Pass</span>
                      </div>
                    </div>

                    <div className="space-y-3 border-y border-white/10 py-4 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Member Name:</span>
                        <span className="font-extrabold text-white">{formData.name || 'Cinephile'}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Country:</span>
                        <span className="font-bold text-gray-200">{formData.country || 'Global'}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Favorite Film:</span>
                        <span className="font-bold text-[#FACC15]">{formData.favoriteMovie || 'Interstellar'}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-gray-400">Founding ID:</span>
                        <code className="bg-[#FACC15]/10 text-[#FACC15] px-2 py-0.5 rounded font-mono font-bold text-xs border border-[#FACC15]/20">
                          CINELITH-{userQueueNum || 385}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Queue Position</span>
                        <span className="text-2xl font-black text-[#FACC15]">#{userQueueNum || 385}</span>
                      </div>

                      {/* Unlock Action Button */}
                      <button
                        onClick={() => {
                          login(formData.email || 'alex@cinelith.com', 'password');
                          navigate('/dashboard');
                        }}
                        className="bg-[#FACC15] hover:bg-yellow-400 text-black font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                      >
                        Unlock Member Portal →
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Your Founding Pass is activated! We have sent a confirmation email to <b className="text-white">{formData.email}</b>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* J. COMMUNITY SECTION */}
      <section id="community" className="py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">Community</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Built for People Who Love Cinema
          </h3>
          <p className="text-[#B5B5B5] max-w-2xl mx-auto text-sm md:text-base">
            CINELITH is more than a platform—it's a growing community of people who believe movies deserve meaningful conversations, deeper discovery, and shared experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Instagram */}
          <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between group hover:border-[#F4C618]/20 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/10 to-purple-500/10 text-pink-400 flex items-center justify-center mb-4">
                <Instagram className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1">Instagram</h4>
              <p className="text-xs text-[#B5B5B5]">Daily cinematography highlights, movie trivia, and community features.</p>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#F4C618] hover:underline font-semibold mt-6 flex items-center gap-1.5 cursor-pointer">
              Follow Us <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: LinkedIn */}
          <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between group hover:border-[#F4C618]/20 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Linkedin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1">LinkedIn</h4>
              <p className="text-xs text-[#B5B5B5]">Tech stack updates, behind-the-scenes progress, and hiring milestones.</p>
            </div>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#F4C618] hover:underline font-semibold mt-6 flex items-center gap-1.5 cursor-pointer">
              Connect <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Community Updates */}
          <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between group hover:border-[#F4C618]/20 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F4C618]/10 text-[#F4C618] flex items-center justify-center mb-4">
                <Star className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1">Community Updates</h4>
              <p className="text-xs text-[#B5B5B5]">Read about our upcoming meetups and platform guidelines drafts.</p>
            </div>
            <button onClick={() => scrollToSection('signup')} className="text-left text-xs text-[#F4C618] hover:underline font-semibold mt-6 flex items-center gap-1.5 cursor-pointer">
              Get Notified <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 4: Development Progress */}
          <div className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between group hover:border-[#F4C618]/20 transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1">Development Progress</h4>
              <p className="text-xs text-[#B5B5B5]">Code is 84% complete. We are refining recommendation engine lints.</p>
            </div>
            <span className="text-xs text-[#B5B5B5] font-semibold mt-6 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping mr-1" /> Active Sprint
            </span>
          </div>

        </div>
      </section>

      {/* K. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-24 bg-[#111111] border-y border-white/[0.04] relative z-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-[#F4C618] font-bold">Answers</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {[
              { q: 'What is CINELITH?', a: 'CINELITH is a dedicated social platform for film and television lovers. It combines a complete entertainment catalog with rich dashboard diaries, taste analysis charts, community debate forums, quizzes, and mood-based AI recommendations.' },
              { q: 'When will the product launch?', a: 'The closed beta opens to early access waitlisted members in waves starting Fall 2026. The general public release is planned for Winter 2026.' },
              { q: 'Is it free?', a: 'Yes! CINELITH is completely free to join. Premium badges, catalog searches, discussions, and standard recommendations require no credit card or payments.' },
              { q: 'How can I become a beta tester?', a: 'By entering your details in the Early Access waitlist section above. We select beta testers based on registration timestamp order.' },
              { q: 'Will there be a mobile app?', a: 'Absolutely. A fully responsive mobile web view is ready, and dedicated iOS and Android application binaries will be available alongside the launch of Phase 2.' },
              { q: 'What makes CINELITH different?', a: 'Unlike basic movie rating tools that focus purely on rating numbers, CINELITH constructs your "Cinematic Identity" based on genre, director preferences, and era breakdowns, while keeping community conversations central to the experience.' }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#090909] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm md:text-base text-white hover:text-[#F4C618] transition-colors cursor-pointer select-none"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#F4C618] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#B5B5B5] flex-shrink-0" />
                  )}
                </button>
                
                {openFaq === idx && (
                  <div className="p-5 pt-0 border-t border-white/[0.04] text-xs md:text-sm text-[#B5B5B5] leading-relaxed bg-white/[0.01]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* L. FOOTER */}
      <footer className="bg-[#090909] border-t border-white/[0.05] relative z-10 px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand/Copyright */}
          <div className="flex items-center gap-2">
            <img src="/images/logo_mark.png" alt="CINELITH Logo" className="w-6 h-6 object-contain" />
            <span className="text-xs text-[#B5B5B5]">
              © {new Date().getFullYear()} CINELITH. Discover, Discuss, Connect.
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#B5B5B5]">
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="mailto:info@cinelith.com" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-[#B5B5B5]">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:info@cinelith.com" className="hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Landing;
