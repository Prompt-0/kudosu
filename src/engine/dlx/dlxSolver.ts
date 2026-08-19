import { DLXNode, DLXColumnNode } from './dlxNode';
import { DLXMatrix, MatrixRowData } from './dlxMatrix';
import { SudokuVariant, KillerCage, JigsawRegion } from '../../types/sudoku';

export class DLXSolver {
  matrix: DLXMatrix;
  solutions: MatrixRowData[][] = [];
  maxSolutions: number = 2;

  constructor(matrix: DLXMatrix) {
    this.matrix = matrix;
  }

  solve(maxSolutions: number = 1): MatrixRowData[][] {
    this.solutions = [];
    this.maxSolutions = maxSolutions;
    const currentSolution: DLXNode[] = [];
    this.search(currentSolution);
    return this.solutions;
  }

  private search(currentSolution: DLXNode[]): void {
    if (this.solutions.length >= this.maxSolutions) {
      return;
    }

    if (this.matrix.header.right === this.matrix.header) {
      // Found a solution!
      const sol: MatrixRowData[] = currentSolution.map(
        node => this.matrix.rowsData[node.rowIndex]
      );
      this.solutions.push(sol);
      return;
    }

    // Choose column with minimum size (heuristic for fast pruning)
    let bestCol: DLXColumnNode | null = null;
    let minSize = Infinity;

    let col = this.matrix.header.right as DLXColumnNode;
    while (col !== this.matrix.header) {
      if (col.size < minSize) {
        minSize = col.size;
        bestCol = col;
        if (minSize === 0) break; // Dead end branch
      }
      col = col.right as DLXColumnNode;
    }

    if (!bestCol || minSize === 0) {
      return;
    }

    bestCol.cover();

    let row = bestCol.down;
    while (row !== bestCol) {
      currentSolution.push(row);

      let node = row.right;
      while (node !== row) {
        node.column.cover();
        node = node.right;
      }

      this.search(currentSolution);

      // Backtrack
      currentSolution.pop();
      node = row.left;
      while (node !== row) {
        node.column.uncover();
        node = node.left;
      }

      if (this.solutions.length >= this.maxSolutions) {
        break;
      }

      row = row.down;
    }

    bestCol.uncover();
  }

  static solveGrid(
    grid: (number | null)[][],
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    cages?: KillerCage[],
    jigsawRegions?: JigsawRegion[],
    maxSolutions: number = 1
  ): { solved: boolean; grid: number[][]; solutionsCount: number } {
    const matrix = DLXMatrix.buildSudokuMatrix(size, boxW, boxH, variant, cages, jigsawRegions);

    // Pre-cover columns for given clues
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r]?.[c];
        if (val !== null && val !== undefined && val > 0) {
          // Find the node corresponding to (r, c, val)
          for (let i = 0; i < matrix.rowsData.length; i++) {
            const data = matrix.rowsData[i];
            if (data.row === r && data.col === c && data.digit === val) {
              // Find one node in this row and cover all its columns
              let targetCol: DLXColumnNode | null = null;
              for (const col of matrix.columns) {
                let curr = col.down;
                while (curr !== col) {
                  if (curr.rowIndex === i) {
                    targetCol = col;
                    break;
                  }
                  curr = curr.down;
                }
                if (targetCol) break;
              }

              if (targetCol) {
                // Find node in column
                let n = targetCol.down;
                while (n !== targetCol) {
                  if (n.rowIndex === i) {
                    targetCol.cover();
                    let right = n.right;
                    while (right !== n) {
                      right.column.cover();
                      right = right.right;
                    }
                    break;
                  }
                  n = n.down;
                }
              }
              break;
            }
          }
        }
      }
    }

    const solver = new DLXSolver(matrix);
    const rawSolutions = solver.solve(maxSolutions);

    if (rawSolutions.length === 0) {
      return { solved: false, grid: [], solutionsCount: 0 };
    }

    // Construct full solved grid
    const solvedGrid: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

    // Copy givens first
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r]?.[c];
        if (val) solvedGrid[r][c] = val;
      }
    }

    // Fill from DLX solution
    for (const item of rawSolutions[0]) {
      solvedGrid[item.row][item.col] = item.digit;
    }

    return {
      solved: true,
      grid: solvedGrid,
      solutionsCount: rawSolutions.length,
    };
  }
}
