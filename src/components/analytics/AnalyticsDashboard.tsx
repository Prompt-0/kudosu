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
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Game</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Speedcubing & Pro Analytics</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" /> Games Won
          </span>
          <span className="text-2xl font-black text-slate-100">
            {profile.totalGamesWon} <span className="text-xs text-slate-500 font-normal">/ {profile.totalGamesPlayed}</span>
          </span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" /> Current Streak
          </span>
          <span className="text-2xl font-black text-rose-400">
            {profile.currentStreak} <span className="text-xs text-slate-500 font-normal">days (Best: {profile.bestStreak})</span>
          </span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Win Rate
          </span>
          <span className="text-2xl font-black text-cyan-300">{winRate}%</span>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col gap-1 shadow-md">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Accuracy
          </span>
          <span className="text-2xl font-black text-emerald-400">{profile.radarMetrics.eliminationAccuracy}%</span>
        </div>
      </div>

      {/* Middle Grid: Radar Skills & Hesitation Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Radar Profile Metrics */}
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-md flex flex-col gap-3.5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Mastery Radar Metrics</span>
          </h3>

          <div className="flex flex-col gap-2.5 text-xs">
            {Object.entries(profile.radarMetrics).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between font-semibold text-slate-300 capitalize">
                  <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-cyan-400 font-mono">{val}/100</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
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
