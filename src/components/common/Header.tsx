import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSettingsStore } from '../../store/settingsStore';
import { ThemeToggle } from './ThemeToggle';
import {
  GraduationCap,
  BarChart3,
  PenTool,
  Calendar,
  Camera,
  Printer,
  Settings,
  Palette,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
} from 'lucide-react';

interface HeaderProps {
  onOpenAcademy: () => void;
  onOpenAnalytics: () => void;
  onOpenCreator: () => void;
  onOpenDaily: () => void;
  onOpenOcr: () => void;
  onOpenPdf: () => void;
  onOpenSettings: () => void;
  onOpenNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAcademy,
  onOpenAnalytics,
  onOpenCreator,
  onOpenDaily,
  onOpenOcr,
  onOpenPdf,
  onOpenSettings,
  onOpenNewGame,
}) => {
  const { puzzle, timerMs, hasStarted, isPaused, togglePause, startGame } = useGameStore();
  const { soundMuted, toggleSound, showTimer } = useSettingsStore();
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  const seconds = Math.floor(timerMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  const timeFormatted = `${minutes}:${String(remSec).padStart(2, '0')}`;

  const handleTimerClick = () => {
    if (!hasStarted) {
      startGame();
    } else {
      togglePause();
    }
  };

  return (
    <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Current Mode */}
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenNewGame}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)] flex items-center gap-1.5">
                <span>Kudosu</span>
                <span className="text-[10px] font-mono font-bold text-[var(--text-accent)] bg-[var(--bg-card-subtle)] px-1.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
                  STUDIO
                </span>
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                {puzzle ? `${puzzle.variant.toUpperCase()} • ${puzzle.difficulty.toUpperCase()}` : 'Zen Mode'}
              </span>
            </div>
          </div>

          {/* Live Stopwatch Pill with Lazy Start */}
          {showTimer && puzzle && (
            <div
              onClick={handleTimerClick}
              className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] rounded-xl text-xs font-mono font-bold text-[var(--text-primary)] shadow-sm cursor-pointer transition-colors"
              title={!hasStarted ? 'Click to Start Timer' : isPaused ? 'Click to Resume' : 'Click to Pause'}
            >
              {!hasStarted ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">READY (0:00)</span>
                </>
              ) : (
                <>
                  {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
                  <span className={isPaused ? 'text-amber-400 animate-pulse' : 'text-[var(--text-primary)]'}>
                    {timeFormatted}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Studio Navigation Bar */}
        <nav className="flex items-center gap-1">
          <button
            onClick={onOpenNewGame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] text-[var(--text-primary)] transition-all"
            title="Generate New Puzzle"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--text-accent)]" />
            <span className="hidden md:inline">New Game</span>
          </button>

          <button
            onClick={onOpenAcademy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Academy (18 Chapters)"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="hidden lg:inline">Academy</span>
          </button>

          <button
            onClick={onOpenDaily}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Daily Challenge Calendar"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Daily</span>
          </button>

          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Speedcubing Telemetry & Heatmap"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Analytics</span>
          </button>

          <button
            onClick={onOpenCreator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Custom Puzzle Creator"
          >
            <PenTool className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">Creator</span>
          </button>

          <button
            onClick={onOpenOcr}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Camera & Image OCR Scanner"
          >
            <Camera className="w-4 h-4 text-sky-400" />
            <span className="hidden lg:inline">Scanner</span>
          </button>

          <button
            onClick={onOpenPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title="Printable Vector PDF Studio"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="hidden lg:inline">Print</span>
          </button>
        </nav>

        {/* Quick Utility Tools: Theme, Sound, Settings */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setShowThemeDrawer(!showThemeDrawer)}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:border-[var(--border-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors shadow-sm"
            title="Themes"
          >
            <Palette className="w-4 h-4 text-pink-400" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:border-[var(--border-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors shadow-sm"
            title={soundMuted ? 'Unmute SFX' : 'Mute SFX'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[var(--text-accent)]" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:border-[var(--border-active)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors shadow-sm"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Drawer Popover */}
          {showThemeDrawer && (
            <div className="absolute right-0 top-12 z-50 w-72 animate-pop">
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
