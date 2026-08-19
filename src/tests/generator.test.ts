import { describe, it, expect } from 'vitest';
import { PuzzleGenerator } from '../engine/generator/generator';
import { DLXSolver } from '../engine/dlx/dlxSolver';

describe('Procedural Puzzle Generator', () => {
  it('generates a valid full Latin square', () => {
    const fullGrid = PuzzleGenerator.generateRandomFullGrid(9, 3, 3, 'classic');
    expect(fullGrid).not.toBeNull();
    expect(fullGrid!.length).toBe(9);
    for (let r = 0; r < 9; r++) {
      const set = new Set(fullGrid![r]);
      expect(set.size).toBe(9); // All digits 1..9 present
    }
  });

  it('generates a classic Sudoku puzzle with guaranteed unique solution', () => {
    const puzzle = PuzzleGenerator.generatePuzzle('classic', 'easy', 'rotational180');
    expect(puzzle).toBeDefined();
    expect(puzzle.grid.length).toBe(9);

    // Verify with DLX that there is exactly 1 solution
    const check = DLXSolver.solveGrid(puzzle.grid, 9, 3, 3, 'classic', undefined, undefined, 2);
    expect(check.solved).toBe(true);
    expect(check.solutionsCount).toBe(1);
  });

  it('generates a Mini 4x4 puzzle with unique solution', () => {
    const puzzle = PuzzleGenerator.generatePuzzle('mini4', 'easy', 'rotational180');
    expect(puzzle.grid.length).toBe(4);

    const check = DLXSolver.solveGrid(puzzle.grid, 4, 2, 2, 'mini4', undefined, undefined, 2);
    expect(check.solved).toBe(true);
    expect(check.solutionsCount).toBe(1);
  });

  it('generates Killer Sudoku cages with non-empty sums', () => {
    const puzzle = PuzzleGenerator.generatePuzzle('killer', 'medium', 'rotational180');
    expect(puzzle.cages).toBeDefined();
    expect(puzzle.cages!.length).toBeGreaterThan(10);
    for (const cage of puzzle.cages!) {
      expect(cage.sum).toBeGreaterThan(0);
      expect(cage.cells.length).toBeGreaterThanOrEqual(1);
    }
  });
});
