import { BoardConfig, CellCoord } from '../types/sudoku';

export const samuraiConfig: BoardConfig = {
  variant: 'samurai',
  size: 9,
  boxWidth: 3,
  boxHeight: 3,
  samuraiGridsCount: 5,
};

// Map samurai local cell (gridIndex 0..4, r 0..8, c 0..8) to unified 21x21 global coordinate
export function samuraiToGlobalCoord(gridIndex: number, r: number, c: number): { x: number; y: number } {
  switch (gridIndex) {
    case 1: // Top-Left
      return { x: c, y: r };
    case 2: // Top-Right
      return { x: c + 12, y: r };
    case 0: // Center
      return { x: c + 6, y: r + 6 };
    case 3: // Bottom-Left
      return { x: c, y: r + 12 };
    case 4: // Bottom-Right
      return { x: c + 12, y: r + 12 };
    default:
      return { x: c, y: r };
  }
}

// Check if a cell in gridIndex is one of the shared 3x3 overlap boxes with the center grid
export function isSamuraiSharedCell(gridIndex: number, r: number, c: number): { isShared: boolean; centerCoord?: CellCoord } {
  if (gridIndex === 1 && r >= 6 && c >= 6) {
    // Top-Left shares with Center (0..2, 0..2)
    return { isShared: true, centerCoord: { row: r - 6, col: c - 6, gridIndex: 0 } };
  }
  if (gridIndex === 2 && r >= 6 && c <= 2) {
    // Top-Right shares with Center (0..2, 6..8)
    return { isShared: true, centerCoord: { row: r - 6, col: c + 6, gridIndex: 0 } };
  }
  if (gridIndex === 3 && r <= 2 && c >= 6) {
    // Bottom-Left shares with Center (6..8, 0..2)
    return { isShared: true, centerCoord: { row: r + 6, col: c - 6, gridIndex: 0 } };
  }
  if (gridIndex === 4 && r <= 2 && c <= 2) {
    // Bottom-Right shares with Center (6..8, 6..8)
    return { isShared: true, centerCoord: { row: r + 6, col: c + 6, gridIndex: 0 } };
  }
  if (gridIndex === 0) {
    if (r <= 2 && c <= 2) return { isShared: true, centerCoord: { row: r + 6, col: c + 6, gridIndex: 1 } };
    if (r <= 2 && c >= 6) return { isShared: true, centerCoord: { row: r + 6, col: c - 6, gridIndex: 2 } };
    if (r >= 6 && c <= 2) return { isShared: true, centerCoord: { row: r - 6, col: c + 6, gridIndex: 3 } };
    if (r >= 6 && c >= 6) return { isShared: true, centerCoord: { row: r - 6, col: c - 6, gridIndex: 4 } };
  }
  return { isShared: false };
}
