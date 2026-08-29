import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { Mail, Lock, User, Film, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import Logo from '../components/ui/Logo';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(''); // '', 'checking', 'available', 'taken'
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signupAction = useUserStore((state) => state.signup);
  const loginAction = useUserStore((state) => state.login);

  const checkUsernameUniqueness = (val) => {
    if (!val) {
      setUsernameStatus('');
      return;
    }
    setUsernameStatus('checking');
    
    setTimeout(() => {
      const cleanVal = val.startsWith('@') ? val.toLowerCase() : `@${val.toLowerCase()}`;
      const taken = [
        "@sophia_b", "@ethan_c", "@olivia_d", "@liam_f", "@ava_g", "@noah_h",
        "@isabella_j", "@jackson_k", "@mia_l", "@lucas_m", "@chloe_n", "@owen_p",
        "@caleb_r", "@emma_t", "@daniel_w", "@grace_y", "@henry_a", "@isabelle_b",
        "@alex_cinephile"
      ];
      if (taken.includes(cleanVal)) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    }, 400);
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value.replace(/\s+/g, '_');
    setUsername(val);
    checkUsernameUniqueness(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && (!name || !username))) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isLogin && usernameStatus === 'taken') {
      setError('Username is already taken. Please choose another.');
      return;
    }

    try {
      if (isLogin) {
        loginAction(email, password);
        navigate('/profile');
      } else {
        signupAction(name, email, password, username, bio);
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
        <div className="absolute inset-0 bg-gradient-to-tr from-[#08060d] via-black/80 to-[#EAB513]/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#08060d] via-transparent to-transparent"></div>

        {/* Content Box */}
        <div className="relative z-10 max-w-lg text-left flex flex-col gap-6">
          <div className="flex items-center">
            <img src="/images/logo_text.png" alt="CINELITH" className="h-12 w-auto object-contain" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Your Cinema Identity <br/>
            Starts <span className="text-[#EAB513] bg-clip-text">Here.</span>
          </h1>

          <p className="text-gray-400 text-sm lg:text-base leading-relaxed font-medium">
            Join the community to unlock dynamic taste metrics, rate and review your favorite films, and match with other cinema lovers who share your screen preferences.
          </p>

          <div className="flex flex-col gap-4 mt-4 border-l-2 border-[#EAB513] pl-6 py-2 bg-white/5 backdrop-blur-md rounded-r-xl border-white/5 pr-4">
            <p className="text-xs font-semibold uppercase text-[#EAB513] tracking-widest flex items-center gap-1.5">
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
        <div className="absolute inset-0 bg-radial-gradient from-[#EAB513]/5 to-transparent pointer-events-none"></div>

        <Link 
          to="/" 
          className="absolute top-8 left-8 md:left-12 flex items-center gap-2 text-xs font-black text-white hover:text-black hover:bg-[#EAB513] bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest cursor-pointer backdrop-blur-md shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-lg flex flex-col relative overflow-hidden">
          
          {/* Decorative Corner Glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#EAB513]/10 rounded-full blur-2xl"></div>

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
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Full Name</label>
                  <div className="relative flex items-center group">
                    <User className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#EAB513] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Username</label>
                  <div className="relative flex items-center group">
                    <span className="absolute left-4 text-sm font-bold text-gray-500 group-focus-within:text-[#EAB513] transition-colors">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      placeholder="username"
                      className={`w-full pl-8 pr-10 py-3.5 rounded-xl bg-white/5 border transition-all text-sm text-white placeholder:text-gray-600 focus:outline-none ${
                        usernameStatus === 'available' 
                          ? 'border-emerald-500/50 focus:border-emerald-500' 
                          : usernameStatus === 'taken' 
                            ? 'border-red-500/50 focus:border-red-500' 
                            : 'border-white/10 focus:border-[#EAB513]/40 focus:bg-white/10'
                      }`}
                    />
                    
                    {/* Status icons inside the input on the right */}
                    <div className="absolute right-4 flex items-center justify-center">
                      {usernameStatus === 'checking' && (
                        <svg className="animate-spin h-4 w-4 text-[#EAB513]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {usernameStatus === 'available' && (
                        <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                      {usernameStatus === 'taken' && (
                        <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  {usernameStatus === 'checking' && (
                    <span className="text-[10px] text-[#EAB513]/80 font-bold px-1 flex items-center gap-1">
                      Checking availability...
                    </span>
                  )}
                  {usernameStatus === 'available' && (
                    <span className="text-[10px] text-emerald-400 font-bold px-1 flex items-center gap-1">
                      Username is available
                    </span>
                  )}
                  {usernameStatus === 'taken' && (
                    <span className="text-[10px] text-red-400 font-bold px-1 flex items-center gap-1">
                      Username is already taken
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your Quote / Bio (Optional)</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your movie taste..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600 resize-none min-h-[60px]"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center group">
                <Mail className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#EAB513] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Password</label>
              <div className="relative flex items-center group">
                <Lock className="absolute left-4 w-4 h-4 text-gray-500 group-focus-within:text-[#EAB513] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#EAB513]/40 focus:bg-white/10 transition-all text-sm text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-2 rounded-xl bg-[#EAB513] hover:bg-[#EAB513] text-black font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
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
              className="text-[#EAB513] hover:underline font-black cursor-pointer bg-transparent border-none"
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
