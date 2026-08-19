import { AIRivalConfig } from '../types/racing';

export const AI_RIVALS: Record<string, AIRivalConfig> = {
  novice: {
    id: 'ai-novice',
    name: 'Byte Novice',
    avatar: '🤖',
    difficulty: 'novice',
    movesPerMinute: 24,
    errorChance: 0.08,
  },
  club: {
    id: 'ai-club',
    name: 'Circuit Club',
    avatar: '⚡',
    difficulty: 'club',
    movesPerMinute: 52,
    errorChance: 0.04,
  },
  master: {
    id: 'ai-master',
    name: 'Quantum Master',
    avatar: '🧠',
    difficulty: 'master',
    movesPerMinute: 85,
    errorChance: 0.01,
  },
  grandmaster: {
    id: 'ai-gm',
    name: 'Zenith Apex',
    avatar: '👑',
    difficulty: 'grandmaster',
    movesPerMinute: 125,
    errorChance: 0.0,
  },
};

export class AIRivalEngine {
  static calculateAIProgress(rival: AIRivalConfig, totalCellsToFill: number, elapsedMs: number): number {
    const elapsedMinutes = elapsedMs / 60000;
    const movesMade = elapsedMinutes * rival.movesPerMinute;
    const percent = (movesMade / totalCellsToFill) * 100;
    return Math.min(100, Math.round(percent));
  }
}
