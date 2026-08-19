import React from 'react';

export const DiagonalOverlay: React.FC = () => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-0">
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,4" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,4" />
    </svg>
  );
};
