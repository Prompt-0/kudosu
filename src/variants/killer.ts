import { BoardConfig, KillerCage, CellCoord } from '../types/sudoku';

export const killerConfig: BoardConfig = {
  variant: 'killer',
  size: 9,
  boxWidth: 3,
  boxHeight: 3,
};

export function getCageCombinations(
  targetSum: number,
  cageSize: number,
  excludedDigits: number[] = [],
  maxDigit: number = 9
): number[][] {
  const results: number[][] = [];
  const excludedSet = new Set(excludedDigits);

  function backtrack(start: number, currentSum: number, chosen: number[]) {
    if (chosen.length === cageSize) {
      if (currentSum === targetSum) {
        results.push([...chosen]);
      }
      return;
    }

    const remainingSlots = cageSize - chosen.length;
    let minPossible = 0;
    for (let i = 0; i < remainingSlots; i++) minPossible += start + i;
    if (currentSum + minPossible > targetSum) return;

    let maxPossible = 0;
    for (let i = 0; i < remainingSlots; i++) maxPossible += maxDigit - i;
    if (currentSum + maxPossible < targetSum) return;

    for (let d = start; d <= maxDigit; d++) {
      if (!excludedSet.has(d)) {
        chosen.push(d);
        backtrack(d + 1, currentSum + d, chosen);
        chosen.pop();
      }
    }
  }

  backtrack(1, 0, []);
  return results;
}

export function calculate45Rule(
  _cages: KillerCage[],
  _regionType: 'row' | 'col' | 'box',
  _regionIndex: number
): { innieCells: CellCoord[]; outieCells: CellCoord[]; cageSum: number; diff45: number } {
  const cageSum = 0;
  const innieCells: CellCoord[] = [];
  const outieCells: CellCoord[] = [];
  const diff45 = cageSum - 45;

  return { innieCells, outieCells, cageSum, diff45 };
}
