import React from 'react';

const PersonalInsights = ({ insights }) => {
  return (
    <section className="my-12 px-2">
      <h2 className="text-2xl font-bold text-foreground mb-6">Personal Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 border-t border-white/10 pt-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-sm text-muted-foreground font-medium mb-2">Relationships</h3>
            <p className="text-[15px] text-foreground/90 leading-relaxed">
              {insights.relationships}
            </p>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <h3 className="text-sm text-muted-foreground font-medium mb-2">Quotes</h3>
            <p className="text-[15px] text-foreground/90 leading-relaxed italic border-l-2 border-primary pl-4 py-1">
              "{insights.quotes}"
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          <div>
            <h3 className="text-sm text-muted-foreground font-medium mb-2">Trivia</h3>
            <p className="text-[15px] text-foreground/90 leading-relaxed">
              {insights.trivia}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInsights;
