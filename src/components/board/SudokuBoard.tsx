import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { SudokuCell } from './SudokuCell';
import { ProofLaserOverlay } from './ProofLaserOverlay';
import { KillerCagesOverlay } from './KillerCagesOverlay';
import { DiagonalOverlay } from './DiagonalOverlay';
import { Play, Pause, ShieldCheck } from 'lucide-react';

export const SudokuBoard: React.FC = () => {
  const {
    cells,
    puzzle,
    selectedCells,
    activeDigitFilter,
    activeHintStep,
    selectCell,
    inputDigit,
    clearSelected,
    undo,
    redo,
    requestHint,
    checkBoard,
    setInputMode,
    inputMode,
    tickTimer,
    hasStarted,
    isPaused,
    startGame,
    togglePause,
  } = useGameStore();

  const { autoPrune, highlightDuplicates, highlightSameDigit } = useSettingsStore();

  // Active Timer Tick
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimer(100);
    }, 100);
    return () => clearInterval(interval);
  }, [tickTimer]);

  // Keyboard controls listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Escape: Toggle Pause / Resume
      if (e.key === 'Escape') {
        e.preventDefault();
        if (hasStarted) {
          togglePause();
        }
        return;
      }

      // Space / Enter: If not started, start. If paused, resume. Otherwise cycle input mode.
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!hasStarted) {
          startGame();
          return;
        }
        if (isPaused) {
          togglePause();
          return;
        }
        const modes: ('normal' | 'corner' | 'center' | 'color')[] = ['normal', 'corner', 'center', 'color'];
        const nextIdx = (modes.indexOf(inputMode) + 1) % modes.length;
        setInputMode(modes[nextIdx]);
        return;
      }

      // If in initial state and presses a number, start game and input
      if (!hasStarted && /^[1-9]$/.test(e.key)) {
        startGame();
      }

      // If paused, ignore further board actions
      if (isPaused) return;

      const sel = selectedCells[0] || { row: 0, col: 0 };
      const size = cells.length || 9;

      // WASD / Arrow Navigation
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        selectCell({ row: (sel.row - 1 + size) % size, col: sel.col });
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        selectCell({ row: (sel.row + 1) % size, col: sel.col });
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        selectCell({ row: sel.row, col: (sel.col - 1 + size) % size });
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        selectCell({ row: sel.row, col: (sel.col + 1) % size });
      }

      // Numbers 1-9
      else if (/^[1-9]$/.test(e.key)) {
        const digit = parseInt(e.key, 10);
        if (e.shiftKey) {
          useGameStore.getState().toggleCornerMark(digit);
        } else if (e.ctrlKey || e.metaKey) {
          useGameStore.getState().toggleCenterMark(digit);
        } else {
          inputDigit(digit, autoPrune);
        }
      }

      // Backspace / Delete
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        clearSelected();
      }

      // Undo (Ctrl+Z)
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      // Hint (H)
      else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        requestHint();
      }

      // Check (C)
      else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        checkBoard();
      }
    },
    [cells.length, selectedCells, inputMode, inputDigit, autoPrune, selectCell, setInputMode, clearSelected, undo, redo, requestHint, checkBoard, isPaused, hasStarted, togglePause, startGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!puzzle || cells.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
        Loading puzzle matrix...
      </div>
    );
  }

  const size = cells.length;
  const activeCell = selectedCells[0];
  const activeValue = activeCell ? cells[activeCell.row]?.[activeCell.col]?.value : null;
  const highlightDigit = activeDigitFilter !== null ? activeDigitFilter : activeValue;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[500px] mx-auto select-none gap-2">
      {/* Board Outer Container */}
      <div
        className="relative grid w-full aspect-square p-2 rounded-2xl shadow-2xl overflow-hidden border-2 border-[var(--border-strong)] bg-[var(--bg-card)]"
        style={{
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {/* Cells */}
        {cells.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const isSelected = selectedCells.some(sel => sel.row === r && sel.col === c);
            const isPeer = Boolean(
              activeCell &&
                (activeCell.row === r ||
                  activeCell.col === c ||
                  (Math.floor(activeCell.row / 3) === Math.floor(r / 3) &&
                    Math.floor(activeCell.col / 3) === Math.floor(c / 3)))
            );

            const isSameDigit = Boolean(
              highlightSameDigit &&
                highlightDigit !== null &&
                cell.value === highlightDigit
            );

            const isHintPrimary = Boolean(
              activeHintStep?.primaryCells.some(p => p.row === r && p.col === c)
            );

            const isHintTarget = Boolean(
              activeHintStep?.eliminations.some(e => e.cell.row === r && e.cell.col === c)
            );

            const isError = Boolean(
              highlightDuplicates &&
                puzzle.solution &&
                cell.value !== null &&
                puzzle.solution[r]?.[c] !== cell.value
            );

            return (
              <SudokuCell
                key={`${r}-${c}`}
                cell={cell}
                size={size}
                isSelected={isSelected}
                isPeer={isPeer}
                isSameDigit={isSameDigit}
                isHintPrimary={isHintPrimary}
                isHintTarget={isHintTarget}
                isError={isError}
                onClick={e => {
                  if (!hasStarted) {
                    startGame();
                  } else if (!isPaused) {
                    selectCell({ row: r, col: c }, e.shiftKey || e.metaKey);
                  }
                }}
              />
            );
          })
        )}

        {/* SVG Laser Proof Overlays */}
        {activeHintStep?.laserLines && (
          <ProofLaserOverlay laserLines={activeHintStep.laserLines} size={size} />
        )}

        {/* Killer Cages Overlay */}
        {puzzle.cages && <KillerCagesOverlay cages={puzzle.cages} size={size} />}

        {/* Diagonal X-Sudoku Overlay */}
        {puzzle.variant === 'diagonal' && <DiagonalOverlay />}

        {/* 1. Default Initial Frosted Blur Overlay (Before Game Start) */}
        {!hasStarted && (
          <div
            onClick={startGame}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl cursor-pointer animate-fade-in p-6 text-center"
          >
            <div className="p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-active)] text-[var(--text-accent)] shadow-2xl mb-3 animate-pop">
              <Play className="w-9 h-9 fill-current pl-0.5" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">Ready to Solve?</h3>
            <p className="text-xs text-[var(--text-accent)] font-mono font-bold mt-1 uppercase">
              {puzzle.variant} • {puzzle.difficulty} (Score {puzzle.difficultyScore})
            </p>

            <button
              onClick={startGame}
              className="mt-4 px-6 py-3 kudosu-btn-primary flex items-center gap-2 text-xs font-extrabold shadow-xl hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Solving (Space)</span>
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-4 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Board hidden to guarantee competitive timing integrity</span>
            </div>
          </div>
        )}

        {/* 2. Mid-Game Frosted Pause Overlay (When Paused) */}
        {hasStarted && isPaused && (
          <div
            onClick={togglePause}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md cursor-pointer animate-fade-in p-6 text-center"
          >
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-active)] text-[var(--text-accent)] shadow-2xl mb-3 animate-pop">
              <Pause className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-white">Game Paused</h3>
            <p className="text-xs text-slate-300 mt-1">Inspection hidden during pause to preserve fair timing</p>
            <button
              onClick={togglePause}
              className="mt-4 px-5 py-2.5 kudosu-btn-primary flex items-center gap-2 text-xs font-bold shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Solving (Space)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
