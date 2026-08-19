import React from 'react';

interface HeatmapOverlayProps {
  hesitationMap: Record<string, number>;
  size: number;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ hesitationMap, size }) => {
  const values = Object.values(hesitationMap);
  const maxMs = values.length > 0 ? Math.max(...values, 1000) : 1000;

  return (
    <div className="kudosu-panel p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
        <span>81-Cell Hesitation Heatmap</span>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">Max Focus: {(maxMs / 1000).toFixed(1)}s</span>
      </div>

      <div
        className="grid gap-[1px] bg-[var(--bg-card-subtle)] p-2 rounded-2xl border border-[var(--border-subtle)] aspect-square w-full max-w-xs mx-auto"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => {
            const ms = hesitationMap[`${r},${c}`] || 0;
            const intensity = Math.min(1, ms / maxMs);

            const red = Math.round(intensity * 240);
            const green = Math.round((1 - intensity) * 200 + 40);
            const blue = Math.round((1 - intensity) * 240);

            return (
              <div
                key={`${r}-${c}`}
                className="aspect-square rounded-[2px] transition-colors flex items-center justify-center text-[8px] font-mono font-bold"
                style={{
                  backgroundColor: `rgba(${red}, ${green}, ${blue}, ${0.15 + intensity * 0.7})`,
                  color: intensity > 0.4 ? '#ffffff' : 'var(--text-secondary)',
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
