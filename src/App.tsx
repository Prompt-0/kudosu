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

type ActiveView = 'game' | 'academy-hub' | 'lesson' | 'analytics' | 'creator';

export const App: React.FC = () => {
  const { puzzle, initGame, inputMode, isCompleted } = useGameStore();
  const { theme } = useSettingsStore();
  const { loadStats } = useStatsStore();

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

  // Initialize theme, stats and default puzzle on mount
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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-300">
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
      <main className="flex-1 flex flex-col items-center justify-start p-3 md:p-6 w-full max-w-5xl mx-auto">
        {activeView === 'game' ? (
          <div className="flex flex-col gap-4 w-full items-center">
            {/* Live Racing Bar */}
            <RivalProgressBar rivalDifficulty="club" />

            {/* Specialized Variant HUDs */}
            {puzzle?.variant === 'killer' && <KillerCombinationsDrawer />}
            {puzzle?.variant === 'samurai' && (
              <SamuraiRadarMap
                activeGridIndex={activeSamuraiGridIndex}
                onSelectGrid={setActiveSamuraiGridIndex}
              />
            )}

            {/* Board */}
            <SudokuBoard />

            {/* Controls */}
            <div className="flex flex-col gap-3 w-full items-center">
              {inputMode === 'color' && <ColorPaletteBar />}
              <GrandmasterNumpad />
              <ActionToolbar
                onNewGame={() => setIsNewGameModalOpen(true)}
                onOpenHintModal={() => setIsHintModalOpen(true)}
              />
            </div>
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
