import React from 'react';

interface HeatmapOverlayProps {
  hesitationMap: Record<string, number>;
  size: number;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ hesitationMap, size }) => {
  // Find max hesitation time
  const values = Object.values(hesitationMap);
  const maxMs = values.length > 0 ? Math.max(...values, 1000) : 1000;

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-md">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>81-Cell Hesitation Heatmap</span>
        <span className="text-[10px] text-slate-500">Max Focus: {(maxMs / 1000).toFixed(1)}s</span>
      </div>

      <div
        className="grid gap-[1px] bg-slate-950 p-1 rounded-lg border border-slate-800 aspect-square w-full max-w-xs mx-auto"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => {
            const ms = hesitationMap[`${r},${c}`] || 0;
            const intensity = Math.min(1, ms / maxMs);

            // Color gradient: Cyan (fast) -> Yellow -> Rose (heavy hesitation)
            const red = Math.round(intensity * 240);
            const green = Math.round((1 - intensity) * 200 + 40);
            const blue = Math.round((1 - intensity) * 240);

            return (
              <div
                key={`${r}-${c}`}
                className="aspect-square rounded-[2px] transition-colors flex items-center justify-center text-[8px] font-mono font-bold"
                style={{
                  backgroundColor: `rgba(${red}, ${green}, ${blue}, ${0.15 + intensity * 0.7})`,
                  color: intensity > 0.4 ? '#ffffff' : '#94a3b8',
                }}
                title={`R${r + 1}C${c + 1}: ${(ms / 1000).toFixed(1)}s`}
              >
                {ms > 2000 ? `${(ms / 1000).toFixed(0)}s` : ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
