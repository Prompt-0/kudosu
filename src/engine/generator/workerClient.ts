import { PuzzleGenerator, SymmetryType } from './generator';
import { SudokuVariant, DifficultyLevel, PuzzleDefinition } from '../../types/sudoku';

export class GeneratorClient {
  private static worker: Worker | null = null;
  private static pendingRequests = new Map<string, { resolve: (p: PuzzleDefinition) => void; reject: (err: unknown) => void }>();

  private static getWorker(): Worker | null {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return null;
    }
    if (!this.worker) {
      try {
        this.worker = new Worker(new URL('./generator.worker.ts', import.meta.url), { type: 'module' });
        this.worker.onmessage = (e: MessageEvent) => {
          const { type, requestId, puzzle, error } = e.data;
          const handler = this.pendingRequests.get(requestId);
          if (handler) {
            this.pendingRequests.delete(requestId);
            if (type === 'SUCCESS') handler.resolve(puzzle);
            else handler.reject(new Error(error));
          }
        };
      } catch {
        this.worker = null;
      }
    }
    return this.worker;
  }

  static async generate(
    variant: SudokuVariant = 'classic',
    difficulty: DifficultyLevel = 'medium',
    symmetry: SymmetryType = 'rotational180'
  ): Promise<PuzzleDefinition> {
    const worker = this.getWorker();

    if (worker) {
      return new Promise<PuzzleDefinition>((resolve, reject) => {
        const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        this.pendingRequests.set(requestId, { resolve, reject });
        worker.postMessage({ variant, difficulty, symmetry, requestId });
      });
    }

    // Direct synchronous fallback
    return PuzzleGenerator.generatePuzzle(variant, difficulty, symmetry);
  }
}
