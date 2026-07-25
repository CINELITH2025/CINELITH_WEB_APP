import React from 'react';

const Logo = ({ className = "h-9 w-auto" }) => {
  return (
    <img 
      src="/images/logo_text.jpg" 
      alt="CINELITH Logo" 
      className={`${className} object-contain rounded mix-blend-screen`}
      onError={(e) => {
        // Fallback if image fails to load
        e.target.style.display = 'none';
      }}
    />
  );
};

export default Logo;
