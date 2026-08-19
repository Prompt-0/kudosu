import React, { useState } from 'react';
import { useStatsStore } from '../../store/statsStore';
import { PuzzleGenerator } from '../../engine/generator/generator';
import { PuzzleDefinition } from '../../types/sudoku';
import { Calendar, Trophy, CheckCircle2, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';

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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Daily Challenge Calendar</h3>
              <p className="text-xs text-slate-400">Streak: {profile.currentStreak} Days</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-slate-100">
            {monthName} {currentYear}
          </span>
          <button
            onClick={() => setCurrentMonth((currentMonth + 1) % 12)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 p-2 bg-slate-950 rounded-2xl border border-slate-800">
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isCompleted = profile.completedDailyDates.includes(dateStr);

            return (
              <button
                key={day}
                onClick={() => handleLaunchDay(day)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
              >
                <span>{day}</span>
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />
                ) : (
                  <Play className="w-2.5 h-2.5 text-slate-600 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
