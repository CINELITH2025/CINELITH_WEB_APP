import React from 'react';
import { formatCinephileScore } from '../../lib/mapUser';

const SIGNALS = [
  { key: 'wa', label: 'Watch' },
  { key: 'eg', label: 'Engage' },
  { key: 'ac', label: 'Actors' },
  { key: 'rq', label: 'Ratings' },
  { key: 'dv', label: 'Diversity' },
  { key: 'ct', label: 'Taste' },
  { key: 'cr', label: 'Streak' }
];

const CinephileScoreCard = ({ user }) => {
  const breakdown = user?.cinephileBreakdown || {};
  const score = formatCinephileScore(user?.cinephileScore);
  const level = user?.cinephileLevel || 'Newcomer';

  return (
    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl shadow-xl min-w-[220px]">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Cinephile Score</span>
          <span className="text-xl font-black text-[#F5BF26]">{score}</span>
          <span className="text-[10px] text-gray-400 font-bold mt-0.5">{level}</span>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Streak</span>
          <span className="text-xl font-black text-white">{user?.streak || 0}d</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 mt-4">
        {SIGNALS.map(({ key, label }) => {
          const value = Number(breakdown[key]) || 0;
          return (
            <div key={key} className="flex flex-col items-center gap-1" title={`${label}: ${value.toFixed(1)} / 10`}>
              <div className="h-8 w-1.5 rounded-full bg-white/10 overflow-hidden flex items-end">
                <div
                  className="w-full rounded-full bg-[#F5BF26]"
                  style={{ height: `${Math.max(6, value * 10)}%` }}
                />
              </div>
              <span className="text-[7px] text-gray-500 font-bold uppercase tracking-tighter">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CinephileScoreCard;
