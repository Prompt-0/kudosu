import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { TechniqueProofVisualizer } from './TechniqueProofVisualizer';
import { Lightbulb, X, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose }) => {
  const { activeHintStep, applyHintStep, clearHint } = useGameStore();
  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(1);

  if (!isOpen || !activeHintStep) return null;

  const handleApply = () => {
    applyHintStep(activeHintStep);
    onClose();
  };

  const handleClose = () => {
    clearHint();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg kudosu-panel p-6 flex flex-col gap-4 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-base">Human Deduction Tutor</h3>
              <p className="text-xs text-[var(--text-secondary)]">Step-by-step logical walkthrough</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier 1: Directional Nudge */}
        <div className="p-4 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-subtle)] flex flex-col gap-1.5">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Tier 1 — Directional Nudge</span>
          </div>
          <p className="text-sm text-[var(--text-primary)]">{activeHintStep.nudgeMessage}</p>
        </div>

        {/* Tier 2: Technique Reveal */}
        {currentTier >= 2 ? (
          <div className="p-4 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-active)] flex flex-col gap-1.5 animate-pop">
            <div className="text-xs font-bold text-[var(--text-accent)] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Tier 2 — Technique Revealed</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{activeHintStep.techniqueTitle}</p>
          </div>
        ) : (
          <button
            onClick={() => setCurrentTier(2)}
            className="flex items-center justify-between p-3.5 kudosu-btn-secondary text-xs font-bold transition-all"
          >
            <span>Need more help? Reveal the technique name</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-accent)]" />
          </button>
        )}

        {/* Tier 3: Full Proof & Diagram */}
        {currentTier >= 3 ? (
          <TechniqueProofVisualizer step={activeHintStep} />
        ) : currentTier >= 2 ? (
          <button
            onClick={() => setCurrentTier(3)}
            className="flex items-center justify-between p-3.5 kudosu-btn-secondary text-xs font-bold transition-all"
          >
            <span>Show full step-by-step proof & visual laser connectors</span>
            <ChevronRight className="w-4 h-4 text-[var(--text-accent)]" />
          </button>
        ) : null}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Try Myself
          </button>

          <button
            onClick={handleApply}
            className="kudosu-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Step to Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
