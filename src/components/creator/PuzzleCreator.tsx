import React, { useState } from 'react';
import { DLXSolver } from '../../engine/dlx/dlxSolver';
import { DifficultyRater } from '../../engine/human/difficultyRater';
import { PuzzleDefinition, SudokuVariant, DifficultyLevel } from '../../types/sudoku';
import { PenTool, CheckCircle2, AlertTriangle, Play, ChevronLeft, Download, RotateCcw } from 'lucide-react';

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
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Game</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <PenTool className="w-4 h-4" />
          <span>Custom Puzzle Creator Studio</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Creator Grid */}
        <div className="flex flex-col items-center gap-3">
          <div className="grid grid-cols-9 gap-[1px] bg-slate-950 p-1.5 rounded-2xl border-2 border-slate-800 aspect-square w-full max-w-sm shadow-2xl">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell.r === r && selectedCell.c === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`aspect-square flex items-center justify-center font-bold text-xl tabular-nums cursor-pointer transition-colors rounded-[2px] ${
                      isSelected
                        ? 'bg-cyan-500/30 ring-2 ring-cyan-400 z-10 text-cyan-300'
                        : val !== null
                        ? 'bg-slate-900 text-sky-400 font-black'
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-600'
                    }`}
                    style={{
                      borderRightWidth: (c + 1) % 3 === 0 && c !== 8 ? '2px' : '1px',
                      borderBottomWidth: (r + 1) % 3 === 0 && r !== 8 ? '2px' : '1px',
                      borderColor: (c + 1) % 3 === 0 || (r + 1) % 3 === 0 ? 'var(--border-block)' : 'var(--border-grid)',
                    }}
                  >
                    {val !== null ? val : ''}
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Input Numpad */}
          <div className="grid grid-cols-5 gap-1.5 w-full max-w-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <button
                key={d}
                onClick={() => handleDigitInput(d)}
                className="py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-100 font-bold rounded-xl active:scale-95 transition-all text-sm"
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => handleDigitInput(null)}
              className="py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold rounded-xl text-xs"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Validation & Publish Panel */}
        <div className="flex flex-col gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl">
          <div>
            <label className="block text-slate-400 text-xs font-bold mb-1">Puzzle Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-semibold text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Real-Time Mathematical Validation Card */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
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
              <span className="text-xs text-slate-500">Place given clues on the board to validate uniqueness.</span>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={handlePlay}
              disabled={validationResult.status !== 'unique'}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Play Custom Puzzle</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
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
