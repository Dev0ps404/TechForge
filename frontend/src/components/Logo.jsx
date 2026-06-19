import React from 'react';

const Logo = ({ className = "w-7 h-7" }) => {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M12 6 H24 L15 15 H21 L12 24 L16 18 H10 L14 12 H8 Z" 
        fill="url(#techforge-logo-grad)" 
      />
      <defs>
        <linearGradient id="techforge-logo-grad" x1="8" y1="6" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
