import { HumanSolver } from './humanSolver';
import { DifficultyLevel, SudokuVariant, JigsawRegion } from '../../types/sudoku';

export class DifficultyRater {
  static rateBoard(
    grid: (number | null)[][],
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    jigsawRegions?: JigsawRegion[]
  ): { level: DifficultyLevel; score: number; humanSolvable: boolean; totalSteps: number } {
    const res = HumanSolver.solveEntireGame(grid, size, boxW, boxH, variant, jigsawRegions);

    const score = res.maxDifficultyScore;
    let level: DifficultyLevel = 'beginner';

    if (score < 150) level = 'beginner';
    else if (score < 250) level = 'easy';
    else if (score < 400) level = 'medium';
    else if (score < 600) level = 'hard';
    else if (score < 750) level = 'expert';
    else if (score < 900) level = 'master';
    else level = 'grandmaster';

    return {
      level,
      score,
      humanSolvable: res.solved,
      totalSteps: res.steps.length,
    };
  }
}
