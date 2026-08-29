import React from 'react';

const Logo = ({ className = "h-9 w-auto" }) => {
  return (
    <img 
      src="/images/logo_text.png" 
      alt="CINELITH Logo" 
      className={`${className} object-contain`}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
};

export default Logo;
