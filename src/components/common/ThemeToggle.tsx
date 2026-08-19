import React from 'react';
import { useSettingsStore, ThemeId } from '../../store/settingsStore';
import { Palette, Check } from 'lucide-react';

const THEMES: { id: ThemeId; name: string; badge: string; colorDot: string }[] = [
  { id: 'midnight', name: 'OLED Midnight', badge: 'Dark & Neon', colorDot: '#00f0ff' },
  { id: 'sepia', name: 'Newspaper Sepia', badge: 'Tactile Ink', colorDot: '#b45309' },
  { id: 'matcha', name: 'Zen Matcha', badge: 'Earthy Slate', colorDot: '#10b981' },
  { id: 'neon', name: 'Cyberpunk Neon', badge: 'High Glow', colorDot: '#f43f5e' },
  { id: 'amber', name: 'Retro Amber CRT', badge: 'Phosphor', colorDot: '#fbbf24' },
  { id: 'contrast', name: 'High Contrast', badge: 'WCAG AAA', colorDot: '#ffffff' },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettingsStore();

  return (
    <div className="flex flex-col gap-2.5 p-3.5 kudosu-panel">
      <div className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-primary)]">
        <Palette className="w-4 h-4 text-[var(--text-accent)]" />
        <span>Theme Aesthetics</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(t => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[var(--bg-card-subtle)] border-[var(--border-active)] text-[var(--text-primary)] shadow-md ring-1 ring-[var(--border-active)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)]'
              }`}
            >
              <div className="flex items-center gap-2 text-left">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: t.colorDot }}
                />
                <div className="flex flex-col">
                  <span>{t.name}</span>
                  <span className="text-[9px] text-[var(--text-secondary)] font-normal">{t.badge}</span>
                </div>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-[var(--text-accent)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
