import { PuzzleGenerator, SymmetryType } from './generator';
import { SudokuVariant, DifficultyLevel } from '../../types/sudoku';

self.onmessage = (e: MessageEvent) => {
  const { variant, difficulty, symmetry, requestId } = e.data as {
    variant: SudokuVariant;
    difficulty: DifficultyLevel;
    symmetry?: SymmetryType;
    requestId: string;
  };

  try {
    const puzzle = PuzzleGenerator.generatePuzzle(variant, difficulty, symmetry || 'rotational180');
    self.postMessage({ type: 'SUCCESS', requestId, puzzle });
  } catch (error) {
    self.postMessage({ type: 'ERROR', requestId, error: String(error) });
  }
};
