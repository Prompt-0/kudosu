import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GhostEngine } from '../../racing/ghostEngine';
import { AI_RIVALS, AIRivalEngine } from '../../racing/aiRival';
import { Ghost, Zap } from 'lucide-react';

interface RivalProgressBarProps {
  rivalDifficulty?: 'novice' | 'club' | 'master' | 'grandmaster';
}

export const RivalProgressBar: React.FC<RivalProgressBarProps> = ({ rivalDifficulty = 'club' }) => {
  const { cells, puzzle, timerMs } = useGameStore();

  if (!puzzle) return null;

  const totalEmptyCells = puzzle.grid.flat().filter(c => c === null || c === 0).length || 40;
  const currentFilledCount = cells.flat().filter(c => !c.given && c.value !== null).length;
  const playerPercent = Math.min(100, Math.round((currentFilledCount / totalEmptyCells) * 100));

  const ghostRun = GhostEngine.getGhostRun(puzzle.difficulty);
  const ghostPercent = ghostRun ? GhostEngine.calculateGhostProgress(ghostRun, timerMs) : null;

  const rivalConfig = AI_RIVALS[rivalDifficulty];
  const aiPercent = AIRivalEngine.calculateAIProgress(rivalConfig, totalEmptyCells, timerMs);

  return (
    <div className="w-full kudosu-panel p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-[var(--text-accent)] font-bold">
          <Zap className="w-4 h-4" />
          <span>Speedrun Split Track</span>
        </div>
        <div className="text-[11px] font-mono text-[var(--text-secondary)]">
          {Math.floor(timerMs / 1000)}s elapsed
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-2">
        {/* Player Bar */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="w-14 font-extrabold text-[var(--text-accent)] truncate">You</span>
          <div className="relative flex-1 h-3.5 rounded-full overflow-hidden bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${playerPercent}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono font-bold text-xs text-[var(--text-primary)]">{playerPercent}%</span>
        </div>

        {/* Ghost PB Bar */}
        {ghostPercent !== null && (
          <div className="flex items-center gap-2.5 text-xs">
            <span className="w-14 text-amber-400 font-semibold flex items-center gap-1 truncate">
              <Ghost className="w-3.5 h-3.5" /> PB
            </span>
            <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300 opacity-90"
                style={{ width: `${ghostPercent}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[11px] text-[var(--text-secondary)]">{ghostPercent}%</span>
          </div>
        )}

        {/* AI Rival Bar */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="w-14 text-purple-400 font-semibold flex items-center gap-1 truncate">
            <span>{rivalConfig.avatar}</span> {rivalConfig.name}
          </span>
          <div className="relative flex-1 h-2 rounded-full overflow-hidden bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300 opacity-90"
              style={{ width: `${aiPercent}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[11px] text-[var(--text-secondary)]">{aiPercent}%</span>
        </div>
      </div>
    </div>
  );
};
