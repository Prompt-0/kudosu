import { BoardConfig } from '../types/sudoku';

export const sandwichConfig: BoardConfig = {
  variant: 'sandwich',
  size: 9,
  boxWidth: 3,
  boxHeight: 3,
};

export function calculateSandwichSum(line: number[]): number | null {
  const idx1 = line.indexOf(1);
  const idx9 = line.indexOf(9);
  if (idx1 === -1 || idx9 === -1) return null;

  const start = Math.min(idx1, idx9) + 1;
  const end = Math.max(idx1, idx9);

  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += line[i];
  }
  return sum;
}
