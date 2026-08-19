import { create } from 'zustand';
import { AssistanceMode } from '../types/sudoku';
import { SoundManager } from '../audio/soundManager';

export type ThemeId = 'midnight' | 'sepia' | 'matcha' | 'neon' | 'amber' | 'contrast';

interface SettingsState {
  theme: ThemeId;
  soundMuted: boolean;
  zenDroneActive: boolean;
  assistanceMode: AssistanceMode;
  showTimer: boolean;
  autoPrune: boolean;
  highlightDuplicates: boolean;
  highlightSameDigit: boolean;
  digitFirstMode: boolean;

  setTheme: (theme: ThemeId) => void;
  toggleSound: () => void;
  toggleZenDrone: () => void;
  setAssistanceMode: (mode: AssistanceMode) => void;
  toggleShowTimer: () => void;
  toggleAutoPrune: () => void;
  toggleHighlightDuplicates: () => void;
  toggleHighlightSameDigit: () => void;
  toggleDigitFirstMode: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'midnight',
  soundMuted: false,
  zenDroneActive: false,
  assistanceMode: 'zen',
  showTimer: true,
  autoPrune: true,
  highlightDuplicates: true,
  highlightSameDigit: true,
  digitFirstMode: false,

  setTheme: (theme: ThemeId) => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('kudosu_theme', theme);
    set({ theme });
  },

  toggleSound: () => {
    const next = !get().soundMuted;
    SoundManager.setMuted(next);
    localStorage.setItem('kudosu_muted', String(next));
    set({ soundMuted: next });
  },

  toggleZenDrone: () => {
    const active = SoundManager.toggleZenDrone();
    set({ zenDroneActive: active });
  },

  setAssistanceMode: (mode: AssistanceMode) => {
    localStorage.setItem('kudosu_assistance_mode', mode);
    set({ assistanceMode: mode });
  },

  toggleShowTimer: () => set(state => ({ showTimer: !state.showTimer })),
  toggleAutoPrune: () => set(state => ({ autoPrune: !state.autoPrune })),
  toggleHighlightDuplicates: () => set(state => ({ highlightDuplicates: !state.highlightDuplicates })),
  toggleHighlightSameDigit: () => set(state => ({ highlightSameDigit: !state.highlightSameDigit })),
  toggleDigitFirstMode: () => set(state => ({ digitFirstMode: !state.digitFirstMode })),
}));
