import { CandidateGrid } from './candidateGrid';
import { DeductionProofStep, CandidateTarget, LaserLine } from '../../types/solver';
import { CellCoord } from '../../types/sudoku';

interface ConjugatePair {
  digit: number;
  cell1: CellCoord;
  cell2: CellCoord;
}

export function findSimpleColoring(grid: CandidateGrid): DeductionProofStep | null {
  for (let d = 1; d <= grid.size; d++) {
    // 1. Find all conjugate pairs for digit d
    const pairs: ConjugatePair[] = [];
    const units = grid.getAllUnits();

    for (const unit of units) {
      const emptyWithD = unit.cells.filter(
        c => (grid.values[c.row][c.col] === null || grid.values[c.row][c.col] === 0) &&
             grid.candidates[c.row][c.col].has(d)
      );
      if (emptyWithD.length === 2) {
        pairs.push({ digit: d, cell1: emptyWithD[0], cell2: emptyWithD[1] });
      }
    }

    if (pairs.length < 2) continue;

    // 2. Build adjacency graph
    const adj = new Map<string, string[]>();
    const nodeCoords = new Map<string, CellCoord>();

    const addEdge = (c1: CellCoord, c2: CellCoord) => {
      const k1 = `${c1.row},${c1.col}`;
      const k2 = `${c2.row},${c2.col}`;
      nodeCoords.set(k1, c1);
      nodeCoords.set(k2, c2);
      if (!adj.has(k1)) adj.set(k1, []);
      if (!adj.has(k2)) adj.set(k2, []);
      if (!adj.get(k1)!.includes(k2)) adj.get(k1)!.push(k2);
      if (!adj.get(k2)!.includes(k1)) adj.get(k2)!.push(k1);
    };

    for (const p of pairs) {
      addEdge(p.cell1, p.cell2);
    }

    // 3. 2-Color connected components
    const visited = new Map<string, number>(); // key -> 0 or 1

    for (const startKey of adj.keys()) {
      if (visited.has(startKey)) continue;

      const group0: CellCoord[] = [];
      const group1: CellCoord[] = [];
      const queue: { key: string; color: number }[] = [{ key: startKey, color: 0 }];
      visited.set(startKey, 0);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const currCoord = nodeCoords.get(curr.key)!;
        if (curr.color === 0) group0.push(currCoord);
        else group1.push(currCoord);

        for (const neighborKey of adj.get(curr.key) || []) {
          const nextColor = 1 - curr.color;
          if (!visited.has(neighborKey)) {
            visited.set(neighborKey, nextColor);
            queue.push({ key: neighborKey, color: nextColor });
          }
        }
      }

      if (group0.length < 2 && group1.length < 2) continue;

      // Color Trap: A cell outside the chain sees a cell in group 0 AND a cell in group 1
      const eliminations: CandidateTarget[] = [];
      for (let r = 0; r < grid.size; r++) {
        for (let c = 0; c < grid.size; c++) {
          const cell: CellCoord = { row: r, col: c };
          const k = `${r},${c}`;
          if (
            !visited.has(k) &&
            (grid.values[r][c] === null || grid.values[r][c] === 0) &&
            grid.candidates[r][c].has(d)
          ) {
            const seesGroup0 = group0.some(g => grid.cellsSeeEachOther(cell, g));
            const seesGroup1 = group1.some(g => grid.cellsSeeEachOther(cell, g));
            if (seesGroup0 && seesGroup1) {
              eliminations.push({ cell, digit: d });
            }
          }
        }
      }

      if (eliminations.length > 0) {
        const laserLines: LaserLine[] = [];
        for (const p of pairs) {
          const k1 = `${p.cell1.row},${p.cell1.col}`;
          const k2 = `${p.cell2.row},${p.cell2.col}`;
          if (visited.has(k1) && visited.has(k2)) {
            laserLines.push({ from: p.cell1, to: p.cell2, type: 'conjugate' });
          }
        }

        return {
          technique: 'Simple Coloring (Color Trap)',
          category: 'chains',
          difficultyScore: 800,
          nudgeMessage: `Follow the conjugate pairs of digit ${d} using alternating colors.`,
          techniqueTitle: `Simple Coloring on digit ${d}`,
          explanation: `A conjugate chain on digit ${d} divides candidate cells into two alternating color groups. Since one group must be true and the other false, any cell seeing both color groups can never be ${d}.`,
          primaryCells: [...group0, ...group1],
          secondaryCells: eliminations.map(e => e.cell),
          laserLines,
          highlightCandidates: [...group0, ...group1].map(cell => ({ cell, digit: d })),
          eliminations,
          placements: [],
        };
      }
    }
  }

  return null;
}
