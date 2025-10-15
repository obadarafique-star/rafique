import React from 'react';

export const AppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {/* Horizontal beam of the scale */}
    <path d="M3 7h18" />
    
    {/* Central pivot and stand */}
    <path d="M12 3v18" />
    <path d="M8 21h8" />
    
    {/* Left scale pan and chains (traditional justice) */}
    <path d="M5 7l-2 5a3 3 0 0 0 6 0L7 7" />

    {/* Right scale pan as an AI Chip representation */}
    <rect x="15" y="10" width="6" height="6" rx="1" />
    <path d="M18 10V7" />
    {/* Chip "legs" for detail */}
    <path d="M15 13h-1" />
    <path d="M21 13h1" />
  </svg>
);