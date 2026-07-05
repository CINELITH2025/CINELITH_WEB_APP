import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { Mail, Lock, User, Film, Sparkles, ArrowRight } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signupAction = useUserStore((state) => state.signup);
  const loginAction = useUserStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isLogin) {
        loginAction(email, password);
        navigate('/profile');
      } else {
        signupAction(name, email, password);
        // New users always start with onboarding questionnaire!
        navigate('/onboarding');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-white flex flex-col md:flex-row overflow-x-hidden font-sans">
      
      {/* Left side: Premium Cinelith Showcase */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative items-center justify-center p-12 overflow-hidden"
           style={{ backgroundImage: 'url("/images/hero_bg.png")' }}>
        {/* Dark gold overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#08060d] via-black/80 to-[#FACC15]/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060d] via-transparent to-transparent"></div>

        {/* Content Box */}
        <div className="relative z-10 max-w-lg text-left flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 22 22" fill="none" className="animate-pulse">
              <path d="M11 2L20 11L11 20L2 11L11 2Z" fill="#FACC15" />
            </svg>
            <span className="text-2xl font-black tracking-tight text-white">CINELITH</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Your Cinema Identity <br/>
            Starts <span className="text-[#FACC15] bg-clip-text">Here.</span>
          </h1>

          <p className="text-gray-400 text-sm lg:text-base leading-relaxed font-medium">
            Join the community to unlock dynamic taste metrics, rate and review your favorite films, and match with other cinema lovers who share your screen preferences.
          </p>

          <div className="flex flex-col gap-4 mt-4 border-l-2 border-[#FACC15] pl-6 py-2 bg-white/5 backdrop-blur-md rounded-r-xl border-white/5 pr-4">
            <p className="text-xs font-semibold uppercase text-[#FACC15] tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Featured Quote
            </p>
            <p className="text-sm font-medium italic text-gray-300">
              "We need cinema. It has the power to make us empathize with lives other than our own."
            </p>
            <span className="text-xs font-black text-white/50">— Denis Villeneuve</span>
          </div>
        </div>
      </div>

      {/* Right side: Login / Signup Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 z-10 relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#FACC15]/5 to-transparent pointer-events-none"></div>

        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-lg flex flex-col relative overflow-hidden">
          
          {/* Decorative Corner Glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FACC15]/10 rounded-full blur-2xl"></div>

          {/* Form Header */}
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              {isLogin ? "Welcome back! Enter your credentials to access your profile." : "Join the CINELITH community and customize your taste card."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed">
              {error}
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
                <div className="relative flex items-center group">
                  <User className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Password</label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#FACC15] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FACC15]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-2 rounded-xl bg-[#FACC15] hover:bg-[#E2B710] text-black font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-8 text-center text-xs md:text-sm font-medium">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#FACC15] hover:underline font-black cursor-pointer bg-transparent border-none"
            >
              {isLogin ? 'Create one' : 'Sign in here'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Auth;
