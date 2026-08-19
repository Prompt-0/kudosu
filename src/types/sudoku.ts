export type SudokuVariant =
  | 'classic'
  | 'killer'
  | 'samurai'
  | 'jigsaw'
  | 'diagonal'
  | 'hyper'
  | 'sandwich'
  | 'mini4'
  | 'mini6'
  | 'monster16';

export type DifficultyLevel =
  | 'beginner'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'expert'
  | 'master'
  | 'grandmaster';

export type InputMode = 'normal' | 'corner' | 'center' | 'color';

export type AssistanceMode = 'zen' | 'arcade' | 'speedrun';

export type GameStatus = 'ready' | 'playing' | 'paused' | 'completed';

export interface CellCoord {
  row: number;
  col: number;
  gridIndex?: number; // For multi-grid variants like Samurai (0=Center, 1=TL, 2=TR, 3=BL, 4=BR)
}

export interface KillerCage {
  id: string;
  sum: number;
  cells: CellCoord[];
  color?: string;
}

export interface JigsawRegion {
  id: number;
  cells: CellCoord[];
  color?: string;
}

export interface SandwichClues {
  rowClues: (number | null)[];
  colClues: (number | null)[];
}

export interface CellState {
  row: number;
  col: number;
  gridIndex: number;
  value: number | null;
  given: boolean;
  cornerMarks: number[];
  centerMarks: number[];
  color: number | null; // 1-8 palette index
  isError?: boolean;
  isHintHighlight?: boolean;
  isLaserHighlight?: boolean;
  isSameDigitHighlight?: boolean;
  isSelected?: boolean;
  isInSelectedUnit?: boolean;
}

export interface BoardConfig {
  variant: SudokuVariant;
  size: number; // e.g. 9 for classic, 4 for mini4, 6 for mini6, 16 for monster16
  boxWidth: number; // e.g. 3 for classic, 2 for mini4, 3 for mini6, 4 for monster16
  boxHeight: number; // e.g. 3 for classic, 2 for mini4, 2 for mini6, 4 for monster16
  cages?: KillerCage[];
  jigsawRegions?: JigsawRegion[];
  sandwichClues?: SandwichClues[];
  samuraiGridsCount?: number; // 5
}

export interface PuzzleDefinition {
  id: string;
  title: string;
  variant: SudokuVariant;
  difficulty: DifficultyLevel;
  difficultyScore: number;
  grid: (number | null)[][];
  solution?: number[][];
  cages?: KillerCage[];
  jigsawRegions?: JigsawRegion[];
  sandwichClues?: SandwichClues[];
  date?: string; // YYYY-MM-DD for daily
  author?: string;
}

export interface MoveAction {
  type: 'setValue' | 'toggleCorner' | 'toggleCenter' | 'setColor' | 'clearCell' | 'batchCandidates' | 'applyStep';
  cells: CellCoord[];
  prevValues: { cell: CellCoord; value: number | null; cornerMarks: number[]; centerMarks: number[]; color: number | null }[];
  newValues: { cell: CellCoord; value: number | null; cornerMarks: number[]; centerMarks: number[]; color: number | null }[];
  timestamp: number;
}
