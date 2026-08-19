import { describe, it, expect } from 'vitest';
import { HumanSolver } from '../engine/human/humanSolver';
import { CandidateGrid } from '../engine/human/candidateGrid';
import { findNakedSingle, findHiddenSingle } from '../engine/human/singles';
import { findNakedSubsets } from '../engine/human/subsets';
import { findPointingSubsets } from '../engine/human/intersections';
import { findFish, findXYWing } from '../engine/human/wings';

describe('18-Technique Human Deductive Reasoning Engine', () => {
  it('detects Naked Single with clear proof breakdown', () => {
    // Cell (0,2) sees 1,2,3,5,6,7,8,9, leaving only 4
    const grid = [
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

    const cGrid = new CandidateGrid(grid);
    const step = findNakedSingle(cGrid);

    expect(step).not.toBeNull();
    expect(step?.technique).toBe('Naked Single');
    expect(step?.placements.length).toBe(1);
  });

  it('detects Hidden Single in row, column, or box', () => {
    const grid = [
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

    const cGrid = new CandidateGrid(grid);
    const step = findHiddenSingle(cGrid);

    expect(step).not.toBeNull();
    expect(step?.technique).toBe('Hidden Single');
    expect(step?.placements.length).toBe(1);
  });

  it('solves an easy puzzle end-to-end using purely human deduction steps', () => {
    const easyPuzzle = [
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

    const result = HumanSolver.solveEntireGame(easyPuzzle);
    expect(result.solved).toBe(true);
    expect(result.steps.length).toBeGreaterThan(20);
    expect(result.maxDifficultyScore).toBeLessThan(300); // Beginner / Easy
  });
});
