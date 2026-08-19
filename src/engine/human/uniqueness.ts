import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep, CandidateTarget } from '../../types/solver';
import { CellCoord } from '../../types/sudoku';

export function findUniqueRectangles(grid: CandidateGrid): DeductionProofStep | null {
  // Search all 2x2 rectangles across pairs of rows and cols that share 2 boxes
  for (let r1 = 0; r1 < grid.size - 1; r1++) {
    for (let r2 = r1 + 1; r2 < grid.size; r2++) {
      for (let c1 = 0; c1 < grid.size - 1; c1++) {
        for (let c2 = c1 + 1; c2 < grid.size; c2++) {
          const cells: CellCoord[] = [
            { row: r1, col: c1 },
            { row: r1, col: c2 },
            { row: r2, col: c1 },
            { row: r2, col: c2 },
          ];

          // Check all 4 cells are empty
          if (cells.some(c => grid.values[c.row][c.col] !== null && grid.values[c.row][c.col] !== 0)) {
            continue;
          }

          // Check that they occupy exactly 2 boxes
          const boxes = new Set(cells.map(c => grid.getBoxIndex(c.row, c.col)));
          if (boxes.size !== 2) continue;

          // Find candidate pairs of size 2
          const cellCands = cells.map(c => Array.from(grid.candidates[c.row][c.col]));
          const bivalueIndices = cellCands
            .map((c, idx) => (c.length === 2 ? idx : -1))
            .filter(idx => idx !== -1);

          if (bivalueIndices.length === 3) {
            // Type 1 Unique Rectangle!
            const baseCands = cellCands[bivalueIndices[0]];
            const allMatch = bivalueIndices.every(idx => {
              const c = cellCands[idx];
              return c.length === 2 && c.includes(baseCands[0]) && c.includes(baseCands[1]);
            });

            if (allMatch) {
              const targetIdx = [0, 1, 2, 3].find(idx => !bivalueIndices.includes(idx))!;
              const targetCell = cells[targetIdx];
              const targetCandidates = cellCands[targetIdx];

              if (targetCandidates.includes(baseCands[0]) && targetCandidates.includes(baseCands[1])) {
                const eliminations: CandidateTarget[] = [
                  { cell: targetCell, digit: baseCands[0] },
                  { cell: targetCell, digit: baseCands[1] },
                ];

                const [A, B] = baseCands;
                const rStr = `R${targetCell.row + 1}C${targetCell.col + 1}`;
                const rectStr = cells.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');

                return {
                  technique: 'Unique Rectangle (Type 1)',
                  category: 'uniqueness',
                  difficultyScore: 850,
                  nudgeMessage: `Inspect the deadly pattern rectangle at ${rectStr}.`,
                  techniqueTitle: `Unique Rectangle Type 1 at ${rectStr} (${A}, ${B})`,
                  explanation: `Cells ${rectStr} form a 2x2 rectangle sharing two 3x3 boxes with candidates (${A}, ${B}). If ${rStr} contained only (${A}, ${B}), the puzzle would have multiple solutions (a deadly pattern). To avoid this, ${A} and ${B} can be eliminated from ${rStr}.`,
                  primaryCells: cells,
                  secondaryCells: [targetCell],
                  laserLines: [
                    { from: cells[0], to: cells[1], type: 'strong' },
                    { from: cells[1], to: cells[3], type: 'strong' },
                    { from: cells[3], to: cells[2], type: 'strong' },
                    { from: cells[2], to: cells[0], type: 'strong' },
                  ],
                  highlightCandidates: cells.flatMap(c =>
                    [A, B].filter(d => grid.candidates[c.row][c.col].has(d)).map(d => ({ cell: c, digit: d }))
                  ),
                  eliminations,
                  placements: [],
                };
              }
            }
          }
        }
      }
    }
  }
  return null;
}
