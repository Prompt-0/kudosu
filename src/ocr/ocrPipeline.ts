import { ImagePreprocessor } from './preprocessor';
import { DigitOcr } from './digitOcr';

export class OcrPipeline {
  static processCanvas(canvas: HTMLCanvasElement): (number | null)[][] {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return Array.from({ length: 9 }, () => Array(9).fill(null));

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);

    const gray = ImagePreprocessor.toGrayscale(imgData);
    const threshold = ImagePreprocessor.otsuThreshold(gray);
    const binary = ImagePreprocessor.binarize(gray, threshold);

    const cellW = Math.floor(width / 9);
    const cellH = Math.floor(height / 9);

    const grid: (number | null)[][] = [];

    for (let r = 0; r < 9; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < 9; c++) {
        // Extract cell binary slice
        const cellBinary = new Uint8ClampedArray(cellW * cellH);
        for (let y = 0; y < cellH; y++) {
          for (let x = 0; x < cellW; x++) {
            const srcIdx = (r * cellH + y) * width + (c * cellW + x);
            cellBinary[y * cellW + x] = binary[srcIdx] || 0;
          }
        }

        const digit = DigitOcr.classifyCell(cellBinary, cellW, cellH);
        row.push(digit);
      }
      grid.push(row);
    }

    return grid;
  }
}
