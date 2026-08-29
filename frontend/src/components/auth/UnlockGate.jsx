import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, Film } from 'lucide-react';
import useUserStore from '../../store/useUserStore';

const UnlockGate = ({ title, subtitle, features = [], children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const login = useUserStore((state) => state.login);

  const handleQuickDemoLogin = () => {
    // Demo login as Alex Mercer
    login("alex@cinelith.com", "password");
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[80vh] w-full">
      {/* Blurred & Locked Page Content Background */}
      <div className="pointer-events-none filter blur-lg opacity-25 select-none overflow-hidden max-h-[80vh] transition-all duration-700">
        {children}
      </div>

      {/* Floating Glassmorphism Unlock Gateway Banner / Overlay */}
      <div className="absolute inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#090909]/60 via-[#090909]/85 to-[#090909]/95 backdrop-blur-sm">
        <div className="w-full max-w-xl bg-[#121018]/95 border border-[#EAB513]/30 rounded-3xl p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(234,181,19,0.15)] relative overflow-hidden text-center backdrop-blur-xl">
          
          {/* Background Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#EAB513]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#F59E0B]/15 blur-3xl pointer-events-none" />

          {/* Glowing Lock Badge */}
          <div className="inline-flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-2xl bg-[#EAB513]/30 blur-md animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EAB513] to-[#E2B220] flex items-center justify-center text-black shadow-lg relative z-10">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
            {title || "Unlock Member Feature"}
          </h2>
          <p className="text-xs md:text-sm text-[#B5B5B5] max-w-md mx-auto mb-6 leading-relaxed">
            {subtitle || "This section is exclusive to CINELITH members. Log in or create an account to view full content, taste analytics, and join discussions."}
          </p>

          {/* Key Unlocked Features */}
          <div className="bg-[#09080e]/80 border border-white/[0.08] rounded-2xl p-4 mb-6 text-left space-y-2.5">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#EAB513] block mb-1">
              Member Perks Included
            </span>
            {(features.length > 0 ? features : [
              "Taste Match Algorithm matching your film profile with cinephiles",
              "Deep cinematic analytics, viewing history & era breakdown charts",
              "Spoiler-protected discussion forums & global cinema clubs",
              "Complete cross-platform sync across Desktop & Mobile app"
            ]).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-[#EAB513] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-[#EAB513] hover:bg-[#EAB513] text-black font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(234,181,19,0.3)] hover:shadow-[0_0_30px_rgba(234,181,19,0.5)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In or Sign Up <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleQuickDemoLogin}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#EAB513]" /> Instant 1-Click Demo
            </button>
          </div>

          <p className="text-[11px] text-[#B5B5B5] mt-4">
            Free forever • No credit card required
          </p>

        </div>
      </div>
    </div>
  );
};

export default UnlockGate;
