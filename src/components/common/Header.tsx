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
  const { puzzle, timerMs, isPaused, togglePause } = useGameStore();
  const { soundMuted, toggleSound, showTimer } = useSettingsStore();
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);

  const seconds = Math.floor(timerMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remSec = seconds % 60;
  const timeFormatted = `${minutes}:${String(remSec).padStart(2, '0')}`;

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-30">
      {/* Brand Logo & Current Mode */}
      <div className="flex items-center gap-3">
        <div
          onClick={onOpenNewGame}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-1">
              <span>Kudosu</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded-full border border-cyan-800">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {puzzle ? `${puzzle.variant.toUpperCase()} • ${puzzle.difficulty.toUpperCase()}` : 'Studio'}
            </span>
          </div>
        </div>

        {/* Live Timer */}
        {showTimer && puzzle && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-200">
            <button
              onClick={togglePause}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
            </button>
            <span className={isPaused ? 'text-amber-400 animate-pulse' : 'text-slate-100'}>
              {timeFormatted}
            </span>
          </div>
        )}
      </div>

      {/* Center Nav Items */}
      <nav className="flex items-center gap-1">
        <button
          onClick={onOpenAcademy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
          title="Academy (18 Techniques)"
        >
          <GraduationCap className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Academy</span>
        </button>

        <button
          onClick={onOpenDaily}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 transition-colors"
          title="Daily Challenge Calendar"
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="hidden md:inline">Daily</span>
        </button>

        <button
          onClick={onOpenAnalytics}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
          title="Speedcubing Analytics & Replays"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span className="hidden md:inline">Analytics</span>
        </button>

        <button
          onClick={onOpenCreator}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-purple-400 hover:bg-slate-900 transition-colors"
          title="Custom Puzzle Creator"
        >
          <PenTool className="w-4 h-4 text-purple-400" />
          <span className="hidden md:inline">Creator</span>
        </button>

        <button
          onClick={onOpenOcr}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-sky-400 hover:bg-slate-900 transition-colors"
          title="Camera & Image OCR Scanner"
        >
          <Camera className="w-4 h-4 text-sky-400" />
          <span className="hidden md:inline">Camera</span>
        </button>

        <button
          onClick={onOpenPdf}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-400 hover:bg-slate-900 transition-colors"
          title="Printable Vector PDF Studio"
        >
          <Printer className="w-4 h-4 text-rose-400" />
          <span className="hidden md:inline">Print</span>
        </button>
      </nav>

      {/* Right Controls: Themes, Audio, Settings */}
      <div className="flex items-center gap-1.5 relative">
        <button
          onClick={() => setShowThemeDrawer(!showThemeDrawer)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          title="Themes"
        >
          <Palette className="w-4 h-4 text-pink-400" />
        </button>

        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          title={soundMuted ? 'Unmute SFX' : 'Mute SFX'}
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Drawer Popover */}
        {showThemeDrawer && (
          <div className="absolute right-0 top-12 z-50 w-72">
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
};
