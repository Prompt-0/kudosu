import { BoardConfig } from '../types/sudoku';

export const hyperConfig: BoardConfig = {
  variant: 'hyper',
  size: 9,
  boxWidth: 3,
  boxHeight: 3,
};

export const hyperWindows = [
  { startRow: 1, endRow: 3, startCol: 1, endCol: 3 },
  { startRow: 1, endRow: 3, startCol: 5, endCol: 7 },
  { startRow: 5, endRow: 7, startCol: 1, endCol: 3 },
  { startRow: 5, endRow: 7, startCol: 5, endCol: 7 },
];

export function isHyperWindowCell(r: number, c: number): boolean {
  return hyperWindows.some(
    w => r >= w.startRow && r <= w.endRow && c >= w.startCol && c <= w.endCol
  );
}
