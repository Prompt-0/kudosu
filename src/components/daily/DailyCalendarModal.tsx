import React, { useState } from 'react';
import { useStatsStore } from '../../store/statsStore';
import { PuzzleGenerator } from '../../engine/generator/generator';
import { PuzzleDefinition } from '../../types/sudoku';
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

interface DailyCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDailyPuzzle: (puzzle: PuzzleDefinition) => void;
}

export const DailyCalendarModal: React.FC<DailyCalendarModalProps> = ({
  isOpen,
  onClose,
  onSelectDailyPuzzle,
}) => {
  const { profile } = useStatsStore();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();

  if (!isOpen) return null;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  const handleLaunchDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const puzzle = PuzzleGenerator.generatePuzzle('classic', 'medium', 'rotational180', `daily-${dateStr}`);
    puzzle.title = `Daily Sudoku (${dateStr})`;
    puzzle.date = dateStr;
    onSelectDailyPuzzle(puzzle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg kudosu-panel p-6 flex flex-col gap-4 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-base">Daily Challenge Calendar</h3>
              <p className="text-xs text-[var(--text-secondary)]">Streak: {profile.currentStreak} Days</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}
            className="p-1 rounded-lg hover:bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm text-[var(--text-primary)]">
            {monthName} {currentYear}
          </span>
          <button
            onClick={() => setCurrentMonth((currentMonth + 1) % 12)}
            className="p-1 rounded-lg hover:bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 p-2.5 bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-subtle)]">
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isCompleted = profile.completedDailyDates.includes(dateStr);

            return (
              <button
                key={day}
                onClick={() => handleLaunchDay(day)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--border-active)] hover:text-[var(--text-accent)]'
                }`}
              >
                <span>{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-1" />
                ) : (
                  <Play className="w-3 h-3 text-[var(--text-secondary)] opacity-50 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
