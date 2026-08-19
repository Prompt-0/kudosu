import React from 'react';
import { JigsawRegion } from '../../types/sudoku';

interface JigsawOverlayProps {
  regions: JigsawRegion[];
  size: number;
}

export const JigsawOverlay: React.FC<JigsawOverlayProps> = ({ regions, size }) => {
  if (!regions || regions.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      {/* SVG thick boundary lines between different jigsaw regions */}
    </svg>
  );
};
