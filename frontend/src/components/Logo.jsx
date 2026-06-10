import React from 'react';

const Logo = ({ className = "w-7 h-7" }) => {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left upward chevron representing Growth and Tech */}
      <path d="M6 26L18 14L14 10L6 18V26Z" fill="url(#logo-g1)" />
      {/* Right downward chevron interlocking to form Forge */}
      <path d="M26 6L14 18L18 22L26 14V6Z" fill="url(#logo-g2)" />
      {/* Intersecting central accent diamond representing Core Intelligence */}
      <path d="M14 10L10 14L14 18L18 14L14 10Z" fill="#06B6D4" />
      <defs>
        <linearGradient id="logo-g1" x1="6" y1="26" x2="18" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="logo-g2" x1="26" y1="6" x2="14" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
