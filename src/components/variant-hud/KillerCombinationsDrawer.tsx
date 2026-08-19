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
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg transition-colors"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Killer Cage Math Helper</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-3 shadow-xl flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Calculator className="w-4 h-4" />
              <span>Killer Cage Combinations Table</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Cage Size (Cells):</label>
              <div className="flex gap-1">
                {[2, 3, 4, 5, 6].map(s => (
                  <button
                    key={s}
                    onClick={() => setCageSize(s)}
                    className={`flex-1 py-1 rounded font-bold ${
                      cageSize === s ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Target Sum: {targetSum}</label>
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
            <label className="block text-slate-400 text-xs mb-1">Exclude Digits in Unit:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => {
                const isExcluded = excludedDigits.includes(d);
                return (
                  <button
                    key={d}
                    onClick={() => toggleExcluded(d)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      isExcluded
                        ? 'bg-rose-600/60 line-through text-rose-200 border border-rose-500'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>Valid Combinations ({combinations.length}):</span>
              {combinations.length === 1 && <span className="text-amber-400 font-bold">LOCKED COMBINATION!</span>}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {combinations.length > 0 ? (
                combinations.map((combo, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded font-mono text-xs border border-slate-700"
                  >
                    {combo.join(' + ')}
                  </span>
                ))
              ) : (
                <span className="text-xs text-rose-400">No valid combinations with current exclusions.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
