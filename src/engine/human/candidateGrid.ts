import { CellCoord, SudokuVariant, JigsawRegion } from '../../types/sudoku';

export class CandidateGrid {
  size: number;
  boxW: number;
  boxH: number;
  variant: SudokuVariant;
  jigsawRegions?: JigsawRegion[];
  values: (number | null)[][];
  candidates: Set<number>[][];

  constructor(
    grid: (number | null)[][],
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    jigsawRegions?: JigsawRegion[]
  ) {
    this.size = size;
    this.boxW = boxW;
    this.boxH = boxH;
    this.variant = variant;
    this.jigsawRegions = jigsawRegions;

    this.values = grid.map(row => [...row]);
    this.candidates = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => new Set<number>())
    );

    this.initCandidates();
  }

  initCandidates(): void {
    // Fill all empty cells with 1..size
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.values[r][c] === null || this.values[r][c] === 0) {
          for (let d = 1; d <= this.size; d++) {
            this.candidates[r][c].add(d);
          }
        }
      }
    }

    // Eliminate candidates seen by existing given/placed values
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.values[r][c];
        if (val !== null && val !== 0) {
          this.eliminatePeerCandidates(r, c, val);
        }
      }
    }
  }

  eliminatePeerCandidates(r: number, c: number, val: number): void {
    const peers = this.getPeers(r, c);
    for (const peer of peers) {
      this.candidates[peer.row][peer.col].delete(val);
    }
  }

  getPeers(r: number, c: number): CellCoord[] {
    const peersMap = new Map<string, CellCoord>();

    // Row peers
    for (let col = 0; col < this.size; col++) {
      if (col !== c) peersMap.set(`${r},${col}`, { row: r, col });
    }

    // Col peers
    for (let row = 0; row < this.size; row++) {
      if (row !== r) peersMap.set(`${row},${c}`, { row, col: c });
    }

    // Box peers
    const boxCells = this.getBoxCells(this.getBoxIndex(r, c));
    for (const cell of boxCells) {
      if (cell.row !== r || cell.col !== c) {
        peersMap.set(`${cell.row},${cell.col}`, cell);
      }
    }

    // Diagonal peers for X-Sudoku
    if (this.variant === 'diagonal') {
      if (r === c) {
        for (let i = 0; i < this.size; i++) {
          if (i !== r) peersMap.set(`${i},${i}`, { row: i, col: i });
        }
      }
      if (r + c === this.size - 1) {
        for (let i = 0; i < this.size; i++) {
          if (i !== r) peersMap.set(`${i},${this.size - 1 - i}`, { row: i, col: this.size - 1 - i });
        }
      }
    }

    return Array.from(peersMap.values());
  }

  getBoxIndex(r: number, c: number): number {
    if (this.variant === 'jigsaw' && this.jigsawRegions && this.jigsawRegions.length > 0) {
      for (let i = 0; i < this.jigsawRegions.length; i++) {
        if (this.jigsawRegions[i].cells.some(cell => cell.row === r && cell.col === c)) {
          return i;
        }
      }
    }
    return Math.floor(r / this.boxH) * (this.size / this.boxW) + Math.floor(c / this.boxW);
  }

  getBoxCells(boxIndex: number): CellCoord[] {
    if (this.variant === 'jigsaw' && this.jigsawRegions && this.jigsawRegions[boxIndex]) {
      return [...this.jigsawRegions[boxIndex].cells];
    }

    const boxesPerRow = this.size / this.boxW;
    const boxRow = Math.floor(boxIndex / boxesPerRow);
    const boxCol = boxIndex % boxesPerRow;

    const startRow = boxRow * this.boxH;
    const startCol = boxCol * this.boxW;

    const cells: CellCoord[] = [];
    for (let r = 0; r < this.boxH; r++) {
      for (let c = 0; c < this.boxW; c++) {
        cells.push({ row: startRow + r, col: startCol + c });
      }
    }
    return cells;
  }

  getRowCells(row: number): CellCoord[] {
    const cells: CellCoord[] = [];
    for (let c = 0; c < this.size; c++) cells.push({ row, col: c });
    return cells;
  }

  getColCells(col: number): CellCoord[] {
    const cells: CellCoord[] = [];
    for (let r = 0; r < this.size; r++) cells.push({ row: r, col });
    return cells;
  }

  getAllUnits(): { type: 'row' | 'col' | 'box'; index: number; cells: CellCoord[] }[] {
    const units: { type: 'row' | 'col' | 'box'; index: number; cells: CellCoord[] }[] = [];

    for (let r = 0; r < this.size; r++) {
      units.push({ type: 'row', index: r, cells: this.getRowCells(r) });
    }
    for (let c = 0; c < this.size; c++) {
      units.push({ type: 'col', index: c, cells: this.getColCells(c) });
    }
    for (let b = 0; b < this.size; b++) {
      units.push({ type: 'box', index: b, cells: this.getBoxCells(b) });
    }

    return units;
  }

  cellsSeeEachOther(c1: CellCoord, c2: CellCoord): boolean {
    if (c1.row === c2.row && c1.col === c2.col) return false;
    if (c1.row === c2.row) return true;
    if (c1.col === c2.col) return true;
    if (this.getBoxIndex(c1.row, c1.col) === this.getBoxIndex(c2.row, c2.col)) return true;
    if (this.variant === 'diagonal') {
      if (c1.row === c1.col && c2.row === c2.col) return true;
      if (c1.row + c1.col === this.size - 1 && c2.row + c2.col === this.size - 1) return true;
    }
    return false;
  }

  clone(): CandidateGrid {
    const next = new CandidateGrid(this.values, this.size, this.boxW, this.boxH, this.variant, this.jigsawRegions);
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        next.candidates[r][c] = new Set(this.candidates[r][c]);
      }
    }
    return next;
  }
}
