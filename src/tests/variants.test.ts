import { describe, it, expect } from 'vitest';
import { getCageCombinations } from '../variants/killer';
import { samuraiToGlobalCoord, isSamuraiSharedCell } from '../variants/samurai';
import { isHyperWindowCell } from '../variants/hyper';
import { calculateSandwichSum } from '../variants/sandwich';
import { digitToMonsterChar, monsterCharToDigit } from '../variants/monster';

describe('9-Variant Universe & Calculations', () => {
  it('calculates killer cage combinations with digit exclusions', () => {
    // 3-cell cage of sum 24 (only [7, 8, 9] in standard 9x9)
    const combos24 = getCageCombinations(24, 3);
    expect(combos24).toEqual([[7, 8, 9]]);

    // 2-cell cage of sum 4 ([1, 3])
    const combos4 = getCageCombinations(4, 2);
    expect(combos4).toEqual([[1, 3]]);

    // 2-cell cage of sum 4 with 1 excluded (should be empty)
    const combos4Excluded = getCageCombinations(4, 2, [1]);
    expect(combos4Excluded).toEqual([]);
  });

  it('translates Samurai 5-grid coordinates correctly', () => {
    const centerTL = samuraiToGlobalCoord(0, 0, 0);
    expect(centerTL).toEqual({ x: 6, y: 6 });

    const tlBottomRight = samuraiToGlobalCoord(1, 8, 8);
    expect(tlBottomRight).toEqual({ x: 8, y: 8 });

    // Check shared overlap
    const sharedCheck = isSamuraiSharedCell(1, 8, 8);
    expect(sharedCheck.isShared).toBe(true);
    expect(sharedCheck.centerCoord).toEqual({ row: 2, col: 2, gridIndex: 0 });
  });

  it('detects Hyper/Windoku window cells', () => {
    expect(isHyperWindowCell(1, 1)).toBe(true);
    expect(isHyperWindowCell(2, 2)).toBe(true);
    expect(isHyperWindowCell(3, 3)).toBe(true);
    expect(isHyperWindowCell(0, 0)).toBe(false);
    expect(isHyperWindowCell(4, 4)).toBe(false);
  });

  it('calculates Sandwich Sudoku perimeter sums between 1 and 9', () => {
    const line = [5, 1, 3, 4, 8, 9, 2, 6, 7];
    const sum = calculateSandwichSum(line);
    // between 1 (idx 1) and 9 (idx 5) are [3, 4, 8] -> sum = 15
    expect(sum).toBe(15);
  });

  it('converts Monster 16x16 hex digits and numbers', () => {
    expect(digitToMonsterChar(10)).toBe('A');
    expect(digitToMonsterChar(16)).toBe('G');
    expect(monsterCharToDigit('A')).toBe(10);
    expect(monsterCharToDigit('g')).toBe(16);
    expect(monsterCharToDigit('1')).toBe(1);
  });
});
