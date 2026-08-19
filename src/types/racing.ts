import { CellCoord } from './sudoku';

export interface SplitCheckpoint {
  timeMs: number;
  cellsRemaining: number;
  movesCount: number;
}

export interface GhostRunData {
  puzzleId: string;
  playerNickname: string;
  totalTimeMs: number;
  difficulty: string;
  moves: {
    timestampMs: number;
    cell: CellCoord;
    value: number | null;
  }[];
  splits: SplitCheckpoint[];
}

export interface AIRivalConfig {
  id: string;
  name: string;
  avatar: string;
  difficulty: 'novice' | 'club' | 'master' | 'grandmaster';
  movesPerMinute: number;
  errorChance: number; // e.g. 0.05
}
