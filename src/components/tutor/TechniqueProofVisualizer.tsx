import React from 'react';
import { DeductionProofStep } from '../../types/solver';
import { Sparkles, Check, X } from 'lucide-react';

interface TechniqueProofVisualizerProps {
  step: DeductionProofStep;
}

export const TechniqueProofVisualizer: React.FC<TechniqueProofVisualizerProps> = ({ step }) => {
  return (
    <div className="flex flex-col gap-3 p-3.5 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-subtle)] text-xs">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-[var(--text-accent)] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>{step.technique}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] font-mono text-[10px] border border-[var(--border-subtle)]">
          Score: {step.difficultyScore}
        </span>
      </div>

      <p className="text-[var(--text-primary)] leading-relaxed">{step.explanation}</p>

      {/* Primary Pattern Cells */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
        <span className="text-[var(--text-secondary)] font-semibold">Involved Cells:</span>
        {step.primaryCells.map((c, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-[var(--bg-card)] text-[var(--text-accent)] border border-[var(--border-subtle)] rounded font-mono font-bold">
            R{c.row + 1}C{c.col + 1}
          </span>
        ))}
      </div>

      {/* Eliminations */}
      {step.eliminations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <X className="w-3.5 h-3.5" />
            <span>Eliminations:</span>
          </span>
          {step.eliminations.map((e, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded font-mono">
              R{e.cell.row + 1}C{e.cell.col + 1} <s>{e.digit}</s>
            </span>
          ))}
        </div>
      )}

      {/* Placements */}
      {step.placements.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>Places:</span>
          </span>
          {step.placements.map((p, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded font-mono font-bold">
              R{p.cell.row + 1}C{p.cell.col + 1} = {p.digit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
