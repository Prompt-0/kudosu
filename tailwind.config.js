/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        palette: {
          1: 'var(--color-p1)',
          2: 'var(--color-p2)',
          3: 'var(--color-p3)',
          4: 'var(--color-p4)',
          5: 'var(--color-p5)',
          6: 'var(--color-p6)',
          7: 'var(--color-p7)',
          8: 'var(--color-p8)',
        }
      },
      keyframes: {
        laser: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.04)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0.4' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.9)' },
        }
      },
      animation: {
        laser: 'laser 1.8s ease-in-out infinite',
        pop: 'pop 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
