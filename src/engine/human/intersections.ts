import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep, CandidateTarget } from '../../types/solver';

export function findPointingSubsets(grid: CandidateGrid): DeductionProofStep | null {
  for (let b = 0; b < grid.size; b++) {
    const boxCells = grid.getBoxCells(b).filter(
      c => grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0
    );

    for (let d = 1; d <= grid.size; d++) {
      const matching = boxCells.filter(c => grid.candidates[c.row][c.col].has(d));
      if (matching.length >= 2 && matching.length <= 3) {
        // Check if all in same row
        const row = matching[0].row;
        if (matching.every(c => c.row === row)) {
          const eliminations: CandidateTarget[] = [];
          const rowCells = grid.getRowCells(row).filter(
            c => (grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0) &&
                 grid.getBoxIndex(c.row, c.col) !== b &&
                 grid.candidates[c.row][c.col].has(d)
          );

          for (const cell of rowCells) {
            eliminations.push({ cell, digit: d });
          }

          if (eliminations.length > 0) {
            const cellLabels = matching.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');
            return {
              technique: 'Pointing Pair/Triple',
              category: 'intersections',
              difficultyScore: 350,
              nudgeMessage: `In Box ${b + 1}, notice the alignment of candidate ${d}.`,
              techniqueTitle: `Pointing: Digit ${d} in Box ${b + 1} pointing to Row ${row + 1}`,
              explanation: `In Box ${b + 1}, digit ${d} can only appear in Row ${row + 1} (${cellLabels}). Since ${d} must be placed in one of these cells, it is locked into Row ${row + 1} and eliminated from the rest of Row ${row + 1}.`,
              primaryCells: matching,
              secondaryCells: eliminations.map(e => e.cell),
              highlightCandidates: matching.map(c => ({ cell: c, digit: d })),
              eliminations,
              placements: [],
            };
          }
        }

        // Check if all in same col
        const col = matching[0].col;
        if (matching.every(c => c.col === col)) {
          const eliminations: CandidateTarget[] = [];
          const colCells = grid.getColCells(col).filter(
            c => (grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0) &&
                 grid.getBoxIndex(c.row, c.col) !== b &&
                 grid.candidates[c.row][c.col].has(d)
          );

          for (const cell of colCells) {
            eliminations.push({ cell, digit: d });
          }

          if (eliminations.length > 0) {
            const cellLabels = matching.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');
            return {
              technique: 'Pointing Pair/Triple',
              category: 'intersections',
              difficultyScore: 350,
              nudgeMessage: `In Box ${b + 1}, notice the alignment of candidate ${d}.`,
              techniqueTitle: `Pointing: Digit ${d} in Box ${b + 1} pointing to Column ${col + 1}`,
              explanation: `In Box ${b + 1}, digit ${d} can only appear in Column ${col + 1} (${cellLabels}). Therefore, ${d} is locked into Column ${col + 1} and eliminated from the rest of Column ${col + 1}.`,
              primaryCells: matching,
              secondaryCells: eliminations.map(e => e.cell),
              highlightCandidates: matching.map(c => ({ cell: c, digit: d })),
              eliminations,
              placements: [],
            };
          }
        }
      }
    }
  }
  return null;
}

export function findClaimingSubsets(grid: CandidateGrid): DeductionProofStep | null {
  for (let r = 0; r < grid.size; r++) {
    const rowCells = grid.getRowCells(r).filter(
      c => grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0
    );

    for (let d = 1; d <= grid.size; d++) {
      const matching = rowCells.filter(c => grid.candidates[c.row][c.col].has(d));
      if (matching.length >= 2 && matching.length <= 3) {
        const box = grid.getBoxIndex(matching[0].row, matching[0].col);
        if (matching.every(c => grid.getBoxIndex(c.row, c.col) === box)) {
          const eliminations: CandidateTarget[] = [];
          const boxCells = grid.getBoxCells(box).filter(
            c => (grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0) &&
                 c.row !== r &&
                 grid.candidates[c.row][c.col].has(d)
          );

          for (const cell of boxCells) {
            eliminations.push({ cell, digit: d });
          }

          if (eliminations.length > 0) {
            const cellLabels = matching.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');
            return {
              technique: 'Claiming Pair/Triple',
              category: 'intersections',
              difficultyScore: 350,
              nudgeMessage: `In Row ${r + 1}, look at where candidate ${d} is confined.`,
              techniqueTitle: `Claiming: Digit ${d} in Row ${r + 1} claims Box ${box + 1}`,
              explanation: `In Row ${r + 1}, digit ${d} can only appear in Box ${box + 1} (${cellLabels}). Therefore, ${d} in Box ${box + 1} must be in Row ${r + 1}, eliminating it from the rest of Box ${box + 1}.`,
              primaryCells: matching,
              secondaryCells: eliminations.map(e => e.cell),
              highlightCandidates: matching.map(c => ({ cell: c, digit: d })),
              eliminations,
              placements: [],
            };
          }
        }
      }
    }
  }

  for (let c = 0; c < grid.size; c++) {
    const colCells = grid.getColCells(c).filter(
      cell => grid.values[cell.row][cell.col] === null || grid.values[cell.row][cell.col] === 0
    );

    for (let d = 1; d <= grid.size; d++) {
      const matching = colCells.filter(cell => grid.candidates[cell.row][cell.col].has(d));
      if (matching.length >= 2 && matching.length <= 3) {
        const box = grid.getBoxIndex(matching[0].row, matching[0].col);
        if (matching.every(cell => grid.getBoxIndex(cell.row, cell.col) === box)) {
          const eliminations: CandidateTarget[] = [];
          const boxCells = grid.getBoxCells(box).filter(
            cell => (grid.values[cell.row][cell.col] === null || grid.values[cell.row][cell.col] === 0) &&
                    cell.col !== c &&
                    grid.candidates[cell.row][cell.col].has(d)
          );

          for (const cell of boxCells) {
            eliminations.push({ cell, digit: d });
          }

          if (eliminations.length > 0) {
            const cellLabels = matching.map(cell => `R${cell.row + 1}C${cell.col + 1}`).join(', ');
            return {
              technique: 'Claiming Pair/Triple',
              category: 'intersections',
              difficultyScore: 350,
              nudgeMessage: `In Column ${c + 1}, look at where candidate ${d} is confined.`,
              techniqueTitle: `Claiming: Digit ${d} in Column ${c + 1} claims Box ${box + 1}`,
              explanation: `In Column ${c + 1}, digit ${d} can only appear in Box ${box + 1} (${cellLabels}). Therefore, ${d} is locked into Column ${c + 1} inside Box ${box + 1} and eliminated from other columns in this box.`,
              primaryCells: matching,
              secondaryCells: eliminations.map(e => e.cell),
              highlightCandidates: matching.map(cell => ({ cell, digit: d })),
              eliminations,
              placements: [],
            };
          }
        }
      }
    }
  }

  return null;
}
