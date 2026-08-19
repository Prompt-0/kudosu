import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { useStatsStore } from '../../store/statsStore';
import { Trophy, Clock, Zap, ShieldAlert, Sparkles, Play, RotateCcw, Plus } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onOpenAnalytics: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  onClose,
  onNewGame,
  onOpenAnalytics,
}) => {
  const { puzzle, timerMs, mistakesCount, hintsUsed, restartGame } = useGameStore();

  if (!isOpen || !puzzle) return null;

  const seconds = Math.floor(timerMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  const timeFormatted = `${minutes}:${String(remSec).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center gap-5">
        {/* Trophy Icon */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 animate-pop shadow-lg shadow-amber-950/50">
          <Trophy className="w-12 h-12" />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black text-slate-100">Puzzle Solved!</h2>
          <p className="text-xs text-slate-400">
            {puzzle.title} • {puzzle.difficulty.toUpperCase()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Time
            </span>
            <span className="text-lg font-black text-slate-100 font-mono mt-0.5">{timeFormatted}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" /> Mistakes
            </span>
            <span className="text-lg font-black text-slate-100 font-mono mt-0.5">{mistakesCount}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" /> Hints
            </span>
            <span className="text-lg font-black text-slate-100 font-mono mt-0.5">{hintsUsed}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full pt-2">
          <button
            onClick={() => {
              onClose();
              onNewGame();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Play Another Puzzle</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAnalytics();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>View Replay & Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
