import React, { useState } from 'react';
import { AcademyLesson } from '../../types/academy';
import { ProofLaserOverlay } from '../board/ProofLaserOverlay';
import { BookOpen, Sparkles, CheckCircle2, ChevronLeft, ArrowRight } from 'lucide-react';

interface LessonViewerProps {
  lesson: AcademyLesson;
  onBack: () => void;
  onCompleteLesson: (lessonId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack, onCompleteLesson }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'interactive'>('theory');
  const [isApplied, setIsApplied] = useState(false);

  const { interactiveExample } = lesson;
  const { proofStep } = interactiveExample;

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto p-2 md:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Academy Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)] text-xs font-bold font-mono">
            Chapter {lesson.chapterNumber}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-semibold">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 kudosu-panel">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'theory'
              ? 'bg-[var(--text-accent)] text-slate-950 font-extrabold shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Theory & Strategy</span>
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'interactive'
              ? 'bg-[var(--text-accent)] text-slate-950 font-extrabold shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Interactive Example Walkthrough</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'theory' ? (
        <div className="kudosu-panel p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <span className="text-[var(--text-accent)]">Chapter {lesson.chapterNumber}:</span>
            <span>{lesson.title}</span>
          </h2>
          <p className="text-sm font-semibold text-[var(--text-accent)] bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] p-3.5 rounded-xl">
            {lesson.shortSummary}
          </p>
          <div className="prose prose-invert max-w-none text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
            {lesson.theoryMarkdown}
          </div>
          <button
            onClick={() => setActiveTab('interactive')}
            className="mt-4 self-end kudosu-btn-primary flex items-center gap-2 px-5 py-2.5 text-xs font-bold"
          >
            <span>Proceed to Interactive Example</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 kudosu-panel p-6 md:p-8 items-center">
          {/* Mini Board */}
          <div className="relative w-full max-w-[280px] aspect-square bg-[var(--bg-card)] border-2 border-[var(--border-strong)] rounded-2xl overflow-hidden p-1 grid grid-cols-9 grid-rows-9 gap-[1px]">
            {interactiveExample.initialGrid.map((row, r) =>
              row.map((val, c) => {
                const isPrimary = proofStep.primaryCells.some(p => p.row === r && p.col === c);
                const isElim = proofStep.eliminations.some(e => e.cell.row === r && e.cell.col === c);
                const isPlace = proofStep.placements.some(p => p.cell.row === r && p.cell.col === c);

                let cellBg = 'bg-[var(--cell-bg)]';
                if (isPrimary) cellBg = 'bg-cyan-500/30 ring-1 ring-cyan-400';
                else if (isElim && !isApplied) cellBg = 'bg-rose-500/25 ring-1 ring-rose-400';
                else if (isPlace && isApplied) cellBg = 'bg-emerald-500/35 ring-1 ring-emerald-400';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center font-mono font-bold text-sm tabular-nums select-none ${cellBg}`}
                  >
                    {isPlace && isApplied ? (
                      <span className="text-emerald-400 animate-pop font-black">{proofStep.placements[0]?.digit}</span>
                    ) : val ? (
                      <span className="text-[var(--text-primary)]">{val}</span>
                    ) : isElim && !isApplied ? (
                      <span className="text-[10px] text-rose-400 line-through">
                        {proofStep.eliminations.find(e => e.cell.row === r && e.cell.col === c)?.digit}
                      </span>
                    ) : isPrimary && proofStep.highlightCandidates.length > 0 ? (
                      <span className="text-[10px] text-[var(--text-accent)] font-mono">
                        {proofStep.highlightCandidates.find(h => h.cell.row === r && h.cell.col === c)?.digit}
                      </span>
                    ) : null}
                  </div>
                );
              })
            )}

            {proofStep.laserLines && <ProofLaserOverlay laserLines={proofStep.laserLines} size={9} />}
          </div>

          {/* Explanation Panel */}
          <div className="flex-1 flex flex-col justify-between gap-4 w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[var(--text-accent)] font-extrabold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{proofStep.techniqueTitle}</span>
              </div>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card-subtle)] p-3.5 rounded-xl border border-[var(--border-subtle)]">
                {proofStep.explanation}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => setIsApplied(!isApplied)}
                className="w-full py-2.5 px-4 kudosu-btn-secondary text-xs font-bold"
              >
                {isApplied ? 'Reset to Initial State' : 'Simulate Deduction Elimination'}
              </button>

              <button
                onClick={() => onCompleteLesson(lesson.id)}
                className="w-full py-2.5 px-4 kudosu-btn-primary text-xs font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Chapter Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
