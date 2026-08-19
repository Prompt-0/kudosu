import React from 'react';
import { CellState } from '../../types/sudoku';
import { digitToMonsterChar } from '../../variants/monster';

interface SudokuCellProps {
  cell: CellState;
  size: number;
  isSelected: boolean;
  isPeer: boolean;
  isSameDigit: boolean;
  isHintPrimary: boolean;
  isHintTarget: boolean;
  isError: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const PALETTE_COLORS: Record<number, string> = {
  1: 'bg-red-500/25 border-red-500/40 text-red-100',
  2: 'bg-orange-500/25 border-orange-500/40 text-orange-100',
  3: 'bg-amber-500/25 border-amber-500/40 text-amber-100',
  4: 'bg-green-500/25 border-green-500/40 text-green-100',
  5: 'bg-teal-500/25 border-teal-500/40 text-teal-100',
  6: 'bg-sky-500/25 border-sky-500/40 text-sky-100',
  7: 'bg-purple-500/25 border-purple-500/40 text-purple-100',
  8: 'bg-pink-500/25 border-pink-500/40 text-pink-100',
};

export const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  size,
  isSelected,
  isPeer,
  isSameDigit,
  isHintPrimary,
  isHintTarget,
  isError,
  onClick,
}) => {
  const { value, given, cornerMarks, centerMarks, color } = cell;

  // Compute background classes
  let bgClass = 'bg-slate-900/60 hover:bg-slate-800/80';

  if (color && PALETTE_COLORS[color]) {
    bgClass = PALETTE_COLORS[color];
  } else if (isError) {
    bgClass = 'bg-red-950/70 border-red-500 text-red-200';
  } else if (isSelected) {
    bgClass = 'bg-cyan-500/30 ring-2 ring-cyan-400 z-10';
  } else if (isHintPrimary) {
    bgClass = 'bg-cyan-500/35 ring-2 ring-cyan-400 animate-pulse z-10';
  } else if (isHintTarget) {
    bgClass = 'bg-rose-500/30 ring-2 ring-rose-400 animate-pulse z-10';
  } else if (isSameDigit && value !== null) {
    bgClass = 'bg-amber-500/25 ring-1 ring-amber-400/60';
  } else if (isPeer) {
    bgClass = 'bg-slate-800/45';
  }

  const formatDigit = (d: number) => {
    return size === 16 ? digitToMonsterChar(d) : `${d}`;
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none cursor-pointer transition-colors duration-150 aspect-square ${bgClass}`}
      style={{
        borderRightWidth: (cell.col + 1) % (size === 16 ? 4 : size === 6 ? 3 : size === 4 ? 2 : 3) === 0 && cell.col !== size - 1 ? '2px' : '1px',
        borderBottomWidth: (cell.row + 1) % (size === 16 ? 4 : size === 6 ? 2 : size === 4 ? 2 : 3) === 0 && cell.row !== size - 1 ? '2px' : '1px',
        borderColor: (cell.col + 1) % (size === 16 ? 4 : size === 6 ? 3 : size === 4 ? 2 : 3) === 0 || (cell.row + 1) % (size === 16 ? 4 : size === 6 ? 2 : size === 4 ? 2 : 3) === 0 ? 'var(--border-block)' : 'var(--border-grid)',
      }}
    >
      {/* Placed / Given Digit */}
      {value !== null ? (
        <span
          className={`font-semibold tabular-nums leading-none ${
            size === 16
              ? 'text-sm md:text-base'
              : size === 4
              ? 'text-4xl md:text-5xl'
              : 'text-2xl md:text-3xl'
          } ${
            given
              ? 'text-sky-400 font-extrabold'
              : isError
              ? 'text-rose-400'
              : 'text-slate-100'
          }`}
        >
          {formatDigit(value)}
        </span>
      ) : (
        /* Candidates Mode */
        <div className="absolute inset-0.5 p-0.5 pointer-events-none flex flex-col justify-between">
          {/* Corner Marks (Snyder notation) */}
          {cornerMarks.length > 0 && (
            <div className="flex flex-wrap justify-between text-[9px] md:text-[10px] font-bold text-slate-300 tabular-nums leading-none tracking-tighter">
              <span>{cornerMarks[0] ? formatDigit(cornerMarks[0]) : ''}</span>
              <span>{cornerMarks[1] ? formatDigit(cornerMarks[1]) : ''}</span>
              <span>{cornerMarks[2] ? formatDigit(cornerMarks[2]) : ''}</span>
              <span>{cornerMarks[3] ? formatDigit(cornerMarks[3]) : ''}</span>
            </div>
          )}

          {/* Center Marks (Standard Candidate clusters) */}
          {centerMarks.length > 0 && (
            <div className="my-auto flex flex-wrap items-center justify-center gap-x-0.5 text-[8px] md:text-[9px] font-medium text-slate-400 tabular-nums leading-none">
              {centerMarks.map(d => (
                <span key={d}>{formatDigit(d)}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
