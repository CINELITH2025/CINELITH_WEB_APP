import React from 'react';
import { Users, HelpCircle, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureSection = ({ title, features }) => {
  const navigate = useNavigate();

  // We assign specific icons based on index
  const getIcon = (index) => {
    switch (index) {
      case 0:
        return <Users className="w-8 h-8 text-[#F5BF26]" />;
      case 1:
        return <HelpCircle className="w-8 h-8 text-[#F5BF26]" />;
      case 2:
        return <Swords className="w-8 h-8 text-[#F5BF26]" />;
      default:
        return <Users className="w-8 h-8 text-[#F5BF26]" />;
    }
  };

  const getRoute = (index) => {
    switch (index) {
      case 0:
        return '/community';
      case 1:
      case 2:
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[#F5BF26] tracking-wide">{title}</h2>
      </div>

      {/* Feature Grid - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(getRoute(idx))}
            className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F5BF26]/30 cursor-pointer group hover:bg-white/10 transition-all duration-300 shadow-xl"
          >
            {/* Icon Box */}
            <div className="p-4 bg-white/5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 shadow-inner">
              {getIcon(idx)}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-3 group-hover:text-[#F5BF26] transition-colors">
              {feature.title}
            </h3>

            {/* Description Text */}
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-medium">
              {feature.buttonText}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
