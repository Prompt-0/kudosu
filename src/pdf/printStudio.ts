import { jsPDF } from 'jspdf';
import { PuzzleDefinition } from '../types/sudoku';

export interface PdfPrintOptions {
  puzzlesPerPage: 1 | 2 | 4;
  includeSolutions: boolean;
  paperSize: 'a4' | 'letter';
  title: string;
}

export class PdfPrintStudio {
  static generatePdf(puzzles: PuzzleDefinition[], options: PdfPrintOptions): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: options.paperSize,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Render Puzzles
    puzzles.forEach((puzzle, pIdx) => {
      if (pIdx > 0) doc.addPage();

      // Title Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(options.title || 'Kudosu Sudoku Collection', pageWidth / 2, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Puzzle #${pIdx + 1} — ${puzzle.variant.toUpperCase()} (${puzzle.difficulty.toUpperCase()})`, pageWidth / 2, 28, { align: 'center' });

      // Draw 9x9 Grid
      const gridSize = 140; // mm
      const startX = (pageWidth - gridSize) / 2;
      const startY = 40;
      const cellSize = gridSize / 9;

      doc.setDrawColor(0, 0, 0);

      // Cells
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const x = startX + c * cellSize;
          const y = startY + r * cellSize;

          doc.setLineWidth(0.2);
          doc.rect(x, y, cellSize, cellSize);

          const val = puzzle.grid[r]?.[c];
          if (val) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`${val}`, x + cellSize / 2, y + cellSize / 2 + 5, { align: 'center' });
          }
        }
      }

      // Thick 3x3 Box Borders
      doc.setLineWidth(1.2);
      for (let i = 0; i <= 3; i++) {
        const offset = i * cellSize * 3;
        doc.line(startX + offset, startY, startX + offset, startY + gridSize);
        doc.line(startX, startY + offset, startX + gridSize, startY + offset);
      }

      // Footer
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated with Kudosu — The Ultimate Sudoku Studio', pageWidth / 2, pageHeight - 12, { align: 'center' });
    });

    // Solutions Page
    if (options.includeSolutions) {
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Solutions Key', pageWidth / 2, 20, { align: 'center' });

      puzzles.forEach((puzzle, pIdx) => {
        if (!puzzle.solution) return;
        const miniSize = 60;
        const miniCell = miniSize / 9;
        const startX = 25 + (pIdx % 2) * 85;
        const startY = 35 + Math.floor(pIdx / 2) * 80;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`Solution #${pIdx + 1}`, startX + miniSize / 2, startY - 4, { align: 'center' });

        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            const x = startX + c * miniCell;
            const y = startY + r * miniCell;
            doc.setLineWidth(0.1);
            doc.rect(x, y, miniCell, miniCell);

            const val = puzzle.solution[r][c];
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`${val}`, x + miniCell / 2, y + miniCell / 2 + 2.5, { align: 'center' });
          }
        }

        // Thick box lines
        doc.setLineWidth(0.6);
        for (let i = 0; i <= 3; i++) {
          const off = i * miniCell * 3;
          doc.line(startX + off, startY, startX + off, startY + miniSize);
          doc.line(startX, startY + off, startX + miniSize, startY + off);
        }
      });
    }

    return doc.output('blob');
  }
}
