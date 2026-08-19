import React from 'react';
import { useSettingsStore, ThemeId } from '../../store/settingsStore';
import { Palette, Check } from 'lucide-react';

const THEMES: { id: ThemeId; name: string; badge: string; border: string }[] = [
  { id: 'midnight', name: 'OLED Midnight', badge: 'Dark & Neon', border: 'border-cyan-500' },
  { id: 'sepia', name: 'Newspaper Sepia', badge: 'Tactile Ink', border: 'border-amber-600' },
  { id: 'matcha', name: 'Zen Matcha', badge: 'Earthy Slate', border: 'border-emerald-500' },
  { id: 'neon', name: 'Cyberpunk Neon', badge: 'High Glow', border: 'border-pink-500' },
  { id: 'amber', name: 'Retro Amber CRT', badge: 'Phosphor', border: 'border-amber-400' },
  { id: 'contrast', name: 'High Contrast', badge: 'WCAG AAA', border: 'border-white' },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
        <Palette className="w-4 h-4 text-cyan-400" />
        <span>Theme Aesthetics</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(t => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? `bg-slate-950 ${t.border} text-white shadow-md ring-1 ring-white/30`
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex flex-col text-left">
                <span>{t.name}</span>
                <span className="text-[9px] text-slate-500 font-normal">{t.badge}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
