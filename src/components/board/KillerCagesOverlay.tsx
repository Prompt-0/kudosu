import React from 'react';
import { KillerCage } from '../../types/sudoku';

interface KillerCagesOverlayProps {
  cages: KillerCage[];
  size: number;
}

export const KillerCagesOverlay: React.FC<KillerCagesOverlayProps> = ({ cages, size }) => {
  if (!cages || cages.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {cages.map(cage => {
        // Find top-left most cell in cage for label
        let minR = Infinity;
        let minC = Infinity;
        for (const cell of cage.cells) {
          if (cell.row < minR || (cell.row === minR && cell.col < minC)) {
            minR = cell.row;
            minC = cell.col;
          }
        }

        const leftPercent = (minC / size) * 100;
        const topPercent = (minR / size) * 100;

        return (
          <div
            key={cage.id}
            className="absolute text-[10px] font-bold text-amber-300 bg-slate-950/85 px-1 rounded shadow-sm tabular-nums leading-none"
            style={{
              left: `calc(${leftPercent}% + 2px)`,
              top: `calc(${topPercent}% + 2px)`,
            }}
          >
            {cage.sum}
          </div>
        );
      })}
    </div>
  );
};
