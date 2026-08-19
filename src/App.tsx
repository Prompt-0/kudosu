import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useSettingsStore } from './store/settingsStore';
import { useStatsStore } from './store/statsStore';
import { PuzzleGenerator } from './engine/generator/generator';
import { Header } from './components/common/Header';
import { SudokuBoard } from './components/board/SudokuBoard';
import { GrandmasterNumpad } from './components/controls/GrandmasterNumpad';
import { ActionToolbar } from './components/controls/ActionToolbar';
import { ColorPaletteBar } from './components/controls/ColorPaletteBar';
import { KillerCombinationsDrawer } from './components/variant-hud/KillerCombinationsDrawer';
import { SamuraiRadarMap } from './components/variant-hud/SamuraiRadarMap';
import { RivalProgressBar } from './components/racing/RivalProgressBar';
import { HintModal } from './components/tutor/HintModal';
import { NewGameModal } from './components/common/NewGameModal';
import { SettingsModal } from './components/common/SettingsModal';
import { OcrScannerModal } from './components/ocr/OcrScannerModal';
import { PdfExportModal } from './components/creator/PdfExportModal';
import { DailyCalendarModal } from './components/daily/DailyCalendarModal';
import { VictoryModal } from './components/victory/VictoryModal';
import { AcademyHub } from './components/academy/AcademyHub';
import { LessonViewer } from './components/academy/LessonViewer';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { PuzzleCreator } from './components/creator/PuzzleCreator';
import { AcademyLesson } from './types/academy';
import { PuzzleDefinition } from './types/sudoku';
import { ShieldAlert, Sparkles, Flame } from 'lucide-react';

type ActiveView = 'game' | 'academy-hub' | 'lesson' | 'analytics' | 'creator';

export const App: React.FC = () => {
  const { puzzle, initGame, inputMode, isCompleted, mistakesCount, hintsUsed } = useGameStore();
  const { theme, assistanceMode } = useSettingsStore();
  const { loadStats, profile } = useStatsStore();

  const [activeView, setActiveView] = useState<ActiveView>('game');
  const [activeLesson, setActiveLesson] = useState<AcademyLesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeSamuraiGridIndex, setActiveSamuraiGridIndex] = useState(0);

  // Modals
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    loadStats();

    if (!puzzle) {
      const defaultPuzzle = PuzzleGenerator.generatePuzzle('classic', 'easy', 'rotational180');
      initGame(defaultPuzzle);
    }
  }, [theme, puzzle, initGame, loadStats]);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    setActiveLesson(lesson);
    setActiveView('lesson');
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds([...completedLessonIds, lessonId]);
    }
    setActiveView('academy-hub');
  };

  const handleStartPuzzle = (newPuzzle: PuzzleDefinition) => {
    initGame(newPuzzle);
    setActiveView('game');
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300"
      style={{
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top App Header */}
      <Header
        onOpenAcademy={() => setActiveView('academy-hub')}
        onOpenAnalytics={() => setActiveView('analytics')}
        onOpenCreator={() => setActiveView('creator')}
        onOpenDaily={() => setIsDailyModalOpen(true)}
        onOpenOcr={() => setIsOcrModalOpen(true)}
        onOpenPdf={() => setIsPdfModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewGame={() => setIsNewGameModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start p-3 md:p-6 w-full max-w-7xl mx-auto">
        {activeView === 'game' ? (
          /* Dual-Wing Desktop Cockpit Layout */
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-5 items-start">
            {/* Left Wing / Tactical HUD */}
            <aside className="flex flex-col gap-3.5 order-2 lg:order-1">
              {/* Game Status Card */}
              {puzzle && (
                <div className="kudosu-panel p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Current Matrix
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
                      {puzzle.variant.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold capitalize text-[var(--text-primary)]">
                      {puzzle.difficulty}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
                      Score: {puzzle.difficultyScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-subtle)] text-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-0.5">
                        <Flame className="w-3 h-3 text-rose-500" /> Streak
                      </span>
                      <span className="font-mono font-bold text-xs mt-0.5">{profile.currentStreak}d</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-0.5">
                        <ShieldAlert className="w-3 h-3 text-amber-500" /> Mistakes
                      </span>
                      <span className="font-mono font-bold text-xs mt-0.5">
                        {mistakesCount}{assistanceMode === 'arcade' ? '/3' : ''}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center justify-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-purple-400" /> Hints
                      </span>
                      <span className="font-mono font-bold text-xs mt-0.5">{hintsUsed}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Race Track */}
              <RivalProgressBar rivalDifficulty="club" />

              {/* Variant Specialized Tools */}
              {puzzle?.variant === 'killer' && <KillerCombinationsDrawer />}
              {puzzle?.variant === 'samurai' && (
                <SamuraiRadarMap
                  activeGridIndex={activeSamuraiGridIndex}
                  onSelectGrid={setActiveSamuraiGridIndex}
                />
              )}
            </aside>

            {/* Center Stage / Tactile Grid */}
            <section className="flex flex-col items-center justify-center order-1 lg:order-2">
              <SudokuBoard />
            </section>

            {/* Right Wing / Grandmaster Control Deck */}
            <aside className="flex flex-col gap-3.5 order-3">
              {inputMode === 'color' && <ColorPaletteBar />}
              <GrandmasterNumpad />
              <ActionToolbar
                onNewGame={() => setIsNewGameModalOpen(true)}
                onOpenHintModal={() => setIsHintModalOpen(true)}
              />
            </aside>
          </div>
        ) : activeView === 'academy-hub' ? (
          <AcademyHub
            completedLessonIds={completedLessonIds}
            onSelectLesson={handleSelectLesson}
            onClose={() => setActiveView('game')}
          />
        ) : activeView === 'lesson' && activeLesson ? (
          <LessonViewer
            lesson={activeLesson}
            onBack={() => setActiveView('academy-hub')}
            onCompleteLesson={handleCompleteLesson}
          />
        ) : activeView === 'analytics' ? (
          <AnalyticsDashboard onBack={() => setActiveView('game')} />
        ) : activeView === 'creator' ? (
          <PuzzleCreator
            onBack={() => setActiveView('game')}
            onPlayCreatedPuzzle={handleStartPuzzle}
          />
        ) : null}
      </main>

      {/* Modals Suite */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
      />

      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        onSelectPuzzle={handleStartPuzzle}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <OcrScannerModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onImportPuzzle={handleStartPuzzle}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <DailyCalendarModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onSelectDailyPuzzle={handleStartPuzzle}
      />

      <VictoryModal
        isOpen={isCompleted}
        onClose={() => useGameStore.setState({ isCompleted: false })}
        onNewGame={() => setIsNewGameModalOpen(true)}
        onOpenAnalytics={() => {
          useGameStore.setState({ isCompleted: false });
          setActiveView('analytics');
        }}
      />
    </div>
  );
};

export default App;
