import { BoardConfig, JigsawRegion } from '../types/sudoku';

export const jigsawConfig: BoardConfig = {
  variant: 'jigsaw',
  size: 9,
  boxWidth: 3,
  boxHeight: 3,
};

// Preset standard 9-polyomino irregular jigsaw region map
export const standardJigsawRegions: JigsawRegion[] = [
  { id: 0, cells: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }] },
  { id: 1, cells: [{ row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 }, { row: 0, col: 6 }, { row: 1, col: 3 }, { row: 1, col: 4 }, { row: 1, col: 5 }, { row: 1, col: 6 }, { row: 2, col: 3 }] },
  { id: 2, cells: [{ row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 7 }, { row: 1, col: 8 }, { row: 2, col: 7 }, { row: 2, col: 8 }, { row: 3, col: 6 }, { row: 3, col: 7 }, { row: 3, col: 8 }] },
  { id: 3, cells: [{ row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 }, { row: 4, col: 3 }, { row: 4, col: 4 }, { row: 4, col: 5 }] },
  { id: 4, cells: [{ row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 5, col: 0 }, { row: 5, col: 1 }, { row: 5, col: 2 }] },
  { id: 5, cells: [{ row: 4, col: 6 }, { row: 4, col: 7 }, { row: 4, col: 8 }, { row: 5, col: 6 }, { row: 5, col: 7 }, { row: 5, col: 8 }, { row: 6, col: 6 }, { row: 6, col: 7 }, { row: 6, col: 8 }] },
  { id: 6, cells: [{ row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }, { row: 6, col: 3 }, { row: 6, col: 4 }, { row: 6, col: 5 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }] },
  { id: 7, cells: [{ row: 6, col: 0 }, { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 7, col: 0 }, { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 2 }] },
  { id: 8, cells: [{ row: 7, col: 6 }, { row: 7, col: 7 }, { row: 7, col: 8 }, { row: 8, col: 3 }, { row: 8, col: 4 }, { row: 8, col: 5 }, { row: 8, col: 6 }, { row: 8, col: 7 }, { row: 8, col: 8 }] },
];
