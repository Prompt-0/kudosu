import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep, CandidateTarget, LaserLine } from '../../types/solver';
import { CellCoord } from '../../types/sudoku';

function getCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const head = arr[0];
  const tail = arr.slice(1);
  const withHead = getCombinations(tail, k - 1).map(c => [head, ...c]);
  const withoutHead = getCombinations(tail, k);
  return [...withHead, ...withoutHead];
}

export function findFish(grid: CandidateGrid, fishSize: number): DeductionProofStep | null {
  const name = fishSize === 2 ? 'X-Wing' : fishSize === 3 ? 'Swordfish' : 'Jellyfish';
  const diffScore = fishSize === 2 ? 550 : fishSize === 3 ? 650 : 750;

  for (let d = 1; d <= grid.size; d++) {
    // 1. Row-based Fish
    const rowCandCols: { row: number; cols: number[] }[] = [];
    for (let r = 0; r < grid.size; r++) {
      const cols: number[] = [];
      for (let c = 0; c < grid.size; c++) {
        if ((grid.values[r][c] === null || grid.values[r][c] === 0) && grid.candidates[r][c].has(d)) {
          cols.push(c);
        }
      }
      if (cols.length >= 2 && cols.length <= fishSize) {
        rowCandCols.push({ row: r, cols });
      }
    }

    if (rowCandCols.length >= fishSize) {
      const rowCombos = getCombinations(rowCandCols, fishSize);
      for (const combo of rowCombos) {
        const unionCols = new Set<number>();
        for (const rData of combo) {
          for (const c of rData.cols) unionCols.add(c);
        }

        if (unionCols.size === fishSize) {
          const targetCols = Array.from(unionCols);
          const targetRows = combo.map(r => r.row);
          const eliminations: CandidateTarget[] = [];
          const primaryCells: CellCoord[] = [];

          for (const rData of combo) {
            for (const c of rData.cols) {
              primaryCells.push({ row: rData.row, col: c });
            }
          }

          for (const c of targetCols) {
            for (let r = 0; r < grid.size; r++) {
              if (!targetRows.includes(r) &&
                  (grid.values[r][c] === null || grid.values[r][c] === 0) &&
                  grid.candidates[r][c].has(d)) {
                eliminations.push({ cell: { row: r, col: c }, digit: d });
              }
            }
          }

          if (eliminations.length > 0) {
            const rowsStr = targetRows.map(r => `R${r + 1}`).join(', ');
            const colsStr = targetCols.map(c => `C${c + 1}`).join(', ');
            const laserLines: LaserLine[] = [];
            for (let i = 0; i < primaryCells.length; i++) {
              for (let j = i + 1; j < primaryCells.length; j++) {
                if (primaryCells[i].row === primaryCells[j].row || primaryCells[i].col === primaryCells[j].col) {
                  laserLines.push({ from: primaryCells[i], to: primaryCells[j], type: 'wing' });
                }
              }
            }

            return {
              technique: name,
              category: 'wings',
              difficultyScore: diffScore,
              nudgeMessage: `Search for candidate ${d} across ${rowsStr} and ${colsStr}.`,
              techniqueTitle: `${name} on digit ${d} in rows ${rowsStr}`,
              explanation: `In ${rowsStr}, digit ${d} is confined strictly to columns ${colsStr}. Because ${d} must appear in these rows, it cannot appear anywhere else in columns ${colsStr}.`,
              primaryCells,
              secondaryCells: eliminations.map(e => e.cell),
              laserLines,
              highlightCandidates: primaryCells.map(cell => ({ cell, digit: d })),
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

export function findXYWing(grid: CandidateGrid): DeductionProofStep | null {
  // Find all bivalue cells (cells with exactly 2 candidates)
  const bivalueCells: { cell: CellCoord; cands: number[] }[] = [];
  for (let r = 0; r < grid.size; r++) {
    for (let c = 0; c < grid.size; c++) {
      if (grid.values[r][c] === null || grid.values[r][c] === 0) {
        const cands = Array.from(grid.candidates[r][c]);
        if (cands.length === 2) {
          bivalueCells.push({ cell: { row: r, col: c }, cands });
        }
      }
    }
  }

  // Iterate over all potential pivots
  for (const pivot of bivalueCells) {
    const [A, B] = pivot.cands;
    const peers = bivalueCells.filter(b => grid.cellsSeeEachOther(pivot.cell, b.cell));

    // Find pincer 1 with candidates [A, C]
    const pincers1 = peers.filter(p => p.cands.includes(A) && !p.cands.includes(B));

    for (const p1 of pincers1) {
      const C = p1.cands.find(x => x !== A)!;

      // Find pincer 2 with candidates [B, C]
      const pincers2 = peers.filter(
        p => p.cell !== p1.cell && p.cands.includes(B) && p.cands.includes(C) && p.cands.length === 2
      );

      for (const p2 of pincers2) {
        // Find mutual peers of p1 and p2 that contain candidate C
        const eliminations: CandidateTarget[] = [];
        for (let r = 0; r < grid.size; r++) {
          for (let c = 0; c < grid.size; c++) {
            const target: CellCoord = { row: r, col: c };
            if (
              (target.row !== pivot.cell.row || target.col !== pivot.cell.col) &&
              (target.row !== p1.cell.row || target.col !== p1.cell.col) &&
              (target.row !== p2.cell.row || target.col !== p2.cell.col) &&
              (grid.values[r][c] === null || grid.values[r][c] === 0) &&
              grid.candidates[r][c].has(C) &&
              grid.cellsSeeEachOther(target, p1.cell) &&
              grid.cellsSeeEachOther(target, p2.cell)
            ) {
              eliminations.push({ cell: target, digit: C });
            }
          }
        }

        if (eliminations.length > 0) {
          const pStr = `R${pivot.cell.row + 1}C${pivot.cell.col + 1}`;
          const p1Str = `R${p1.cell.row + 1}C${p1.cell.col + 1}`;
          const p2Str = `R${p2.cell.row + 1}C${p2.cell.col + 1}`;

          return {
            technique: 'XY-Wing',
            category: 'wings',
            difficultyScore: 600,
            nudgeMessage: `Inspect the bivalue cells around ${pStr}, ${p1Str}, and ${p2Str}.`,
            techniqueTitle: `XY-Wing with pivot ${pStr} (${A},${B}) and pincers ${p1Str}, ${p2Str}`,
            explanation: `Pivot ${pStr} has candidates (${A},${B}). If it is ${A}, pincer ${p1Str} becomes ${C}. If it is ${B}, pincer ${p2Str} becomes ${C}. Either way, candidate ${C} is placed in one of the pincers, eliminating ${C} from any cell seeing both.`,
            primaryCells: [pivot.cell, p1.cell, p2.cell],
            secondaryCells: eliminations.map(e => e.cell),
            laserLines: [
              { from: pivot.cell, to: p1.cell, type: 'wing' },
              { from: pivot.cell, to: p2.cell, type: 'wing' },
            ],
            highlightCandidates: [
              { cell: pivot.cell, digit: A },
              { cell: pivot.cell, digit: B },
              { cell: p1.cell, digit: A },
              { cell: p1.cell, digit: C },
              { cell: p2.cell, digit: B },
              { cell: p2.cell, digit: C },
            ],
            eliminations,
            placements: [],
          };
        }
      }
    }
  }
  return null;
}
