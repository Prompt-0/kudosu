import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GhostEngine } from '../../racing/ghostEngine';
import { AI_RIVALS, AIRivalEngine } from '../../racing/aiRival';
import { Trophy, Ghost, Bot, Zap } from 'lucide-react';

interface RivalProgressBarProps {
  rivalDifficulty?: 'novice' | 'club' | 'master' | 'grandmaster';
}

export const RivalProgressBar: React.FC<RivalProgressBarProps> = ({ rivalDifficulty = 'club' }) => {
  const { cells, puzzle, timerMs, isCompleted } = useGameStore();

  if (!puzzle) return null;

  const size = cells.length || 9;
  const totalEmptyCells = puzzle.grid.flat().filter(c => c === null || c === 0).length || 40;
  const currentFilledCount = cells.flat().filter(c => !c.given && c.value !== null).length;
  const playerPercent = Math.min(100, Math.round((currentFilledCount / totalEmptyCells) * 100));

  const ghostRun = GhostEngine.getGhostRun(puzzle.difficulty);
  const ghostPercent = ghostRun ? GhostEngine.calculateGhostProgress(ghostRun, timerMs) : null;

  const rivalConfig = AI_RIVALS[rivalDifficulty];
  const aiPercent = AIRivalEngine.calculateAIProgress(rivalConfig, totalEmptyCells, timerMs);

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Zap className="w-3.5 h-3.5" />
          <span>Live Race Track</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {Math.floor(timerMs / 1000)}s
        </div>
      </div>

      {/* Progress Bars Container */}
      <div className="flex flex-col gap-1.5">
        {/* Player Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-16 font-bold text-cyan-400 truncate">You</span>
          <div className="relative flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${playerPercent}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[11px] text-slate-300">{playerPercent}%</span>
        </div>

        {/* Ghost PB Bar */}
        {ghostPercent !== null && (
          <div className="flex items-center gap-2 text-xs">
            <span className="w-16 text-amber-400 font-medium flex items-center gap-1 truncate">
              <Ghost className="w-3 h-3" /> PB
            </span>
            <div className="relative flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300 opacity-80"
                style={{ width: `${ghostPercent}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-[11px] text-slate-400">{ghostPercent}%</span>
          </div>
        )}

        {/* AI Rival Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="w-16 text-purple-400 font-medium flex items-center gap-1 truncate">
            <span>{rivalConfig.avatar}</span> {rivalConfig.name}
          </span>
          <div className="relative flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300 opacity-80"
              style={{ width: `${aiPercent}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[11px] text-slate-400">{aiPercent}%</span>
        </div>
      </div>
    </div>
  );
};
