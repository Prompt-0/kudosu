import React from 'react';
import { Layers } from 'lucide-react';

interface SamuraiRadarMapProps {
  activeGridIndex: number;
  onSelectGrid: (gridIndex: number) => void;
}

export const SamuraiRadarMap: React.FC<SamuraiRadarMapProps> = ({ activeGridIndex, onSelectGrid }) => {
  const grids = [
    { id: 1, label: 'Top-Left', pos: 'col-start-1 row-start-1' },
    { id: 2, label: 'Top-Right', pos: 'col-start-3 row-start-1' },
    { id: 0, label: 'Center', pos: 'col-start-2 row-start-2' },
    { id: 3, label: 'Bottom-Left', pos: 'col-start-1 row-start-3' },
    { id: 4, label: 'Bottom-Right', pos: 'col-start-3 row-start-3' },
  ];

  return (
    <div className="kudosu-panel p-3 flex flex-col gap-2 w-full max-w-[240px]">
      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-accent)]">
        <Layers className="w-4 h-4" />
        <span>Samurai 5-Grid Radar</span>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-32 h-32 mx-auto p-1.5 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl">
        {grids.map(g => {
          const isActive = activeGridIndex === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGrid(g.id)}
              className={`${g.pos} rounded-lg font-mono font-bold text-xs transition-all duration-150 flex items-center justify-center ${
                isActive
                  ? 'bg-[var(--text-accent)] text-slate-950 ring-2 ring-[var(--border-active)] scale-105 z-10 shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
              title={g.label}
            >
              G{g.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
