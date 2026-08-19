import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Lightbulb, CheckCircle2, Wand2, ShieldAlert, RotateCcw, Plus } from 'lucide-react';

interface ActionToolbarProps {
  onNewGame: () => void;
  onOpenHintModal: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({ onNewGame, onOpenHintModal }) => {
  const {
    requestHint,
    checkBoard,
    autoFillCandidates,
    cleanInvalidCandidates,
    restartGame,
    isCompleted,
  } = useGameStore();

  const handleHintClick = () => {
    const step = requestHint();
    if (step) {
      onOpenHintModal();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-xl mx-auto">
      {/* 4-Tier Hint Tutor */}
      <button
        onClick={handleHintClick}
        disabled={isCompleted}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-950/50 transition-all duration-150 active:scale-95"
      >
        <Lightbulb className="w-4 h-4 text-yellow-300 animate-pulse" />
        <span>Deduction Hint</span>
      </button>

      {/* Check Board */}
      <button
        onClick={checkBoard}
        disabled={isCompleted}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Check</span>
      </button>

      {/* Auto-Fill Candidates */}
      <button
        onClick={autoFillCandidates}
        disabled={isCompleted}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
        title="Auto-calculate all mathematically possible candidates"
      >
        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
        <span>Auto-Notes</span>
      </button>

      {/* Clean Invalid Candidates */}
      <button
        onClick={cleanInvalidCandidates}
        disabled={isCompleted}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
        title="Remove candidates that conflict with existing digits"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
        <span>Clean Notes</span>
      </button>

      {/* Restart */}
      <button
        onClick={restartGame}
        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
        title="Restart Current Puzzle"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* New Game */}
      <button
        onClick={onNewGame}
        className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold rounded-xl transition-colors"
      >
        <Plus className="w-3.5 h-3.5 text-cyan-400" />
        <span>New Puzzle</span>
      </button>
    </div>
  );
};
