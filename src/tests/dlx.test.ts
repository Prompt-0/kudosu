import { describe, it, expect } from 'vitest';
import { DLXSolver } from '../engine/dlx/dlxSolver';

describe('Knuth Dancing Links (DLX) Solver', () => {
  it('solves a standard 9x9 Sudoku puzzle accurately', () => {
    // Easy classic puzzle
    const puzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];

    const result = DLXSolver.solveGrid(puzzle, 9, 3, 3, 'classic', undefined, undefined, 2);

    expect(result.solved).toBe(true);
    expect(result.solutionsCount).toBe(1);
    expect(result.grid[0][0]).toBe(5);
    expect(result.grid[0][2]).toBe(4);
    expect(result.grid[8][8]).toBe(9);

    // Verify row 1 contains 1..9
    const row0 = result.grid[0];
    const sorted = [...row0].sort((a, b) => a - b);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('solves hard benchmark puzzle (AI Escargot) correctly', () => {
    // Arto Inkala's AI Escargot
    const escargot = [
      [1, null, null, null, null, 7, null, 9, null],
      [null, 3, null, null, 2, null, null, null, 8],
      [null, null, 9, 6, null, null, 5, null, null],
      [null, null, 5, 3, null, null, 9, null, null],
      [null, 1, null, null, 8, null, null, null, 2],
      [6, null, null, null, null, 4, null, null, null],
      [3, null, null, null, null, null, null, 1, null],
      [null, 4, null, null, null, null, null, null, 7],
      [null, null, 7, null, null, null, 3, null, null],
    ];

    const start = performance.now();
    const result = DLXSolver.solveGrid(escargot, 9, 3, 3, 'classic', undefined, undefined, 1);
    const duration = performance.now() - start;

    expect(result.solved).toBe(true);
    expect(result.grid.length).toBe(9);
    expect(duration).toBeLessThan(100); // Sub-100ms
  });

  it('detects multiple solutions on ambiguous grids', () => {
    // Under-constrained grid with multiple valid completions
    const ambiguous = [
      [null, null, null, null, null, null, null, null, null],
      [null, 1, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ];

    const result = DLXSolver.solveGrid(ambiguous, 9, 3, 3, 'classic', undefined, undefined, 2);
    expect(result.solutionsCount).toBe(2);
  });

  it('solves Mini 4x4 puzzles accurately', () => {
    const mini4 = [
      [1, null, null, 4],
      [null, 4, 1, null],
      [null, 1, 4, null],
      [4, null, null, 1],
    ];

    const res4 = DLXSolver.solveGrid(mini4, 4, 2, 2, 'mini4', undefined, undefined, 1);
    expect(res4.solved).toBe(true);
    expect(res4.grid[0]).toEqual([1, 2, 3, 4]);
    expect(res4.grid[1]).toEqual([3, 4, 1, 2]);
  });
});
