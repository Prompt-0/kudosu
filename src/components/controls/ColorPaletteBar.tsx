import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Palette, X } from 'lucide-react';

const COLORS = [
  { id: 1, name: 'Red', bg: 'bg-red-500' },
  { id: 2, name: 'Orange', bg: 'bg-orange-500' },
  { id: 3, name: 'Amber', bg: 'bg-amber-400' },
  { id: 4, name: 'Green', bg: 'bg-green-500' },
  { id: 5, name: 'Teal', bg: 'bg-teal-400' },
  { id: 6, name: 'Sky', bg: 'bg-sky-400' },
  { id: 7, name: 'Purple', bg: 'bg-purple-500' },
  { id: 8, name: 'Pink', bg: 'bg-pink-500' },
];

export const ColorPaletteBar: React.FC = () => {
  const { activePaletteColor, setActivePaletteColor, applyColor } = useGameStore();

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl shadow-lg">
      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-2">
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span>Chains Color:</span>
      </div>

      <div className="flex items-center gap-1.5">
        {COLORS.map(c => {
          const isSelected = activePaletteColor === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setActivePaletteColor(c.id);
                applyColor(c.id);
              }}
              className={`w-6 h-6 rounded-full transition-transform duration-150 ${c.bg} ${
                isSelected ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-75 hover:opacity-100 hover:scale-110'
              }`}
              title={c.name}
            />
          );
        })}

        <button
          onClick={() => applyColor(null)}
          className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          title="Clear Color"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
