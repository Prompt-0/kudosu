import { CellCoord } from './sudoku';

export type TechniqueCategory =
  | 'singles'
  | 'subsets'
  | 'intersections'
  | 'wings'
  | 'chains'
  | 'uniqueness'
  | 'forcing';

export interface LaserLine {
  from: CellCoord;
  to: CellCoord;
  type: 'strong' | 'weak' | 'wing' | 'conjugate';
  color?: string;
}

export interface CandidateTarget {
  cell: CellCoord;
  digit: number;
}

export interface DeductionProofStep {
  technique: string;
  category: TechniqueCategory;
  difficultyScore: number;
  nudgeMessage: string;
  techniqueTitle: string;
  explanation: string;
  primaryCells: CellCoord[];
  secondaryCells?: CellCoord[];
  laserLines?: LaserLine[];
  highlightCandidates: CandidateTarget[];
  eliminations: CandidateTarget[];
  placements: { cell: CellCoord; digit: number }[];
}

export interface SolveResult {
  solved: boolean;
  grid: number[][];
  steps?: DeductionProofStep[];
  solutionsCount: number;
  timeMs: number;
}
