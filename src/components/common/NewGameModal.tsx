import React, { useState } from 'react';
import { VARIANT_METAS } from '../../variants/variantRegistry';
import { GeneratorClient } from '../../engine/generator/workerClient';
import { SudokuVariant, DifficultyLevel, PuzzleDefinition } from '../../types/sudoku';
import { SymmetryType } from '../../engine/generator/generator';
import { Sparkles, X, Play, Loader2 } from 'lucide-react';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPuzzle: (puzzle: PuzzleDefinition) => void;
}

const DIFFICULTIES: { id: DifficultyLevel; label: string; score: string }[] = [
  { id: 'beginner', label: 'Beginner', score: '100' },
  { id: 'easy', label: 'Easy', score: '200' },
  { id: 'medium', label: 'Medium', score: '350' },
  { id: 'hard', label: 'Hard', score: '550' },
  { id: 'expert', label: 'Expert', score: '700' },
  { id: 'master', label: 'Master', score: '850' },
  { id: 'grandmaster', label: 'Grandmaster', score: '1000+' },
];

export const NewGameModal: React.FC<NewGameModalProps> = ({ isOpen, onClose, onSelectPuzzle }) => {
  const [selectedVariant, setSelectedVariant] = useState<SudokuVariant>('classic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedSymmetry, setSelectedSymmetry] = useState<SymmetryType>('rotational180');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const puzzle = await GeneratorClient.generate(
        selectedVariant,
        selectedDifficulty,
        selectedSymmetry
      );
      onSelectPuzzle(puzzle);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">New Puzzle Generator</h3>
              <p className="text-xs text-slate-400">Procedural generation with calibrated difficulty</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Variant Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300">1. Select Puzzle Variant:</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {VARIANT_METAS.map(v => {
              const isSelected = selectedVariant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{v.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{v.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty Level */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300">2. Calibrated Difficulty Level:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DIFFICULTIES.map(d => {
              const isSelected = selectedDifficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">{d.label}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
                    {d.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Symmetry Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300">3. Pattern Symmetry:</span>
          <select
            value={selectedSymmetry}
            onChange={e => setSelectedSymmetry(e.target.value as SymmetryType)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200"
          >
            <option value="rotational180">Rotational 180° (Standard)</option>
            <option value="rotational90">Rotational 90° (4-Way Symmetry)</option>
            <option value="diagonal">Diagonal Symmetry</option>
            <option value="horizontal">Horizontal Mirror</option>
            <option value="vertical">Vertical Mirror</option>
            <option value="none">Asymmetric (Organic)</option>
          </select>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Puzzle...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Game</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
