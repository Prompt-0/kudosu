/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        app: 'var(--bg-app)',
        card: 'var(--bg-card)',
        cardSubtle: 'var(--bg-card-subtle)',
        borderSubtle: 'var(--border-subtle)',
        borderStrong: 'var(--border-strong)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textAccent: 'var(--text-accent)',
        cellBg: 'var(--cell-bg)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 6px var(--text-accent))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 14px var(--text-accent))' },
        }
      },
      animation: {
        pop: 'pop 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
