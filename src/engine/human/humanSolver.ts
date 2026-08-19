import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep } from '../../types/solver';
import { findNakedSingle, findHiddenSingle } from './singles';
import { findNakedSubsets, findHiddenSubsets } from './subsets';
import { findPointingSubsets, findClaimingSubsets } from './intersections';
import { findFish, findXYWing } from './wings';
import { findSimpleColoring } from './chains';
import { findUniqueRectangles } from './uniqueness';
import { SudokuVariant, JigsawRegion } from '../../types/sudoku';

export class HumanSolver {
  static getNextStep(
    gridValues: (number | null)[][],
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    jigsawRegions?: JigsawRegion[]
  ): DeductionProofStep | null {
    const grid = new CandidateGrid(gridValues, size, boxW, boxH, variant, jigsawRegions);

    // 1. Elementary Singles
    let step = findNakedSingle(grid);
    if (step) return step;

    step = findHiddenSingle(grid);
    if (step) return step;

    // 2. Direct Pairs
    step = findNakedSubsets(grid, 2);
    if (step) return step;

    step = findHiddenSubsets(grid, 2);
    if (step) return step;

    // 3. Line/Box Intersections
    step = findPointingSubsets(grid);
    if (step) return step;

    step = findClaimingSubsets(grid);
    if (step) return step;

    // 4. Triples
    step = findNakedSubsets(grid, 3);
    if (step) return step;

    step = findHiddenSubsets(grid, 3);
    if (step) return step;

    // 5. Wings and Fish
    step = findFish(grid, 2); // X-Wing
    if (step) return step;

    step = findXYWing(grid); // XY-Wing
    if (step) return step;

    step = findFish(grid, 3); // Swordfish
    if (step) return step;

    // 6. Quads & Jellyfish
    step = findNakedSubsets(grid, 4);
    if (step) return step;

    step = findHiddenSubsets(grid, 4);
    if (step) return step;

    step = findFish(grid, 4); // Jellyfish
    if (step) return step;

    // 7. Chains & Uniqueness
    step = findSimpleColoring(grid);
    if (step) return step;

    step = findUniqueRectangles(grid);
    if (step) return step;

    return null;
  }

  static solveEntireGame(
    gridValues: (number | null)[][],
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    jigsawRegions?: JigsawRegion[]
  ): { solved: boolean; steps: DeductionProofStep[]; maxDifficultyScore: number } {
    const grid = new CandidateGrid(gridValues, size, boxW, boxH, variant, jigsawRegions);
    const steps: DeductionProofStep[] = [];
    let maxDifficultyScore = 100;

    let iterations = 0;
    while (iterations < 200) {
      iterations++;

      // Check if completely solved
      let isFilled = true;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid.values[r][c] === null || grid.values[r][c] === 0) {
            isFilled = false;
            break;
          }
        }
        if (!isFilled) break;
      }

      if (isFilled) {
        return { solved: true, steps, maxDifficultyScore };
      }

      const step = HumanSolver.getNextStep(grid.values, size, boxW, boxH, variant, jigsawRegions);
      if (!step) {
        // Human techniques exhausted (requires brute force or higher order chains)
        return { solved: false, steps, maxDifficultyScore };
      }

      steps.push(step);
      if (step.difficultyScore > maxDifficultyScore) {
        maxDifficultyScore = step.difficultyScore;
      }

      // Apply step
      for (const elim of step.eliminations) {
        grid.candidates[elim.cell.row][elim.cell.col].delete(elim.digit);
      }
      for (const place of step.placements) {
        grid.values[place.cell.row][place.cell.col] = place.digit;
        grid.candidates[place.cell.row][place.cell.col].clear();
        grid.eliminatePeerCandidates(place.cell.row, place.cell.col, place.digit);
      }
    }

    return { solved: false, steps, maxDifficultyScore };
  }
}
