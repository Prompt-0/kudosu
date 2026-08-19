export class ImagePreprocessor {
  static toGrayscale(imageData: ImageData): Uint8ClampedArray {
    const data = imageData.data;
    const gray = new Uint8ClampedArray(imageData.width * imageData.height);
    for (let i = 0; i < gray.length; i++) {
      const idx = i * 4;
      gray[i] = Math.round(0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]);
    }
    return gray;
  }

  static otsuThreshold(gray: Uint8ClampedArray): number {
    const hist = new Int32Array(256);
    for (let i = 0; i < gray.length; i++) {
      hist[gray[i]]++;
    }

    const total = gray.length;
    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * hist[t];

    let sumB = 0;
    let wB = 0;
    let maxVariance = 0;
    let threshold = 128;

    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (wB === 0) continue;
      const wF = total - wB;
      if (wF === 0) break;

      sumB += t * hist[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }
    return threshold;
  }

  static binarize(gray: Uint8ClampedArray, threshold: number): Uint8ClampedArray {
    const binary = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      binary[i] = gray[i] < threshold ? 255 : 0; // Black pixels on white paper become 255 (foreground)
    }
    return binary;
  }
}
