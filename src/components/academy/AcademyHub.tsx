import React from 'react';
import { ACADEMY_LESSONS } from '../../academy/lessonsData';
import { AcademyLesson } from '../../types/academy';
import { GraduationCap, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AcademyHubProps {
  completedLessonIds: string[];
  onSelectLesson: (lesson: AcademyLesson) => void;
  onClose: () => void;
}

export const AcademyHub: React.FC<AcademyHubProps> = ({
  completedLessonIds,
  onSelectLesson,
}) => {
  const percent = Math.round((completedLessonIds.length / ACADEMY_LESSONS.length) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100">Kudosu Academy</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Master 18 Human Deduction Techniques from Novice to Grandmaster
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Progress</span>
            <span className="text-sm font-extrabold text-slate-100">
              {completedLessonIds.length} / {ACADEMY_LESSONS.length} ({percent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ACADEMY_LESSONS.map(lesson => {
          const isDone = completedLessonIds.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className="group cursor-pointer bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl font-bold font-mono text-xs flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-cyan-400 border border-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : lesson.chapterNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {lesson.category} • Score {lesson.difficultyRating}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {lesson.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {lesson.shortSummary}
              </p>

              <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 pt-2 border-t border-slate-800/80">
                <span>Start Chapter</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
