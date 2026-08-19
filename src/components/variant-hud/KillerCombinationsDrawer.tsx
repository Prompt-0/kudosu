import React, { useState } from 'react';
import { getCageCombinations } from '../../variants/killer';
import { Calculator, X } from 'lucide-react';

export const KillerCombinationsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cageSize, setCageSize] = useState(3);
  const [targetSum, setTargetSum] = useState(15);
  const [excludedDigits, setExcludedDigits] = useState<number[]>([]);

  const combinations = getCageCombinations(targetSum, cageSize, excludedDigits);

  const toggleExcluded = (d: number) => {
    if (excludedDigits.includes(d)) {
      setExcludedDigits(excludedDigits.filter(x => x !== d));
    } else {
      setExcludedDigits([...excludedDigits, d]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 kudosu-btn-secondary text-xs font-bold"
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Killer Cage Math Matrix</span>
        </button>
      ) : (
        <div className="kudosu-panel p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Calculator className="w-4 h-4" />
              <span>Killer Cage Sum Combinations</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Cage Size (Cells):</label>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6].map(s => (
                  <button
                    key={s}
                    onClick={() => setCageSize(s)}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-xs ${
                      cageSize === s
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)] hover:border-[var(--border-active)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[var(--text-secondary)] mb-1 font-semibold">Target Sum: <span className="font-mono font-bold text-amber-400">{targetSum}</span></label>
              <input
                type="range"
                min={cageSize * (cageSize + 1) / 2}
                max={cageSize * 9 - cageSize * (cageSize - 1) / 2}
                value={targetSum}
                onChange={e => setTargetSum(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--text-secondary)] text-xs mb-1.5 font-semibold">Exclude Known Digits:</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                const isExcluded = excludedDigits.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleExcluded(d)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                      isExcluded
                        ? 'bg-rose-600/60 line-through text-rose-200 border border-rose-500'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-active)]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--bg-card-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
            <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2 flex items-center justify-between">
              <span>Valid Combinations ({combinations.length}):</span>
              {combinations.length === 1 && <span className="text-amber-400 font-extrabold">LOCKED COMBINATION!</span>}
            </div>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {combinations.length > 0 ? (
                combinations.map((combo, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[var(--bg-card)] text-amber-300 rounded-lg font-mono text-xs border border-[var(--border-subtle)] shadow-sm"
                  >
                    {combo.join(' + ')}
                  </span>
                ))
              ) : (
                <span className="text-xs text-rose-400 font-medium">No valid combinations with current exclusions.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
