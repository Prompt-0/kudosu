import { create } from 'zustand';
import { UserStatsProfile, GameTelemetry } from '../types/stats';

const DEFAULT_PROFILE: UserStatsProfile = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: '',
  winTimesByDifficulty: {
    beginner: { bestMs: 0, averageMs: 0, count: 0 },
    easy: { bestMs: 0, averageMs: 0, count: 0 },
    medium: { bestMs: 0, averageMs: 0, count: 0 },
    hard: { bestMs: 0, averageMs: 0, count: 0 },
    expert: { bestMs: 0, averageMs: 0, count: 0 },
    master: { bestMs: 0, averageMs: 0, count: 0 },
    grandmaster: { bestMs: 0, averageMs: 0, count: 0 },
  },
  radarMetrics: {
    scanningSpeed: 80,
    eliminationAccuracy: 85,
    advancedTechniques: 70,
    errorResistance: 90,
    speedrunConsistency: 75,
  },
  completedDailyDates: [],
};

interface StatsState {
  profile: UserStatsProfile;
  recentGames: GameTelemetry[];

  recordGameCompletion: (telemetry: GameTelemetry) => void;
  recordDailyCompletion: (dateStr: string) => void;
  loadStats: () => void;
  resetStats: () => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  recentGames: [],

  loadStats: () => {
    try {
      const saved = localStorage.getItem('kudosu_stats_profile');
      if (saved) {
        set({ profile: JSON.parse(saved) });
      }
    } catch {
      // fallback default
    }
  },

  recordGameCompletion: (telemetry: GameTelemetry) => {
    const { profile, recentGames } = get();
    const today = new Date().toISOString().split('T')[0];

    let streak = profile.currentStreak;
    if (profile.lastPlayedDate === today) {
      // already played today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (profile.lastPlayedDate === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }

    const diffStats = profile.winTimesByDifficulty[telemetry.difficulty] || { bestMs: 0, averageMs: 0, count: 0 };
    const newCount = diffStats.count + 1;
    const newBest = diffStats.bestMs === 0 ? telemetry.totalTimeMs : Math.min(diffStats.bestMs, telemetry.totalTimeMs);
    const newAvg = Math.round((diffStats.averageMs * diffStats.count + telemetry.totalTimeMs) / newCount);

    const updatedProfile: UserStatsProfile = {
      ...profile,
      totalGamesPlayed: profile.totalGamesPlayed + 1,
      totalGamesWon: profile.totalGamesWon + (telemetry.completed ? 1 : 0),
      currentStreak: streak,
      bestStreak: Math.max(profile.bestStreak, streak),
      lastPlayedDate: today,
      winTimesByDifficulty: {
        ...profile.winTimesByDifficulty,
        [telemetry.difficulty]: {
          bestMs: newBest,
          averageMs: newAvg,
          count: newCount,
        },
      },
    };

    localStorage.setItem('kudosu_stats_profile', JSON.stringify(updatedProfile));
    set({
      profile: updatedProfile,
      recentGames: [telemetry, ...recentGames.slice(0, 19)],
    });
  },

  recordDailyCompletion: (dateStr: string) => {
    const { profile } = get();
    if (!profile.completedDailyDates.includes(dateStr)) {
      const nextDates = [...profile.completedDailyDates, dateStr];
      const updated = { ...profile, completedDailyDates: nextDates };
      localStorage.setItem('kudosu_stats_profile', JSON.stringify(updated));
      set({ profile: updated });
    }
  },

  resetStats: () => {
    localStorage.removeItem('kudosu_stats_profile');
    set({ profile: DEFAULT_PROFILE, recentGames: [] });
  },
}));
