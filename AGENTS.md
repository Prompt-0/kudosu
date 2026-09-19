# Agent Guidelines for Kudosu

Kudosu is a high-performance Grandmaster Sudoku Studio & Academy built with React 19, TypeScript, TailwindCSS, Zustand, and Vitest.

---

## 🛠️ Verification & Test Commands
All changes must be strictly verified before submitting a PR:
- **Run Unit Tests**: `npm run test` (executes `vitest run`)
- **Typecheck & Production Build**: `npm run build` (executes `tsc -b && vite build`)
- **Dev Server**: `npm run dev`

---

## 🏛️ Codebase Architecture & Key Files
- `src/engine/dlx/`: Donald Knuth's Dancing Links (DLX) Algorithm X for solving exact-cover constraints with toroidal linked lists.
- `src/engine/generator/`: Web Worker-backed procedural puzzle generator supporting 10 variants and 7 difficulty tiers.
- `src/engine/human/`: Human-technique deduction engine (Naked/Hidden Singles, Pairs, Triples, Quads, Pointing/Claiming, X-Wing, Swordfish, XY-Wing).
- `src/components/board/`: Sudoku grid rendering, pencilmarking (normal, corner, center, color).
- `src/components/variant-hud/`: Variant overlays (Killer cage sums, Samurai radar map, Sandwich clues).
- `src/store/`: Zustand state management (`gameStore.ts`, `settingsStore.ts`, `statsStore.ts`).
- `src/tests/`: Vitest test suite for solver correctness and variant integrity.

---

## 📋 Engineering Standards & Guardrails
1. **Zero Type Errors**: Strict TypeScript without `any` casts. Always update `src/types/sudoku.ts` or related type manifests when changing signatures.
2. **Deterministic Solver Integrity**: The DLX and human solver engines must remain 100% deterministic. Never weaken test assertions in `src/tests/`.
3. **Performance in Hot Paths**: Keep candidate calculations and board re-renders optimized; avoid creating unnecessary closures inside render loops.
4. **Scope Discipline**: Confine modifications strictly to the assigned feature, bug, or performance goal. Do not reformat unrelated files.
