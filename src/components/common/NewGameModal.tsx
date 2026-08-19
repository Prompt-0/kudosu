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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl kudosu-panel p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-base">New Puzzle Generator</h3>
              <p className="text-xs text-[var(--text-secondary)]">Procedural seed generator with calibrated techniques</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Variant Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">1. Select Puzzle Variant:</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {VARIANT_METAS.map(v => {
              const isSelected = selectedVariant === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[var(--bg-card-subtle)] border-[var(--border-active)] ring-2 ring-[var(--border-active)] text-[var(--text-primary)] shadow-lg'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{v.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">{v.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Difficulty Level */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">2. Difficulty Level:</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DIFFICULTIES.map(d => {
              const isSelected = selectedDifficulty === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDifficulty(d.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[var(--text-accent)] text-slate-950 font-extrabold shadow-md'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)]'
                  }`}
                >
                  <span className="text-xs font-bold">{d.label}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-950 font-extrabold' : 'text-[var(--text-secondary)]'}`}>
                    {d.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Symmetry Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">3. Pattern Symmetry:</span>
          <select
            value={selectedSymmetry}
            onChange={e => setSelectedSymmetry(e.target.value as SymmetryType)}
            className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--text-primary)] focus:border-[var(--border-active)] focus:outline-none"
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
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="kudosu-btn-primary flex items-center gap-2 px-6 py-2.5 text-xs font-bold disabled:opacity-50"
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
