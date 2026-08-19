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
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-2 md:p-4 animate-fade-in">
      {/* Header Banner */}
      <div className="kudosu-panel p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] text-[var(--text-accent)]">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]">Kudosu Academy</h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Master 18 Human Deduction Techniques from Novice to Grandmaster
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-3.5 bg-[var(--bg-card-subtle)] px-5 py-3 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
          <Trophy className="w-6 h-6 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">Skill Mastery</span>
            <span className="text-sm font-mono font-extrabold text-[var(--text-primary)]">
              {completedLessonIds.length} / {ACADEMY_LESSONS.length} ({percent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACADEMY_LESSONS.map(lesson => {
          const isDone = completedLessonIds.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className="kudosu-panel group cursor-pointer p-5 transition-all duration-200 hover:border-[var(--border-active)] hover:scale-[1.01] flex flex-col justify-between gap-3.5 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl font-mono font-extrabold text-xs flex items-center justify-center ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : lesson.chapterNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[var(--text-primary)] text-sm group-hover:text-[var(--text-accent)] transition-colors">
                      {lesson.title}
                    </h3>
                    <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                      {lesson.category} • Score {lesson.difficultyRating}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {lesson.difficulty}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {lesson.shortSummary}
              </p>

              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-accent)] pt-2.5 border-t border-[var(--border-subtle)]">
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
