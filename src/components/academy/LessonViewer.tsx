import React, { useState } from 'react';
import { AcademyLesson } from '../../types/academy';
import { ProofLaserOverlay } from '../board/ProofLaserOverlay';
import { BookOpen, Sparkles, CheckCircle2, ChevronLeft, ArrowRight, ShieldAlert } from 'lucide-react';

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
    <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Academy Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
            Chapter {lesson.chapterNumber}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'theory'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Theory & Strategy</span>
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'interactive'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Example Walkthrough</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'theory' ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">Chapter {lesson.chapterNumber}:</span>
            <span>{lesson.title}</span>
          </h2>
          <p className="text-sm font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 p-3 rounded-xl">
            {lesson.shortSummary}
          </p>
          <div className="prose prose-invert prose-slate text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {lesson.theoryMarkdown}
          </div>
          <button
            onClick={() => setActiveTab('interactive')}
            className="mt-4 self-end flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95"
          >
            <span>Proceed to Interactive Example</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          {/* Mini Board */}
          <div className="relative w-full max-w-xs mx-auto aspect-square bg-slate-950 border-2 border-cyan-500/40 rounded-xl overflow-hidden p-1 grid grid-cols-9 grid-rows-9 gap-[1px]">
            {interactiveExample.initialGrid.map((row, r) =>
              row.map((val, c) => {
                const isPrimary = proofStep.primaryCells.some(p => p.row === r && p.col === c);
                const isElim = proofStep.eliminations.some(e => e.cell.row === r && e.cell.col === c);
                const isPlace = proofStep.placements.some(p => p.cell.row === r && p.cell.col === c);

                let cellBg = 'bg-slate-900/80';
                if (isPrimary) cellBg = 'bg-cyan-500/30 ring-1 ring-cyan-400';
                else if (isElim && !isApplied) cellBg = 'bg-rose-500/25 ring-1 ring-rose-400';
                else if (isPlace && isApplied) cellBg = 'bg-emerald-500/35 ring-1 ring-emerald-400';

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex items-center justify-center font-bold text-sm tabular-nums select-none ${cellBg}`}
                  >
                    {isPlace && isApplied ? (
                      <span className="text-emerald-400 animate-pop font-black">{proofStep.placements[0]?.digit}</span>
                    ) : val ? (
                      <span className="text-slate-100">{val}</span>
                    ) : isElim && !isApplied ? (
                      <span className="text-[10px] text-rose-400 line-through">
                        {proofStep.eliminations.find(e => e.cell.row === r && e.cell.col === c)?.digit}
                      </span>
                    ) : isPrimary && proofStep.highlightCandidates.length > 0 ? (
                      <span className="text-[10px] text-cyan-300 font-mono">
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
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>{proofStep.techniqueTitle}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {proofStep.explanation}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsApplied(!isApplied)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                {isApplied ? 'Reset to Initial State' : 'Simulate Deduction Elimination'}
              </button>

              <button
                onClick={() => onCompleteLesson(lesson.id)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
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
