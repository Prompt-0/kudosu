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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md kudosu-panel p-6 flex flex-col gap-4 animate-pop">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-accent)] border border-[var(--border-subtle)]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[var(--text-primary)] text-base">Game Preferences</h3>
              <p className="text-xs text-[var(--text-secondary)]">Assistance, acoustic feedback & rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assistance Mode Selection */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">Assistance Mode:</span>
          <div className="grid grid-cols-3 gap-2">
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
                    ? 'bg-[var(--bg-card-subtle)] border-[var(--border-active)] text-[var(--text-accent)] ring-1 ring-[var(--border-active)] font-bold'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-xs">{m.label}</span>
                <span className="text-[10px] text-[var(--text-secondary)] font-normal">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Soundscape Controls */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-[var(--text-primary)]">Sound & Focus:</span>
          <div className="flex gap-2">
            <button
              onClick={toggleSound}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                soundMuted
                  ? 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-60'
                  : 'bg-[var(--bg-card-subtle)] border-[var(--border-active)] text-[var(--text-accent)]'
              }`}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{soundMuted ? 'Muted' : 'Acoustic SFX'}</span>
            </button>

            <button
              onClick={toggleZenDrone}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                zenDroneActive
                  ? 'bg-[var(--bg-card-subtle)] border-[var(--border-active)] text-emerald-400 ring-1 ring-emerald-400'
                  : 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>432Hz Zen Drone</span>
            </button>
          </div>
        </div>

        {/* Smart Helpers Toggles */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
          <span className="text-xs font-bold text-[var(--text-primary)]">Smart Assistance:</span>

          <label className="flex items-center justify-between p-2.5 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-subtle)] cursor-pointer">
            <span className="text-[var(--text-primary)] font-medium">Auto-prune candidates upon digit placement</span>
            <input
              type="checkbox"
              checked={autoPrune}
              onChange={toggleAutoPrune}
              className="accent-[var(--border-strong)] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-subtle)] cursor-pointer">
            <span className="text-[var(--text-primary)] font-medium">Highlight all cells sharing same digit</span>
            <input
              type="checkbox"
              checked={highlightSameDigit}
              onChange={toggleHighlightSameDigit}
              className="accent-[var(--border-strong)] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-subtle)] cursor-pointer">
            <span className="text-[var(--text-primary)] font-medium">Highlight conflicts and duplicate digits</span>
            <input
              type="checkbox"
              checked={highlightDuplicates}
              onChange={toggleHighlightDuplicates}
              className="accent-[var(--border-strong)] w-4 h-4"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
