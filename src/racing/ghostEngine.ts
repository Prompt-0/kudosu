import { GhostRunData } from '../types/racing';

export class GhostEngine {
  static saveGhostRun(ghost: GhostRunData) {
    try {
      const key = `kudosu_ghost_${ghost.difficulty}`;
      const existing = localStorage.getItem(key);
      if (existing) {
        const prev: GhostRunData = JSON.parse(existing);
        if (ghost.totalTimeMs < prev.totalTimeMs) {
          localStorage.setItem(key, JSON.stringify(ghost));
        }
      } else {
        localStorage.setItem(key, JSON.stringify(ghost));
      }
    } catch {
      // storage quota or disabled
    }
  }

  static getGhostRun(difficulty: string): GhostRunData | null {
    try {
      const key = `kudosu_ghost_${difficulty}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      return null;
    }
    return null;
  }

  static calculateGhostProgress(ghost: GhostRunData, elapsedMs: number): number {
    if (elapsedMs >= ghost.totalTimeMs) return 100;
    const movesCount = ghost.moves.filter(m => m.timestampMs <= elapsedMs).length;
    const totalMoves = ghost.moves.length || 81;
    return Math.min(100, Math.round((movesCount / totalMoves) * 100));
  }
}
