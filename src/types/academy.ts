import { PuzzleDefinition } from './sudoku';
import { DeductionProofStep } from './solver';

export interface AcademyLesson {
  id: string;
  chapterNumber: number;
  title: string;
  techniqueName: string;
  category: string;
  difficulty: string;
  difficultyRating: number;
  shortSummary: string;
  theoryMarkdown: string;
  interactiveExample: {
    initialGrid: (number | null)[][];
    initialCandidates: number[][][];
    proofStep: DeductionProofStep;
  };
  practicePuzzles: {
    id: string;
    title: string;
    description: string;
    puzzle: PuzzleDefinition;
    expectedAction: {
      type: 'eliminate' | 'place';
      targets: { row: number; col: number; digit: number }[];
    };
  }[];
}
