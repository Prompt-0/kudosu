import { DLXNode, DLXColumnNode } from './dlxNode';
import { SudokuVariant, KillerCage, JigsawRegion } from '../../types/sudoku';

export interface MatrixRowData {
  row: number;
  col: number;
  digit: number;
  gridIndex?: number;
}

export class DLXMatrix {
  header: DLXColumnNode;
  columns: DLXColumnNode[] = [];
  rowsData: MatrixRowData[] = [];

  constructor() {
    this.header = new DLXColumnNode('ROOT');
  }

  addColumn(name: string): DLXColumnNode {
    const col = new DLXColumnNode(name);
    col.left = this.header.left;
    col.right = this.header;
    this.header.left.right = col;
    this.header.left = col;
    this.columns.push(col);
    return col;
  }

  addRow(colIndices: number[], data: MatrixRowData): void {
    const rowIndex = this.rowsData.length;
    this.rowsData.push(data);

    let firstNode: DLXNode | null = null;

    for (const colIdx of colIndices) {
      const col = this.columns[colIdx];
      if (!col) continue;

      const node = new DLXNode(col, rowIndex);

      node.up = col.up;
      node.down = col;
      col.up.down = node;
      col.up = node;
      col.size++;

      if (!firstNode) {
        firstNode = node;
      } else {
        node.left = firstNode.left;
        node.right = firstNode;
        firstNode.left.right = node;
        firstNode.left = node;
      }
    }
  }

  static buildSudokuMatrix(
    size: number = 9,
    boxW: number = 3,
    boxH: number = 3,
    variant: SudokuVariant = 'classic',
    _cages?: KillerCage[],
    jigsawRegions?: JigsawRegion[]
  ): DLXMatrix {
    const matrix = new DLXMatrix();
    const N = size;

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        matrix.addColumn(`R${r}C${c}`);
      }
    }

    for (let r = 0; r < N; r++) {
      for (let d = 1; d <= N; d++) {
        matrix.addColumn(`R${r}#${d}`);
      }
    }

    for (let c = 0; c < N; c++) {
      for (let d = 1; d <= N; d++) {
        matrix.addColumn(`C${c}#${d}`);
      }
    }

    for (let b = 0; b < N; b++) {
      for (let d = 1; d <= N; d++) {
        matrix.addColumn(`B${b}#${d}`);
      }
    }

    let diag1Offset = -1;
    let diag2Offset = -1;
    if (variant === 'diagonal') {
      diag1Offset = matrix.columns.length;
      for (let d = 1; d <= N; d++) matrix.addColumn(`D1#${d}`);
      diag2Offset = matrix.columns.length;
      for (let d = 1; d <= N; d++) matrix.addColumn(`D2#${d}`);
    }

    let hyperOffset = -1;
    if (variant === 'hyper' && N === 9) {
      hyperOffset = matrix.columns.length;
      for (let w = 0; w < 4; w++) {
        for (let d = 1; d <= N; d++) matrix.addColumn(`W${w}#${d}`);
      }
    }

    const getBoxIndex = (r: number, c: number): number => {
      if (variant === 'jigsaw' && jigsawRegions && jigsawRegions.length > 0) {
        for (let i = 0; i < jigsawRegions.length; i++) {
          if (jigsawRegions[i].cells.some(cell => cell.row === r && cell.col === c)) {
            return i;
          }
        }
      }
      return Math.floor(r / boxH) * (N / boxW) + Math.floor(c / boxW);
    };

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const b = getBoxIndex(r, c);

        for (let d = 1; d <= N; d++) {
          const colIndices: number[] = [
            r * N + c,
            N * N + r * N + (d - 1),
            2 * N * N + c * N + (d - 1),
            3 * N * N + b * N + (d - 1),
          ];

          if (variant === 'diagonal') {
            if (r === c) colIndices.push(diag1Offset + (d - 1));
            if (r + c === N - 1) colIndices.push(diag2Offset + (d - 1));
          }

          if (variant === 'hyper' && hyperOffset >= 0) {
            let win = -1;
            if (r >= 1 && r <= 3 && c >= 1 && c <= 3) win = 0;
            else if (r >= 1 && r <= 3 && c >= 5 && c <= 7) win = 1;
            else if (r >= 5 && r <= 7 && c >= 1 && c <= 3) win = 2;
            else if (r >= 5 && r <= 7 && c >= 5 && c <= 7) win = 3;

            if (win >= 0) {
              colIndices.push(hyperOffset + win * N + (d - 1));
            }
          }

          matrix.addRow(colIndices, { row: r, col: c, digit: d });
        }
      }
    }

    return matrix;
  }
}
