import { DLXSolver } from '../dlx/dlxSolver';
import { DifficultyRater } from '../human/difficultyRater';
import { SudokuVariant, DifficultyLevel, PuzzleDefinition, KillerCage, JigsawRegion, CellCoord } from '../../types/sudoku';
import { VARIANT_CONFIGS } from '../../variants/variantRegistry';

export type SymmetryType = 'rotational180' | 'rotational90' | 'horizontal' | 'vertical' | 'diagonal' | 'none';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class PuzzleGenerator {
  static generateRandomFullGrid(
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    cages?: KillerCage[],
    jigsawRegions?: JigsawRegion[]
  ): number[][] | null {
    // Seed initial row with random permutation 1..N
    const emptyGrid: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
    const firstRowDigits = shuffle(Array.from({ length: size }, (_, i) => i + 1));
    emptyGrid[0] = firstRowDigits;

    const res = DLXSolver.solveGrid(emptyGrid, size, boxW, boxH, variant, cages, jigsawRegions, 1);
    if (res.solved) return res.grid;
    return null;
  }

  static getSymmetricPairs(size: number, symmetry: SymmetryType = 'rotational180'): CellCoord[][] {
    const pairs: CellCoord[][] = [];
    const visited = new Set<string>();

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const k = `${r},${c}`;
        if (visited.has(k)) continue;

        let group: CellCoord[] = [{ row: r, col: c }];
        visited.add(k);

        if (symmetry === 'rotational180') {
          const symR = size - 1 - r;
          const symC = size - 1 - c;
          const symK = `${symR},${symC}`;
          if (!visited.has(symK)) {
            group.push({ row: symR, col: symC });
            visited.add(symK);
          }
        } else if (symmetry === 'horizontal') {
          const symR = size - 1 - r;
          const symK = `${symR},${c}`;
          if (!visited.has(symK)) {
            group.push({ row: symR, col: c });
            visited.add(symK);
          }
        } else if (symmetry === 'vertical') {
          const symC = size - 1 - c;
          const symK = `${r},${symC}`;
          if (!visited.has(symK)) {
            group.push({ row: r, col: symC });
            visited.add(symK);
          }
        } else if (symmetry === 'diagonal') {
          const symR = c;
          const symC = r;
          const symK = `${symR},${symC}`;
          if (!visited.has(symK)) {
            group.push({ row: symR, col: symC });
            visited.add(symK);
          }
        }

        pairs.push(group);
      }
    }

    return shuffle(pairs);
  }

  static generatePuzzle(
    variant: SudokuVariant = 'classic',
    targetDifficulty: DifficultyLevel = 'medium',
    symmetry: SymmetryType = 'rotational180',
    idPrefix: string = 'kudosu'
  ): PuzzleDefinition {
    const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.classic;
    const { size, boxWidth: boxW, boxHeight: boxH, jigsawRegions } = config;

    // 1. Generate filled full grid
    let fullGrid = this.generateRandomFullGrid(size, boxW, boxH, variant, undefined, jigsawRegions);
    if (!fullGrid) {
      // Fallback
      fullGrid = Array.from({ length: size }, () => Array.from({ length: size }, (_, c) => (c % size) + 1));
    }

    const puzzleGrid: (number | null)[][] = fullGrid.map(row => [...row]);
    const symmetricPairs = this.getSymmetricPairs(size, symmetry);

    // Target clue limits based on difficulty
    let minClues = 32;
    if (size === 9) {
      switch (targetDifficulty) {
        case 'beginner': minClues = 40; break;
        case 'easy': minClues = 36; break;
        case 'medium': minClues = 30; break;
        case 'hard': minClues = 26; break;
        case 'expert': minClues = 24; break;
        case 'master': minClues = 22; break;
        case 'grandmaster': minClues = 21; break;
      }
    } else if (size === 4) {
      minClues = 4;
    } else if (size === 6) {
      minClues = 12;
    } else if (size === 16) {
      minClues = 110;
    }

    let currentCluesCount = size * size;

    // 2. Dig clues symmetrically
    for (const group of symmetricPairs) {
      if (currentCluesCount <= minClues) break;

      // Temporarily remove digits
      const savedVals: { r: number; c: number; val: number | null }[] = [];
      for (const cell of group) {
        savedVals.push({ r: cell.row, c: cell.col, val: puzzleGrid[cell.row][cell.col] });
        puzzleGrid[cell.row][cell.col] = null;
      }

      // Check uniqueness with DLX
      const check = DLXSolver.solveGrid(puzzleGrid, size, boxW, boxH, variant, undefined, jigsawRegions, 2);
      if (check.solutionsCount === 1) {
        currentCluesCount -= group.length;
      } else {
        // Restore
        for (const s of savedVals) {
          puzzleGrid[s.r][s.c] = s.val;
        }
      }
    }

    // 3. Rate difficulty with Human Solver
    const rating = DifficultyRater.rateBoard(puzzleGrid, size, boxW, boxH, variant, jigsawRegions);

    // 4. Generate Cages if Killer Sudoku
    let killerCages: KillerCage[] | undefined = undefined;
    if (variant === 'killer' && fullGrid) {
      killerCages = this.generateKillerCages(fullGrid, size);
    }

    const puzzleId = `${idPrefix}-${variant}-${targetDifficulty}-${Date.now()}`;
    const capitalized = targetDifficulty.charAt(0).toUpperCase() + targetDifficulty.slice(1);

    return {
      id: puzzleId,
      title: `${capitalized} ${variant.toUpperCase()} Puzzle`,
      variant,
      difficulty: rating.level || targetDifficulty,
      difficultyScore: rating.score,
      grid: puzzleGrid,
      solution: fullGrid,
      cages: killerCages,
      jigsawRegions: config.jigsawRegions,
    };
  }

  static generateKillerCages(fullGrid: number[][], size: number = 9): KillerCage[] {
    const cages: KillerCage[] = [];
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    let cageIdCounter = 1;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (visited[r][c]) continue;

        const targetCageSize = Math.floor(Math.random() * 3) + 2; // 2 to 4 cells
        const cageCells: CellCoord[] = [{ row: r, col: c }];
        visited[r][c] = true;

        const candidates: CellCoord[] = [];
        const addNeighbors = (currR: number, currC: number) => {
          const dirs = [
            { r: currR - 1, c: currC },
            { r: currR + 1, c: currC },
            { r: currR, c: currC - 1 },
            { r: currR, c: currC + 1 },
          ];
          for (const d of dirs) {
            if (d.r >= 0 && d.r < size && d.c >= 0 && d.c < size && !visited[d.r][d.c]) {
              if (!candidates.some(cand => cand.row === d.r && cand.col === d.c)) {
                candidates.push({ row: d.r, col: d.c });
              }
            }
          }
        };

        addNeighbors(r, c);

        while (cageCells.length < targetCageSize && candidates.length > 0) {
          const nextIdx = Math.floor(Math.random() * candidates.length);
          const next = candidates.splice(nextIdx, 1)[0];

          if (!visited[next.row][next.col]) {
            // Check no duplicate digits in cage
            const currentDigits = cageCells.map(cell => fullGrid[cell.row][cell.col]);
            const nextDigit = fullGrid[next.row][next.col];

            if (!currentDigits.includes(nextDigit)) {
              visited[next.row][next.col] = true;
              cageCells.push(next);
              addNeighbors(next.row, next.col);
            }
          }
        }

        const sum = cageCells.reduce((acc, cell) => acc + fullGrid[cell.row][cell.col], 0);
        cages.push({
          id: `cage-${cageIdCounter++}`,
          sum,
          cells: cageCells,
        });
      }
    }

    return cages;
  }
}
