# Kudosu 🧩

> **Grandmaster Sudoku Studio & Academy powered by Donald Knuth's Dancing Links (DLX) Algorithm X**

![React](https://img.shields.io/badge/React-19-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)
![Vitest](https://img.shields.io/badge/Vitest-3.2-green.svg)

Kudosu is a modern, high-performance Sudoku suite designed for competitive speedrunners, variant enthusiasts, and puzzle students alike. It pairs an exact-cover DLX solver with a human-grade deduction engine, 10 puzzle variants, AI-free interactive tutoring, OCR import, and vector PDF exports.

---

## ✨ Key Features

### 🧠 Solver & Generation Engine
- **Knuth's Algorithm X (DLX)**: Exact-cover solver implemented via doubly-linked toroidal lists for sub-millisecond solving and guaranteed unique solutions.
- **Human-Technique Deduction Solver**: Calculates logical difficulty without brute force (Naked/Hidden Singles, Pairs, Triples, Quads, Pointing/Claiming, X-Wing, Swordfish, XY-Wing, and Simple Coloring).
- **Procedural Variant Generator**: Web Worker-powered generator supporting unique puzzle generation up to Grandmaster tier.

### 🎲 10 Rich Sudoku Variants
- **Classic 9x9**: Standard rules with 7 granular difficulty grades.
- **Killer Sudoku**: Cage sums with arithmetic constraints and dedicated permutation HUD.
- **Samurai 5-in-1**: Multi-grid layout with central overlap and mini-radar navigation map.
- **Sandwich Sudoku**: Row and column sum clues between numbers 1 and 9.
- **Jigsaw (Irregular)**: Dynamically contoured, non-rectangular polyomino boxes.
- **Diagonal (Sudoku X)**: Additional diagonal constraint enforcement.
- **Hyper (Windoku)**: 4 additional internal 3x3 overlapping windows.
- **Monster 16x16**: Extended hexadecimal grids for extreme solvers.
- **Mini (4x4 & 6x6)**: Fast-paced bite-sized grids.

### 🎮 Player Experience & Modes
- **Dual-Wing Studio Cockpit**: Ergonomic controls with desktop numpad, color palettes, and candidate toggles.
- **4 Pencilmarking Modes**: Normal values, Corner candidates, Center candidates, and Color marking.
- **3 Gameplay Modes**:
  - **Zen**: Unlimited hints, mistake counters disabled, relaxing audio feedback.
  - **Arcade**: 3-strike challenge with score multipliers and combo streaks.
  - **Speedrun**: Strict stopwatch with lazy-start inspection overlays and rival ghost racers.
- **Sudoku Academy**: Interactive guided lessons teaching advanced human solving strategies with live board simulations.
- **OCR Import & PDF Creator**: Scan puzzles from images or generate vector PDF printables.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` or `pnpm`

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/Prompt-0/kudosu.git
cd kudosu

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Test
```bash
# Run unit and engine test suite
npm run test

# Compile TypeScript and bundle production assets
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Architecture

```
kudosu/
├── src/
│   ├── engine/
│   │   ├── dlx/            # Toroidal Dancing Links exact-cover solver
│   │   ├── generator/      # Procedural puzzle generator & worker
│   │   └── human/          # Human-like strategic hint & grade analyzer
│   ├── components/
│   │   ├── board/          # Reactive Sudoku board & grid renderers
│   │   ├── variant-hud/    # Killer combination & Samurai radar HUDs
│   │   ├── controls/       # Grandmaster numpad, action & color toolbars
│   │   ├── academy/        # Interactive strategy curriculum & lessons
│   │   ├── tutor/          # Hint modal with visual board highlights
│   │   ├── creator/        # Custom puzzle builder & vector PDF export
│   │   └── analytics/      # Speedrun stats and solve telemetry
│   ├── store/              # Zustand global state (game, settings, stats)
│   └── tests/              # Vitest test suite for solver & variants
└── package.json
```

---

## 📄 License

MIT License. Open source and free to use.
