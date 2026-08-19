import React, { memo } from 'react';
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

export const SudokuCell: React.FC<SudokuCellProps> = memo(({
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
  const { row, col, value, given, cornerMarks, centerMarks, color } = cell;

  const boxSize = size === 16 ? 4 : size === 6 ? 3 : size === 4 ? 2 : 3;
  const isBoxRight = (col + 1) % boxSize === 0 && col !== size - 1;
  const isBoxBottom = (row + 1) % (size === 6 ? 2 : boxSize) === 0 && row !== size - 1;

  // Background and border resolution
  let bgStyle: React.CSSProperties = {
    backgroundColor: 'var(--cell-bg)',
  };

  if (color) {
    bgStyle.backgroundColor = `var(--color-p${color})`;
    bgStyle.opacity = 0.85;
  } else if (isSelected) {
    bgStyle.backgroundColor = 'var(--cell-selected)';
  } else if (isError) {
    bgStyle.backgroundColor = 'var(--cell-error)';
  } else if (isHintPrimary) {
    bgStyle.backgroundColor = 'rgba(0, 240, 255, 0.28)';
  } else if (isHintTarget) {
    bgStyle.backgroundColor = 'rgba(244, 63, 94, 0.25)';
  } else if (isSameDigit) {
    bgStyle.backgroundColor = 'var(--cell-same-digit)';
  } else if (isPeer) {
    bgStyle.backgroundColor = 'var(--cell-peer)';
  }

  const borderClasses = `
    ${isBoxRight ? 'border-r-2 border-r-[var(--border-strong)]' : 'border-r border-r-[var(--border-subtle)]'}
    ${isBoxBottom ? 'border-b-2 border-b-[var(--border-strong)]' : 'border-b border-b-[var(--border-subtle)]'}
  `;

  return (
    <div
      onClick={onClick}
      style={bgStyle}
      className={`relative aspect-square flex items-center justify-center cursor-pointer select-none transition-all duration-150 ${borderClasses} ${
        isSelected
          ? 'ring-2 ring-[var(--border-active)] z-20 shadow-lg scale-[1.02]'
          : 'hover:brightness-125'
      }`}
    >
      {/* Placed Main Value */}
      {value !== null && value !== 0 ? (
        <span
          className={`font-mono text-2xl md:text-3xl tabular-nums leading-none tracking-tight ${
            given
              ? 'font-extrabold text-[var(--text-given)]'
              : 'font-semibold text-[var(--text-user)] animate-pop'
          } ${isError ? 'text-rose-400 font-black' : ''}`}
        >
          {size === 16 ? digitToMonsterChar(value) : value}
        </span>
      ) : (
        /* Candidates & Pencil Marks View */
        <div className="absolute inset-0 p-1 flex flex-col justify-between pointer-events-none">
          {/* Snyder Corner Candidates */}
          {cornerMarks.length > 0 && (
            <div className="flex flex-wrap gap-x-1 justify-between text-[9px] md:text-[10px] font-mono font-bold text-[var(--text-accent)] leading-none">
              {cornerMarks.map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          )}

          {/* Center Candidates 3x3 Grid */}
          {centerMarks.length > 0 && (
            <div className="grid grid-cols-3 gap-[1px] my-auto justify-items-center items-center text-[8px] md:text-[9px] font-mono font-medium text-[var(--text-note)] leading-none">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(d => (
                <span key={d} className="w-2.5 h-2.5 flex items-center justify-center">
                  {centerMarks.includes(d) ? d : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SudokuCell.displayName = 'SudokuCell';
