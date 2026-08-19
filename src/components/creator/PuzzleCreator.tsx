import React, { useState } from 'react';
import { DLXSolver } from '../../engine/dlx/dlxSolver';
import { DifficultyRater } from '../../engine/human/difficultyRater';
import { PuzzleDefinition, DifficultyLevel } from '../../types/sudoku';
import { PenTool, CheckCircle2, AlertTriangle, Play, ChevronLeft, RotateCcw } from 'lucide-react';

interface PuzzleCreatorProps {
  onBack: () => void;
  onPlayCreatedPuzzle: (puzzle: PuzzleDefinition) => void;
}

export const PuzzleCreator: React.FC<PuzzleCreatorProps> = ({ onBack, onPlayCreatedPuzzle }) => {
  const [grid, setGrid] = useState<(number | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [title, setTitle] = useState('My Custom Sudoku');
  const [validationResult, setValidationResult] = useState<{
    status: 'idle' | 'unique' | 'multiple' | 'invalid';
    solutionsCount: number;
    difficulty?: DifficultyLevel;
    score?: number;
  }>({ status: 'idle', solutionsCount: 0 });

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ r, c });
  };

  const handleDigitInput = (d: number | null) => {
    const next = grid.map(row => [...row]);
    next[selectedCell.r][selectedCell.c] = d;
    setGrid(next);
    validateBoard(next);
  };

  const validateBoard = (board: (number | null)[][]) => {
    const check = DLXSolver.solveGrid(board, 9, 3, 3, 'classic', undefined, undefined, 2);
    if (check.solutionsCount === 1) {
      const rating = DifficultyRater.rateBoard(board);
      setValidationResult({
        status: 'unique',
        solutionsCount: 1,
        difficulty: rating.level,
        score: rating.score,
      });
    } else if (check.solutionsCount > 1) {
      setValidationResult({
        status: 'multiple',
        solutionsCount: check.solutionsCount,
      });
    } else {
      setValidationResult({
        status: 'invalid',
        solutionsCount: 0,
      });
    }
  };

  const handlePlay = () => {
    const check = DLXSolver.solveGrid(grid, 9, 3, 3, 'classic', undefined, undefined, 1);
    const puzzle: PuzzleDefinition = {
      id: `custom-${Date.now()}`,
      title: title || 'Custom Puzzle',
      variant: 'classic',
      difficulty: validationResult.difficulty || 'medium',
      difficultyScore: validationResult.score || 300,
      grid: grid,
      solution: check.solved ? check.grid : undefined,
    };
    onPlayCreatedPuzzle(puzzle);
  };

  const handleReset = () => {
    const empty = Array.from({ length: 9 }, () => Array(9).fill(null));
    setGrid(empty);
    setValidationResult({ status: 'idle', solutionsCount: 0 });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-2 md:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Game</span>
        </button>

        <div className="flex items-center gap-2 text-[var(--text-accent)] font-extrabold text-sm">
          <PenTool className="w-4 h-4" />
          <span>Custom Puzzle Creator Studio</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Creator Grid */}
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-9 gap-[1px] bg-[var(--bg-card-subtle)] p-2 rounded-2xl border-2 border-[var(--border-strong)] aspect-square w-full max-w-sm shadow-2xl">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell.r === r && selectedCell.c === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square flex items-center justify-center font-mono font-bold text-xl tabular-nums cursor-pointer transition-colors rounded-[2px] ${
                      isSelected
                        ? 'bg-[var(--cell-selected)] ring-2 ring-[var(--border-active)] z-10 text-[var(--text-accent)]'
                        : val !== null
                        ? 'bg-[var(--cell-bg)] text-[var(--text-given)] font-black'
                        : 'bg-[var(--cell-bg)] hover:bg-[var(--cell-hover)] text-[var(--text-secondary)]'
                    }`}
                    style={{
                      borderRightWidth: (c + 1) % 3 === 0 && c !== 8 ? '2px' : '1px',
                      borderBottomWidth: (r + 1) % 3 === 0 && r !== 8 ? '2px' : '1px',
                      borderColor: (c + 1) % 3 === 0 || (r + 1) % 3 === 0 ? 'var(--border-strong)' : 'var(--border-subtle)',
                    }}
                  >
                    {val !== null ? val : ''}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Input Numpad */}
          <div className="grid grid-cols-5 gap-2 w-full max-w-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <button
                key={d}
                onClick={() => handleDigitInput(d)}
                className="py-2.5 kudosu-btn-secondary font-mono font-bold text-sm"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleDigitInput(null)}
              className="py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-xl text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Validation & Publish Panel */}
        <div className="flex flex-col gap-4 kudosu-panel p-6 shadow-xl">
          <div>
            <label className="block text-[var(--text-secondary)] text-xs font-bold mb-1.5">Puzzle Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-[var(--text-primary)] font-bold text-sm focus:outline-none focus:border-[var(--border-active)]"
            />
          </div>

          {/* Real-Time Mathematical Validation Card */}
          <div className="p-4 bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Mathematical Verification (DLX)
            </span>

            {validationResult.status === 'unique' ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Unique Solvable Puzzle! ({validationResult.difficulty?.toUpperCase()} • Score {validationResult.score})</span>
              </div>
            ) : validationResult.status === 'multiple' ? (
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Multiple solutions exist. Add more given clues to make it unique.</span>
              </div>
            ) : validationResult.status === 'invalid' ? (
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>No valid solution exists. Contradictory clues detected.</span>
              </div>
            ) : (
              <span className="text-xs text-[var(--text-secondary)]">Place given clues on the board to validate uniqueness.</span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
            <button
              onClick={handlePlay}
              disabled={validationResult.status !== 'unique'}
              className="w-full py-3 kudosu-btn-primary disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Play Custom Puzzle</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2.5 kudosu-btn-secondary font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Grid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
