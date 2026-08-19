import { DifficultyLevel, SudokuVariant } from './sudoku';

export interface GameTelemetry {
  puzzleId: string;
  variant: SudokuVariant;
  difficulty: DifficultyLevel;
  startTime: number;
  endTime: number;
  totalTimeMs: number;
  movesCount: number;
  undoCount: number;
  hintsUsed: number;
  mistakesCount: number;
  movesPerMinute: number;
  cellHesitationMs: Record<string, number>; // key: "r,c" -> total milliseconds focused
  completed: boolean;
}

export interface UserStatsProfile {
  totalGamesPlayed: number;
  totalGamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
  winTimesByDifficulty: Record<DifficultyLevel, { bestMs: number; averageMs: number; count: number }>;
  radarMetrics: {
    scanningSpeed: number;     // 0-100
    eliminationAccuracy: number; // 0-100
    advancedTechniques: number; // 0-100
    errorResistance: number;    // 0-100
    speedrunConsistency: number; // 0-100
  };
  completedDailyDates: string[];
}
