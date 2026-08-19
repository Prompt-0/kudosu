import React from 'react';
import { useStatsStore } from '../../store/statsStore';
import { useGameStore } from '../../store/gameStore';
import { HeatmapOverlay } from './HeatmapOverlay';
import { Trophy, Zap, ShieldCheck, Flame, BarChart3, ChevronLeft } from 'lucide-react';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onBack }) => {
  const { profile } = useStatsStore();
  const { cellHesitationMs, cells } = useGameStore();

  const winRate = profile.totalGamesPlayed > 0
    ? Math.round((profile.totalGamesWon / profile.totalGamesPlayed) * 100)
    : 100;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-2 md:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Game</span>
        </button>

        <div className="flex items-center gap-2 text-[var(--text-accent)] font-extrabold text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Speedcubing & Pro Analytics</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="kudosu-panel p-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Games Won
          </span>
          <span className="text-2xl font-black font-mono text-[var(--text-primary)]">
            {profile.totalGamesWon} <span className="text-xs text-[var(--text-secondary)] font-normal">/ {profile.totalGamesPlayed}</span>
          </span>
        </div>

        <div className="kudosu-panel p-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Current Streak
          </span>
          <span className="text-2xl font-black font-mono text-rose-400">
            {profile.currentStreak} <span className="text-xs text-[var(--text-secondary)] font-normal">days (Best: {profile.bestStreak})</span>
          </span>
        </div>

        <div className="kudosu-panel p-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[var(--text-accent)]" /> Win Rate
          </span>
          <span className="text-2xl font-black font-mono text-[var(--text-accent)]">{winRate}%</span>
        </div>

        <div className="kudosu-panel p-4 flex flex-col gap-1">
          <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">{profile.radarMetrics.eliminationAccuracy}%</span>
        </div>
      </div>

      {/* Middle Grid: Radar Skills & Hesitation Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Radar Profile Metrics */}
        <div className="kudosu-panel p-5 flex flex-col gap-4">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--text-accent)]" />
            <span>Mastery Radar Metrics</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            {Object.entries(profile.radarMetrics).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex justify-between font-bold text-[var(--text-primary)] capitalize">
                  <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-[var(--text-accent)] font-mono">{val}/100</span>
                </div>
                <div className="h-2.5 bg-[var(--bg-card-subtle)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hesitation Heatmap */}
        <HeatmapOverlay hesitationMap={cellHesitationMs} size={cells.length || 9} />
      </div>
    </div>
  );
};
