import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep } from '../../types/solver';

export function findNakedSingle(grid: CandidateGrid): DeductionProofStep | null {
  for (let r = 0; r < grid.size; r++) {
    for (let c = 0; c < grid.size; c++) {
      if (grid.values[r][c] === null || grid.values[r][c] === 0) {
        const cands = Array.from(grid.candidates[r][c]);
        if (cands.length === 1) {
          const digit = cands[0];
          return {
            technique: 'Naked Single',
            category: 'singles',
            difficultyScore: 100,
            nudgeMessage: `Look closely at Row ${r + 1}, Column ${c + 1}. What digits are already in its row, column, and box?`,
            techniqueTitle: `Naked Single: Digit ${digit} at R${r + 1}C${c + 1}`,
            explanation: `All other digits (1-${grid.size}) are already placed in Row ${r + 1}, Column ${c + 1}, or its 3x3 box. Therefore, cell R${r + 1}C${c + 1} must be ${digit}.`,
            primaryCells: [{ row: r, col: c }],
            highlightCandidates: [{ cell: { row: r, col: c }, digit }],
            eliminations: [],
            placements: [{ cell: { row: r, col: c }, digit }],
          };
        }
      }
    }
  }
  return null;
}

export function findHiddenSingle(grid: CandidateGrid): DeductionProofStep | null {
  const units = grid.getAllUnits();

  for (const unit of units) {
    for (let d = 1; d <= grid.size; d++) {
      const matchingCells = unit.cells.filter(
        cell => (grid.values[cell.row][cell.col] === null || grid.values[cell.row][cell.col] === 0) &&
                grid.candidates[cell.row][cell.col].has(d)
      );

      if (matchingCells.length === 1) {
        const cell = matchingCells[0];
        const unitName = unit.type === 'row' ? `Row ${unit.index + 1}` :
                         unit.type === 'col' ? `Column ${unit.index + 1}` :
                         `Box ${unit.index + 1}`;

        // Eliminations in this cell (other candidates in this cell are eliminated)
        const elims = Array.from(grid.candidates[cell.row][cell.col])
          .filter(cand => cand !== d)
          .map(cand => ({ cell, digit: cand }));

        return {
          technique: 'Hidden Single',
          category: 'singles',
          difficultyScore: 150,
          nudgeMessage: `Inspect ${unitName}. Where can the digit ${d} possibly go?`,
          techniqueTitle: `Hidden Single: Digit ${d} in ${unitName}`,
          explanation: `In ${unitName}, digit ${d} can only appear in cell R${cell.row + 1}C${cell.col + 1}. No other cell in this unit can hold a ${d}.`,
          primaryCells: [cell],
          secondaryCells: unit.cells.filter(c => c.row !== cell.row || c.col !== cell.col),
          highlightCandidates: [{ cell, digit: d }],
          eliminations: elims,
          placements: [{ cell, digit: d }],
        };
      }
    }
  }
  return null;
}
