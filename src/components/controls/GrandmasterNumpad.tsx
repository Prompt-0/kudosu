import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { InputMode } from '../../types/sudoku';
import { Undo2, Redo2, Eraser, PenLine, Sparkles, Hash, Palette } from 'lucide-react';
import { digitToMonsterChar } from '../../variants/monster';

export const GrandmasterNumpad: React.FC = () => {
  const {
    cells,
    puzzle,
    inputMode,
    setInputMode,
    inputDigit,
    clearSelected,
    undo,
    redo,
    historyIndex,
    history,
  } = useGameStore();

  const { autoPrune } = useSettingsStore();

  if (!puzzle) return null;

  const size = cells.length || 9;

  // Calculate remaining count for each digit
  const digitCounts: Record<number, number> = {};
  for (let d = 1; d <= size; d++) digitCounts[d] = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = cells[r]?.[c]?.value;
      if (val) {
        digitCounts[val] = (digitCounts[val] || 0) + 1;
      }
    }
  }

  const modes: { id: InputMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'normal', label: 'Digit', icon: Hash },
    { id: 'corner', label: 'Corner', icon: PenLine },
    { id: 'center', label: 'Center', icon: Sparkles },
    { id: 'color', label: 'Color', icon: Palette },
  ];

  const digits = Array.from({ length: size }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto kudosu-panel p-3.5">
      {/* Mode Selector Tabs & Undo/Redo */}
      <div className="flex items-center justify-between bg-[var(--bg-card-subtle)] p-1 rounded-xl border border-[var(--border-subtle)]">
        <div className="flex gap-1 flex-1">
          {modes.map(m => {
            const Icon = m.icon;
            const isActive = inputMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setInputMode(m.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--text-accent)] text-slate-950 shadow-md font-extrabold scale-[1.02]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Undo / Redo / Erase */}
        <div className="flex items-center gap-1 pl-2 border-l border-[var(--border-subtle)]">
          <button
            onClick={undo}
            disabled={historyIndex < 0}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            onClick={clearSelected}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-rose-400 hover:bg-[var(--bg-card)] transition-colors"
            title="Clear Cell (Backspace)"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Digits Numpad Grid */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: size === 16 ? 'repeat(8, minmax(0, 1fr))' : `repeat(${size}, minmax(0, 1fr))`,
        }}
      >
        {digits.map(d => {
          const remaining = size - (digitCounts[d] || 0);
          const isComplete = remaining <= 0;

          return (
            <button
              key={d}
              onClick={() => inputDigit(d, autoPrune)}
              disabled={isComplete && inputMode === 'normal'}
              className={`relative flex flex-col items-center justify-center py-3 rounded-xl border font-mono font-extrabold text-xl md:text-2xl tabular-nums transition-all duration-150 select-none shadow-sm ${
                isComplete
                  ? 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-note)] opacity-40 cursor-default'
                  : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-active)] hover:text-[var(--text-accent)] active:scale-95'
              }`}
            >
              <span>{size === 16 ? digitToMonsterChar(d) : d}</span>
              <span className="text-[10px] font-sans font-medium text-[var(--text-secondary)] leading-none mt-0.5">
                {isComplete ? '✓' : remaining}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
