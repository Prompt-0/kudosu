import React from 'react';
import { DeductionProofStep } from '../../types/solver';
import { ArrowRight, Sparkles, Check, X } from 'lucide-react';

interface TechniqueProofVisualizerProps {
  step: DeductionProofStep;
}

export const TechniqueProofVisualizer: React.FC<TechniqueProofVisualizerProps> = ({ step }) => {
  return (
    <div className="flex flex-col gap-2.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-cyan-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{step.technique}</span>
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
          Score: {step.difficultyScore}
        </span>
      </div>

      <p className="text-slate-300 leading-relaxed">{step.explanation}</p>

      {/* Primary Pattern Cells */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800">
        <span className="text-slate-400 font-semibold">Involved Cells:</span>
        {step.primaryCells.map((c, idx) => (
          <span key={idx} className="px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-700/50 rounded font-mono">
            R{c.row + 1}C{c.col + 1}
          </span>
        ))}
      </div>

      {/* Eliminations */}
      {step.eliminations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-rose-400 font-semibold flex items-center gap-1">
            <X className="w-3 h-3" />
            <span>Eliminations:</span>
          </span>
          {step.eliminations.map((e, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-mono">
              R{e.cell.row + 1}C{e.cell.col + 1} <s>{e.digit}</s>
            </span>
          ))}
        </div>
      )}

      {/* Placements */}
      {step.placements.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Places:</span>
          </span>
          {step.placements.map((p, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono font-bold">
              R{p.cell.row + 1}C{p.cell.col + 1} = {p.digit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
