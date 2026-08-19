import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep, CandidateTarget } from '../../types/solver';
import { CellCoord } from '../../types/sudoku';

// Helper to generate combinations
function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const head = arr[0];
  const tail = arr.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

export function findNakedSubsets(grid: CandidateGrid, size: number): DeductionProofStep | null {
  const units = grid.getAllUnits();
  const subsetName = size === 2 ? 'Naked Pair' : size === 3 ? 'Naked Triple' : 'Naked Quad';
  const diffScore = size === 2 ? 250 : size === 3 ? 350 : 450;

  for (const unit of units) {
    const emptyCells = unit.cells.filter(
      c => grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0
    );
    if (emptyCells.length <= size) continue;

    const cellCombos = getCombinations(emptyCells, size);
    for (const combo of cellCombos) {
      const unionCandidates = new Set<number>();
      for (const cell of combo) {
        for (const cand of grid.candidates[cell.row][cell.col]) {
          unionCandidates.add(cand);
        }
      }

      if (unionCandidates.size === size) {
        // We found a naked subset! Check if it eliminates any candidates from other cells in unit
        const candsArray = Array.from(unionCandidates);
        const eliminations: CandidateTarget[] = [];

        for (const otherCell of emptyCells) {
          if (!combo.some(c => c.row === otherCell.row && c.col === otherCell.col)) {
            for (const cand of candsArray) {
              if (grid.candidates[otherCell.row][otherCell.col].has(cand)) {
                eliminations.push({ cell: otherCell, digit: cand });
              }
            }
          }
        }

        if (eliminations.length > 0) {
          const unitName = unit.type === 'row' ? `Row ${unit.index + 1}` :
                           unit.type === 'col' ? `Column ${unit.index + 1}` :
                           `Box ${unit.index + 1}`;
          const cellLabels = combo.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');
          const digitsStr = candsArray.sort((a, b) => a - b).join(', ');

          return {
            technique: subsetName,
            category: 'subsets',
            difficultyScore: diffScore,
            nudgeMessage: `Check the remaining candidate notes in ${unitName} across ${cellLabels}.`,
            techniqueTitle: `${subsetName}: Digits [${digitsStr}] in ${unitName}`,
            explanation: `Cells ${cellLabels} in ${unitName} contain only the digits [${digitsStr}]. Since these ${size} digits must occupy these ${size} cells, they can be eliminated from all other cells in ${unitName}.`,
            primaryCells: combo,
            secondaryCells: eliminations.map(e => e.cell),
            highlightCandidates: combo.flatMap(c =>
              Array.from(grid.candidates[c.row][c.col]).map(d => ({ cell: c, digit: d }))
            ),
            eliminations,
            placements: [],
          };
        }
      }
    }
  }
  return null;
}

export function findHiddenSubsets(grid: CandidateGrid, size: number): DeductionProofStep | null {
  const units = grid.getAllUnits();
  const subsetName = size === 2 ? 'Hidden Pair' : size === 3 ? 'Hidden Triple' : 'Hidden Quad';
  const diffScore = size === 2 ? 300 : size === 3 ? 400 : 500;

  for (const unit of units) {
    const emptyCells = unit.cells.filter(
      c => grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0
    );
    if (emptyCells.length <= size) continue;

    // Collect digits that appear in 2..size cells
    const digitOccurrences = new Map<number, CellCoord[]>();
    for (let d = 1; d <= grid.size; d++) {
      const cellsWithD = emptyCells.filter(c => grid.candidates[c.row][c.col].has(d));
      if (cellsWithD.length >= 2 && cellsWithD.length <= size) {
        digitOccurrences.set(d, cellsWithD);
      }
    }

    const availableDigits = Array.from(digitOccurrences.keys());
    if (availableDigits.length < size) continue;

    const digitCombos = getCombinations(availableDigits, size);
    for (const comboDigits of digitCombos) {
      const combinedCellsMap = new Map<string, CellCoord>();
      for (const d of comboDigits) {
        for (const cell of digitOccurrences.get(d)!) {
          combinedCellsMap.set(`${cell.row},${cell.col}`, cell);
        }
      }

      if (combinedCellsMap.size === size) {
        // Found hidden subset!
        const comboCells = Array.from(combinedCellsMap.values());
        const eliminations: CandidateTarget[] = [];

        for (const cell of comboCells) {
          for (const cand of grid.candidates[cell.row][cell.col]) {
            if (!comboDigits.includes(cand)) {
              eliminations.push({ cell, digit: cand });
            }
          }
        }

        if (eliminations.length > 0) {
          const unitName = unit.type === 'row' ? `Row ${unit.index + 1}` :
                           unit.type === 'col' ? `Column ${unit.index + 1}` :
                           `Box ${unit.index + 1}`;
          const cellLabels = comboCells.map(c => `R${c.row + 1}C${c.col + 1}`).join(', ');
          const digitsStr = comboDigits.sort((a, b) => a - b).join(', ');

          return {
            technique: subsetName,
            category: 'subsets',
            difficultyScore: diffScore,
            nudgeMessage: `In ${unitName}, see which cells can contain the digits [${digitsStr}].`,
            techniqueTitle: `${subsetName}: Digits [${digitsStr}] in ${unitName}`,
            explanation: `In ${unitName}, digits [${digitsStr}] are confined strictly to cells ${cellLabels}. Therefore, all other candidates in these ${size} cells can be eliminated.`,
            primaryCells: comboCells,
            highlightCandidates: comboCells.flatMap(c =>
              comboDigits.filter(d => grid.candidates[c.row][c.col].has(d)).map(d => ({ cell: c, digit: d }))
            ),
            eliminations,
            placements: [],
          };
        }
      }
    }
  }
  return null;
}
