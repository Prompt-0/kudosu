import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Palette, X } from 'lucide-react';

const COLORS = [
  { id: 1, name: 'Red', varName: 'var(--color-p1)' },
  { id: 2, name: 'Orange', varName: 'var(--color-p2)' },
  { id: 3, name: 'Yellow', varName: 'var(--color-p3)' },
  { id: 4, name: 'Green', varName: 'var(--color-p4)' },
  { id: 5, name: 'Teal', varName: 'var(--color-p5)' },
  { id: 6, name: 'Sky', varName: 'var(--color-p6)' },
  { id: 7, name: 'Purple', varName: 'var(--color-p7)' },
  { id: 8, name: 'Pink', varName: 'var(--color-p8)' },
];

export const ColorPaletteBar: React.FC = () => {
  const { activePaletteColor, setActivePaletteColor, applyColor } = useGameStore();

  return (
    <div className="flex items-center justify-center gap-2 p-2.5 kudosu-panel">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-bold px-2">
        <Palette className="w-4 h-4 text-[var(--text-accent)]" />
        <span>Chains Color:</span>
      </div>

      <div className="flex items-center gap-2">
        {COLORS.map(c => {
          const isSelected = activePaletteColor === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setActivePaletteColor(c.id);
                applyColor(c.id);
              }}
              style={{ backgroundColor: c.varName }}
              className={`w-6 h-6 rounded-full transition-transform duration-150 shadow-sm ${
                isSelected ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-110'
              }`}
              title={c.name}
            />
          );
        })}

        <button
          onClick={() => applyColor(null)}
          className="w-6 h-6 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          title="Clear Color"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
