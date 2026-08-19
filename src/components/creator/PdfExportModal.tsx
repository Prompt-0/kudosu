import React, { useState } from 'react';
import { PdfPrintStudio } from '../../pdf/printStudio';
import { useGameStore } from '../../store/gameStore';
import { Printer, Download, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md kudosu-panel p-6 flex flex-col gap-4 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-base">Printable PDF Studio</h3>
              <p className="text-xs text-[var(--text-secondary)]">High-resolution vector print sheets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Options */}
        <div className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="block text-[var(--text-secondary)] mb-1.5 font-bold">Sheet Title:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-[var(--text-primary)] font-bold focus:outline-none focus:border-[var(--border-active)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--text-secondary)] mb-1.5 font-bold">Paper Format:</label>
              <select
                value={paperSize}
                onChange={e => setPaperSize(e.target.value as 'a4' | 'letter')}
                className="w-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] font-bold"
              >
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="letter">US Letter (8.5 x 11 in)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer bg-[var(--bg-card-subtle)] p-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold">
                <input
                  type="checkbox"
                  checked={includeSolutions}
                  onChange={e => setIncludeSolutions(e.target.checked)}
                  className="accent-[var(--border-strong)] w-4 h-4 rounded"
                />
                <span>Include Solution Key</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Cancel
          </button>
          <button onClick={handleDownloadPdf} className="kudosu-btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold">
            <Download className="w-4 h-4" />
            <span>Download Vector PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
