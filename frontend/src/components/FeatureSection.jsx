import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeatureSection = ({ title, features }) => {
  return (
    <section className="py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Link to="#" className="text-sm font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="relative aspect-[21/9] rounded-2xl overflow-hidden group">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${feature.image})` }}
            ></div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
              <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
                {feature.title}
              </h3>
              <Button className="bg-primary text-black font-bold hover:bg-primary/90 px-8 rounded-full shadow-lg">
                {feature.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
