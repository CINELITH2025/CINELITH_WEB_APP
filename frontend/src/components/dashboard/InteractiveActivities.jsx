import React, { useState, useEffect } from 'react';
import { Swords, Award, Check, X, Sparkles, HelpCircle, Trophy } from 'lucide-react';
import useUserStore from '../../store/useUserStore';
import { Button } from '@/components/ui/button';

const InteractiveActivities = () => {
  const user = useUserStore((state) => state.user);
  const awardPoints = useUserStore((state) => state.awardPoints);

  // --- Battle of the Day States ---
  const [battleVote, setBattleVote] = useState(null); // 'dune' or 'oppenheimer'
  const [battlePercentages, setBattlePercentages] = useState({ dune: 48, oppenheimer: 52 });
  
  // --- Quiz States ---
  const [selectedQuizOption, setSelectedQuizOption] = useState(null); // index
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load persistent states on mount
  useEffect(() => {
    const savedVote = localStorage.getItem('cinelith_battle_vote');
    if (savedVote) {
      setBattleVote(savedVote);
      // Adjust percentages based on the saved vote for local visualization
      if (savedVote === 'dune') {
        setBattlePercentages({ dune: 49, oppenheimer: 51 });
      } else {
        setBattlePercentages({ dune: 47, oppenheimer: 53 });
      }
    }

    const savedQuizOpt = localStorage.getItem('cinelith_quiz_selection');
    if (savedQuizOpt) {
      setSelectedQuizOption(parseInt(savedQuizOpt, 10));
      setQuizSubmitted(true);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Battle Click ---
  const handleBattleVote = (choice) => {
    if (battleVote) return; // already voted

    setBattleVote(choice);
    localStorage.setItem('cinelith_battle_vote', choice);

    if (choice === 'dune') {
      setBattlePercentages({ dune: 49, oppenheimer: 51 });
    } else {
      setBattlePercentages({ dune: 47, oppenheimer: 53 });
    }

    // Award +10 points
    awardPoints(10);
    triggerToast("Vote registered! +10 Cinephile points awarded!");
  };

  // --- Quiz Click ---
  const quizOptions = [
    "Stanley Kubrick",
    "Ridley Scott",
    "Christopher Nolan",
    "Denis Villeneuve"
  ];
  const correctQuizIndex = 0; // Stanley Kubrick directed 2001: A Space Odyssey

  const handleQuizSelect = (index) => {
    if (quizSubmitted) return;

    setSelectedQuizOption(index);
    setQuizSubmitted(true);
    localStorage.setItem('cinelith_quiz_selection', index.toString());

    if (index === correctQuizIndex) {
      awardPoints(20);
      triggerToast("Correct! +20 Cinephile points awarded!");
    } else {
      triggerToast("Incorrect. The correct answer is Stanley Kubrick.");
    }
  };

  return (
    <section className="mb-12 relative">
      {/* Toast HUD */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#F5BF26] text-black text-xs font-black px-6 py-3.5 rounded-full shadow-2xl z-50 animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 fill-current" />
          {toastMessage}
        </div>
      )}

      <h2 className="text-xl font-bold text-foreground mb-6">Interactive Activities</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* === BATTLE OF THE DAY === */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5BF26]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Swords className="w-5 h-5 text-[#F5BF26]" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Movie Battle of the Day</span>
            </div>
            
            <h3 className="text-lg font-black text-white mb-6">Which sci-fi epic holds your vote?</h3>

            {/* Poster comparison layout */}
            <div className="flex items-center gap-4 justify-center relative mb-8">
              {/* Option A: Dune */}
              <div 
                onClick={() => handleBattleVote('dune')}
                className={`w-[130px] rounded-2xl overflow-hidden border cursor-pointer relative shadow-lg group/poster transition-all duration-300 ${
                  battleVote === 'dune' 
                    ? 'border-[#F5BF26] scale-105 shadow-[#F5BF26]/10' 
                    : battleVote 
                      ? 'border-white/5 opacity-50 cursor-default' 
                      : 'border-white/10 hover:border-[#F5BF26]/50 hover:scale-102'
                }`}
              >
                <img src="/images/poster_1.png" alt="Dune: Part Two" className="w-full h-full object-cover aspect-[2/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-black text-white leading-tight">Dune: Part Two</span>
                </div>
              </div>

              {/* VS separator */}
              <div className="w-10 h-10 rounded-full bg-[#121016] border border-white/15 shadow-xl flex items-center justify-center text-xs font-black text-[#F5BF26] shrink-0 z-10">
                VS
              </div>

              {/* Option B: Oppenheimer */}
              <div 
                onClick={() => handleBattleVote('oppenheimer')}
                className={`w-[130px] rounded-2xl overflow-hidden border cursor-pointer relative shadow-lg group/poster transition-all duration-300 ${
                  battleVote === 'oppenheimer' 
                    ? 'border-[#F5BF26] scale-105 shadow-[#F5BF26]/10' 
                    : battleVote 
                      ? 'border-white/5 opacity-50 cursor-default' 
                      : 'border-white/10 hover:border-[#F5BF26]/50 hover:scale-102'
                }`}
              >
                <img src="/images/poster_2.png" alt="Oppenheimer" className="w-full h-full object-cover aspect-[2/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <span className="text-[10px] font-black text-white leading-tight">Oppenheimer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results View */}
          {battleVote ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                <span>Dune: {battlePercentages.dune}%</span>
                <span>Oppenheimer: {battlePercentages.oppenheimer}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#F5BF26]" style={{ width: `${battlePercentages.dune}%` }}></div>
                <div className="h-full bg-amber-600" style={{ width: `${battlePercentages.oppenheimer}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-500 font-bold text-center mt-3 uppercase tracking-wider">
                Thanks for voting! Score updated.
              </p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-wider py-2">
              Select a poster to submit your vote!
            </p>
          )}

        </div>

        {/* === FILM QUIZ OF THE WEEK === */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5BF26]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <HelpCircle className="w-5 h-5 text-[#F5BF26]" />
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly Trivia Quiz</span>
            </div>

            <h3 className="text-lg font-black text-white mb-6">
              Who directed the 1968 cinematic sci-fi masterpiece '2001: A Space Odyssey'?
            </h3>

            {/* MCQ List */}
            <div className="flex flex-col gap-2.5 mb-6">
              {quizOptions.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === correctQuizIndex;

                let btnStyles = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white";
                let checkIcon = null;

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyles = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400";
                    checkIcon = <Check className="w-4 h-4 text-emerald-400 shrink-0" />;
                  } else if (isSelected) {
                    btnStyles = "bg-rose-500/10 border-rose-500/40 text-rose-400";
                    checkIcon = <X className="w-4 h-4 text-rose-400 shrink-0" />;
                  } else {
                    btnStyles = "bg-white/[0.01] border-white/5 text-gray-500 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleQuizSelect(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-xs md:text-sm font-bold text-left transition-all ${
                      !quizSubmitted ? 'cursor-pointer hover:translate-x-1.5' : ''
                    } ${btnStyles}`}
                  >
                    {opt}
                    {checkIcon}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback log */}
          {quizSubmitted ? (
            <div className="text-center py-2 bg-white/[0.02] border border-white/5 rounded-2xl">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {selectedQuizOption === correctQuizIndex 
                  ? "Correct choice! +20 Cinephile points awarded." 
                  : "Incorrect. The answer is Stanley Kubrick."}
              </p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500 font-bold uppercase tracking-wider py-2">
              Answer the question to test your knowledge!
            </p>
          )}

        </div>

      </div>
    </section>
  );
};

export default InteractiveActivities;
