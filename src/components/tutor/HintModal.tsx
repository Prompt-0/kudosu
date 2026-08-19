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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Human Deduction Tutor</h3>
              <p className="text-xs text-slate-400">Step-by-step logical walkthrough</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier 1: Directional Nudge */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Tier 1 — Directional Nudge</span>
          </div>
          <p className="text-sm text-slate-200">{activeHintStep.nudgeMessage}</p>
        </div>

        {/* Tier 2: Technique Reveal */}
        {currentTier >= 2 ? (
          <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/30 flex flex-col gap-1.5 animate-pop">
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Tier 2 — Technique Revealed</span>
            </div>
            <p className="text-sm font-semibold text-slate-100">{activeHintStep.techniqueTitle}</p>
          </div>
        ) : (
          <button
            onClick={() => setCurrentTier(2)}
            className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span>Need more help? Reveal the technique name</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        {/* Tier 3: Full Proof & Diagram */}
        {currentTier >= 3 ? (
          <TechniqueProofVisualizer step={activeHintStep} />
        ) : currentTier >= 2 ? (
          <button
            onClick={() => setCurrentTier(3)}
            className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <span>Show full step-by-step proof & visual laser overlays</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        ) : null}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            Try Myself
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Step to Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
