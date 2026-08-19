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
        className="kudosu-btn-primary flex items-center gap-2 px-4 py-2 text-xs font-bold"
      >
        <Lightbulb className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Deduction Hint</span>
      </button>

      {/* Check Board */}
      <button
        onClick={checkBoard}
        disabled={isCompleted}
        className="kudosu-btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Check</span>
      </button>

      {/* Auto-Fill Candidates */}
      <button
        onClick={autoFillCandidates}
        disabled={isCompleted}
        className="kudosu-btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
        title="Auto-calculate all mathematically possible candidates"
      >
        <Wand2 className="w-4 h-4 text-purple-400" />
        <span>Auto-Notes</span>
      </button>

      {/* Clean Invalid Candidates */}
      <button
        onClick={cleanInvalidCandidates}
        disabled={isCompleted}
        className="kudosu-btn-secondary flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
        title="Remove candidates that conflict with existing digits"
      >
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        <span>Clean Notes</span>
      </button>

      {/* Restart */}
      <button
        onClick={restartGame}
        className="kudosu-btn-secondary p-2"
        title="Restart Current Puzzle"
      >
        <RotateCcw className="w-4 h-4 text-[var(--text-secondary)]" />
      </button>

      {/* New Game */}
      <button
        onClick={onNewGame}
        className="kudosu-btn-secondary flex items-center gap-1 px-3 py-2 text-xs font-bold"
      >
        <Plus className="w-4 h-4 text-[var(--text-accent)]" />
        <span>New Puzzle</span>
      </button>
    </div>
  );
};
