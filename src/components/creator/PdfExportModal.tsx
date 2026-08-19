import React, { useState } from 'react';
import { PdfPrintStudio } from '../../pdf/printStudio';
import { useGameStore } from '../../store/gameStore';
import { Printer, Download, X, CheckCircle2 } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({ isOpen, onClose }) => {
  const { puzzle } = useGameStore();
  const [includeSolutions, setIncludeSolutions] = useState(true);
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>('a4');
  const [title, setTitle] = useState('Kudosu Printable Puzzle Sheet');

  if (!isOpen || !puzzle) return null;

  const handleDownloadPdf = () => {
    const blob = PdfPrintStudio.generatePdf([puzzle], {
      puzzlesPerPage: 1,
      includeSolutions,
      paperSize,
      title,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kudosu-${puzzle.variant}-${puzzle.difficulty}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Printable PDF Studio</h3>
              <p className="text-xs text-slate-400">High-resolution vector print sheets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Options */}
        <div className="flex flex-col gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Sheet Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Paper Format:</label>
              <select
                value={paperSize}
                onChange={e => setPaperSize(e.target.value as 'a4' | 'letter')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-medium"
              >
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="letter">US Letter (8.5 x 11 in)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={includeSolutions}
                  onChange={e => setIncludeSolutions(e.target.checked)}
                  className="accent-cyan-500 w-4 h-4 rounded"
                />
                <span>Include Solution Key</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Vector PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
