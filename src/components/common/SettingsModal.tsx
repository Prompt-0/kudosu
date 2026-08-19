import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { AssistanceMode } from '../../types/sudoku';
import { Settings, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    soundMuted,
    toggleSound,
    zenDroneActive,
    toggleZenDrone,
    assistanceMode,
    setAssistanceMode,
    autoPrune,
    toggleAutoPrune,
    highlightDuplicates,
    toggleHighlightDuplicates,
    highlightSameDigit,
    toggleHighlightSameDigit,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Game Preferences</h3>
              <p className="text-xs text-slate-400">Tactility, sound, and assistance rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assistance Mode Selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-300">Gameplay Rule Mode:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'zen', label: 'Zen', desc: 'Infinite undos, no pressure' },
              { id: 'arcade', label: '3-Strikes', desc: 'Arcade game over' },
              { id: 'speedrun', label: 'Penalty', desc: '+15s per error' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setAssistanceMode(m.id as AssistanceMode)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  assistanceMode === m.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold">{m.label}</span>
                <span className="text-[10px] text-slate-500">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Soundscape Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300">Sound & Focus:</span>
          <div className="flex gap-2">
            <button
              onClick={toggleSound}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                soundMuted
                  ? 'bg-slate-950 border-slate-800 text-slate-500'
                  : 'bg-slate-800 border-slate-700 text-cyan-400'
              }`}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{soundMuted ? 'Muted' : 'Acoustic SFX On'}</span>
            </button>

            <button
              onClick={toggleZenDrone}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                zenDroneActive
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>432Hz Zen Drone</span>
            </button>
          </div>
        </div>

        {/* Smart Helpers Toggles */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-xs font-bold text-slate-300">Board Helpers:</span>

          <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Auto-prune candidates upon digit placement</span>
            <input
              type="checkbox"
              checked={autoPrune}
              onChange={toggleAutoPrune}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Highlight all cells sharing same digit</span>
            <input
              type="checkbox"
              checked={highlightSameDigit}
              onChange={toggleHighlightSameDigit}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-300">Highlight conflicts and duplicate digits</span>
            <input
              type="checkbox"
              checked={highlightDuplicates}
              onChange={toggleHighlightDuplicates}
              className="accent-cyan-500 w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
