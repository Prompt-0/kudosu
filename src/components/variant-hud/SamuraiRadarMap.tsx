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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-lg flex flex-col gap-2 max-w-[200px]">
      <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
        <Layers className="w-3.5 h-3.5" />
        <span>Samurai 5-Grid Radar</span>
      </div>

      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-28 h-28 mx-auto p-1 bg-slate-950 border border-slate-800 rounded-lg">
        {grids.map(g => {
          const isActive = activeGridIndex === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGrid(g.id)}
              className={`${g.pos} rounded font-bold text-[10px] transition-all duration-150 flex items-center justify-center ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 scale-105 z-10'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
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
