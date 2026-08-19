import React, { useState, useRef, useEffect } from 'react';
import { OcrPipeline } from '../../ocr/ocrPipeline';
import { DLXSolver } from '../../engine/dlx/dlxSolver';
import { Camera, Upload, CheckCircle2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { PuzzleDefinition } from '../../types/sudoku';

interface OcrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPuzzle: (puzzle: PuzzleDefinition) => void;
}

export const OcrScannerModal: React.FC<OcrScannerModalProps> = ({
  isOpen,
  onClose,
  onImportPuzzle,
}) => {
  const [extractedGrid, setExtractedGrid] = useState<(number | null)[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(null))
  );
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uniquenessStatus, setUniquenessStatus] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // Validate uniqueness whenever extractedGrid changes
    const check = DLXSolver.solveGrid(extractedGrid, 9, 3, 3, 'classic', undefined, undefined, 2);
    if (check.solutionsCount === 1) {
      setUniquenessStatus('Unique Valid Solution Found! (Ready to Play)');
    } else if (check.solutionsCount > 1) {
      setUniquenessStatus('Multiple completions possible. You can add more given clues.');
    } else {
      setUniquenessStatus('Invalid or conflicting clues. Please correct duplicates.');
    }
  }, [extractedGrid]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processImageSrc(src);
    };
    reader.readAsDataURL(file);
  };

  const processImageSrc = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 450;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 450, 450);
        const grid = OcrPipeline.processCanvas(canvas);
        setExtractedGrid(grid);
      }
      setIsProcessing(false);
    };
    img.src = src;
  };

  const handleCellChange = (r: number, c: number, val: string) => {
    const num = parseInt(val, 10);
    const next = extractedGrid.map(row => [...row]);
    next[r][c] = !isNaN(num) && num >= 1 && num <= 9 ? num : null;
    setExtractedGrid(next);
  };

  const handleStartGame = () => {
    const check = DLXSolver.solveGrid(extractedGrid, 9, 3, 3, 'classic', undefined, undefined, 1);
    const puzzle: PuzzleDefinition = {
      id: `imported-ocr-${Date.now()}`,
      title: 'Scanned Camera Puzzle',
      variant: 'classic',
      difficulty: 'medium',
      difficultyScore: 300,
      grid: extractedGrid,
      solution: check.solved ? check.grid : undefined,
    };
    onImportPuzzle(puzzle);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Camera & Image Sudoku Scanner</h3>
              <p className="text-xs text-slate-400">100% Client-Side Computer Vision OCR</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Capture options */}
        <div className="flex gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload Newspaper / Book Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Side-by-Side Inspection & Correction Grid */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
          {imageSrc && (
            <div className="flex flex-col items-center gap-1.5 max-w-[200px]">
              <span className="text-[11px] font-bold text-slate-400">Uploaded Image Preview:</span>
              <img src={imageSrc} alt="Source" className="w-44 h-44 object-contain rounded-lg border border-slate-800" />
            </div>
          )}

          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-cyan-400">Extracted Grid (Click to edit):</span>
            <div className="grid grid-cols-9 gap-[1px] bg-slate-800 p-1 rounded-xl border border-slate-700 w-64 h-64">
              {extractedGrid.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`${r}-${c}`}
                    type="text"
                    maxLength={1}
                    value={val !== null ? val : ''}
                    onChange={e => handleCellChange(r, c, e.target.value)}
                    className="w-full h-full text-center bg-slate-900 font-bold text-sm text-cyan-300 focus:bg-cyan-950 focus:outline-none rounded-[2px]"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Uniqueness Status */}
        {uniquenessStatus && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="text-slate-300">{uniquenessStatus}</span>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleStartGame}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Load & Solve in Kudosu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
