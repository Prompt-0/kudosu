import { create } from 'zustand';
import {
  CellState,
  CellCoord,
  PuzzleDefinition,
  InputMode,
  MoveAction,
  GameStatus,
} from '../types/sudoku';
import { DeductionProofStep } from '../types/solver';
import { SoundManager } from '../audio/soundManager';
import { CandidateGrid } from '../engine/human/candidateGrid';
import { HumanSolver } from '../engine/human/humanSolver';
import { VARIANT_CONFIGS } from '../variants/variantRegistry';
import confetti from 'canvas-confetti';

interface GameState {
  puzzle: PuzzleDefinition | null;
  cells: CellState[][];
  selectedCells: CellCoord[];
  inputMode: InputMode;
  activeDigitFilter: number | null;
  activePaletteColor: number;
  history: MoveAction[];
  historyIndex: number;
  timerMs: number;
  hasStarted: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  gameStatus: GameStatus;
  mistakesCount: number;
  hintsUsed: number;
  activeHintStep: DeductionProofStep | null;
  cellHesitationMs: Record<string, number>;

  // Actions
  initGame: (puzzle: PuzzleDefinition) => void;
  startGame: () => void;
  selectCell: (coord: CellCoord, isMulti?: boolean) => void;
  setInputMode: (mode: InputMode) => void;
  setActiveDigitFilter: (d: number | null) => void;
  setActivePaletteColor: (c: number) => void;
  inputDigit: (digit: number, autoPrune?: boolean) => void;
  toggleCornerMark: (digit: number) => void;
  toggleCenterMark: (digit: number) => void;
  applyColor: (color: number | null) => void;
  clearSelected: () => void;
  undo: () => void;
  redo: () => void;
  autoFillCandidates: () => void;
  cleanInvalidCandidates: () => void;
  checkBoard: () => void;
  requestHint: () => DeductionProofStep | null;
  applyHintStep: (step: DeductionProofStep) => void;
  clearHint: () => void;
  tickTimer: (deltaMs: number) => void;
  togglePause: () => void;
  restartGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  puzzle: null,
  cells: [],
  selectedCells: [{ row: 0, col: 0 }],
  inputMode: 'normal',
  activeDigitFilter: null,
  activePaletteColor: 1,
  history: [],
  historyIndex: -1,
  timerMs: 0,
  hasStarted: false,
  isPaused: false,
  isCompleted: false,
  gameStatus: 'ready',
  mistakesCount: 0,
  hintsUsed: 0,
  activeHintStep: null,
  cellHesitationMs: {},

  initGame: (puzzle: PuzzleDefinition) => {
    const config = VARIANT_CONFIGS[puzzle.variant] || VARIANT_CONFIGS.classic;
    const size = config.size;

    const cells: CellState[][] = [];
    for (let r = 0; r < size; r++) {
      const rowCells: CellState[] = [];
      for (let c = 0; c < size; c++) {
        const val = puzzle.grid[r]?.[c] ?? null;
        rowCells.push({
          row: r,
          col: c,
          gridIndex: 0,
          value: val,
          given: val !== null && val > 0,
          cornerMarks: [],
          centerMarks: [],
          color: null,
        });
      }
      cells.push(rowCells);
    }

    set({
      puzzle,
      cells,
      selectedCells: [{ row: 0, col: 0 }],
      inputMode: 'normal',
      activeDigitFilter: null,
      history: [],
      historyIndex: -1,
      timerMs: 0,
      hasStarted: false,
      isPaused: false,
      isCompleted: false,
      gameStatus: 'ready',
      mistakesCount: 0,
      hintsUsed: 0,
      activeHintStep: null,
      cellHesitationMs: {},
    });
  },

  startGame: () => {
    if (!get().hasStarted && !get().isCompleted) {
      set({ hasStarted: true, isPaused: false, gameStatus: 'playing' });
    }
  },

  selectCell: (coord: CellCoord, isMulti: boolean = false) => {
    SoundManager.click();
    const current = get().selectedCells;
    if (isMulti) {
      const exists = current.some(c => c.row === coord.row && c.col === coord.col);
      if (exists) {
        set({ selectedCells: current.filter(c => c.row !== coord.row || c.col !== coord.col) });
      } else {
        set({ selectedCells: [...current, coord] });
      }
    } else {
      set({ selectedCells: [coord] });
    }
  },

  setInputMode: (inputMode: InputMode) => set({ inputMode }),
  setActiveDigitFilter: (d: number | null) => set({ activeDigitFilter: d }),
  setActivePaletteColor: (c: number) => set({ activePaletteColor: c }),

  inputDigit: (digit: number, autoPrune: boolean = true) => {
    const { cells, selectedCells, inputMode, activePaletteColor, puzzle, history, historyIndex, hasStarted } = get();
    if (!puzzle || selectedCells.length === 0 || get().isCompleted) return;

    // Automatically begin game timing on first move
    if (!hasStarted) {
      get().startGame();
    }

    if (inputMode === 'corner') {
      get().toggleCornerMark(digit);
      return;
    }
    if (inputMode === 'center') {
      get().toggleCenterMark(digit);
      return;
    }
    if (inputMode === 'color') {
      get().applyColor(activePaletteColor);
      return;
    }

    // Normal Digit placement
    SoundManager.pencil();
    const newCells = cells.map(row => row.map(cell => ({ ...cell })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    let madeChange = false;
    let placedRow = -1;
    let placedCol = -1;

    for (const sel of selectedCells) {
      const cell = newCells[sel.row][sel.col];
      if (cell.given) continue;

      prevValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      const nextVal = cell.value === digit ? null : digit;
      cell.value = nextVal;
      cell.cornerMarks = [];
      cell.centerMarks = [];
      madeChange = true;
      placedRow = sel.row;
      placedCol = sel.col;

      newValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [],
        centerMarks: [],
        color: cell.color,
      });

      // Auto-prune candidates from peers
      if (autoPrune && nextVal !== null) {
        const cGrid = new CandidateGrid(newCells.map(r => r.map(c => c.value)), puzzle.grid.length);
        const peers = cGrid.getPeers(sel.row, sel.col);
        for (const p of peers) {
          const peerCell = newCells[p.row][p.col];
          peerCell.cornerMarks = peerCell.cornerMarks.filter(d => d !== nextVal);
          peerCell.centerMarks = peerCell.centerMarks.filter(d => d !== nextVal);
        }
      }
    }

    if (!madeChange) return;

    const action: MoveAction = {
      type: 'setValue',
      cells: selectedCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
    });

    // Check completion or unit completion
    if (placedRow !== -1 && placedCol !== -1) {
      get().checkBoard();
    }
  },

  toggleCornerMark: (digit: number) => {
    SoundManager.pencil();
    const { cells, selectedCells, history, historyIndex, hasStarted } = get();
    if (selectedCells.length === 0) return;

    if (!hasStarted) {
      get().startGame();
    }

    const newCells = cells.map(row => row.map(cell => ({ ...cell })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    for (const sel of selectedCells) {
      const cell = newCells[sel.row][sel.col];
      if (cell.given || cell.value !== null) continue;

      prevValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      if (cell.cornerMarks.includes(digit)) {
        cell.cornerMarks = cell.cornerMarks.filter(d => d !== digit);
      } else {
        cell.cornerMarks = [...cell.cornerMarks, digit].sort((a, b) => a - b);
      }

      newValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });
    }

    const action: MoveAction = {
      type: 'toggleCorner',
      cells: selectedCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
    });
  },

  toggleCenterMark: (digit: number) => {
    SoundManager.pencil();
    const { cells, selectedCells, history, historyIndex, hasStarted } = get();
    if (selectedCells.length === 0) return;

    if (!hasStarted) {
      get().startGame();
    }

    const newCells = cells.map(row => row.map(cell => ({ ...cell })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    for (const sel of selectedCells) {
      const cell = newCells[sel.row][sel.col];
      if (cell.given || cell.value !== null) continue;

      prevValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      if (cell.centerMarks.includes(digit)) {
        cell.centerMarks = cell.centerMarks.filter(d => d !== digit);
      } else {
        cell.centerMarks = [...cell.centerMarks, digit].sort((a, b) => a - b);
      }

      newValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });
    }

    const action: MoveAction = {
      type: 'toggleCenter',
      cells: selectedCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
    });
  },

  applyColor: (color: number | null) => {
    SoundManager.click();
    const { cells, selectedCells, history, historyIndex, hasStarted } = get();
    if (selectedCells.length === 0) return;

    if (!hasStarted) {
      get().startGame();
    }

    const newCells = cells.map(row => row.map(cell => ({ ...cell })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    for (const sel of selectedCells) {
      const cell = newCells[sel.row][sel.col];
      prevValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      cell.color = cell.color === color ? null : color;

      newValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });
    }

    const action: MoveAction = {
      type: 'setColor',
      cells: selectedCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
    });
  },

  clearSelected: () => {
    SoundManager.erase();
    const { cells, selectedCells, history, historyIndex } = get();
    if (selectedCells.length === 0) return;

    const newCells = cells.map(row => row.map(cell => ({ ...cell })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    for (const sel of selectedCells) {
      const cell = newCells[sel.row][sel.col];
      if (cell.given) continue;

      prevValues.push({
        cell: sel,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      cell.value = null;
      cell.cornerMarks = [];
      cell.centerMarks = [];
      cell.color = null;

      newValues.push({
        cell: sel,
        value: null,
        cornerMarks: [],
        centerMarks: [],
        color: null,
      });
    }

    const action: MoveAction = {
      type: 'clearCell',
      cells: selectedCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex, cells } = get();
    if (historyIndex < 0) return;

    SoundManager.click();
    const action = history[historyIndex];
    const newCells = cells.map(row => row.map(cell => ({ ...cell })));

    for (const prev of action.prevValues) {
      const cell = newCells[prev.cell.row][prev.cell.col];
      cell.value = prev.value;
      cell.cornerMarks = [...prev.cornerMarks];
      cell.centerMarks = [...prev.centerMarks];
      cell.color = prev.color;
    }

    set({
      cells: newCells,
      historyIndex: historyIndex - 1,
      selectedCells: action.cells,
    });
  },

  redo: () => {
    const { history, historyIndex, cells } = get();
    if (historyIndex >= history.length - 1) return;

    SoundManager.click();
    const nextIndex = historyIndex + 1;
    const action = history[nextIndex];
    const newCells = cells.map(row => row.map(cell => ({ ...cell })));

    for (const next of action.newValues) {
      const cell = newCells[next.cell.row][next.cell.col];
      cell.value = next.value;
      cell.cornerMarks = [...next.cornerMarks];
      cell.centerMarks = [...next.centerMarks];
      cell.color = next.color;
    }

    set({
      cells: newCells,
      historyIndex: nextIndex,
      selectedCells: action.cells,
    });
  },

  autoFillCandidates: () => {
    SoundManager.pencil();
    const { cells, puzzle, hasStarted } = get();
    if (!puzzle) return;

    if (!hasStarted) {
      get().startGame();
    }

    const rawGrid = cells.map(row => row.map(c => c.value));
    const cGrid = new CandidateGrid(rawGrid, puzzle.grid.length);

    const newCells = cells.map((row, r) =>
      row.map((cell, c) => {
        if (cell.value === null && !cell.given) {
          const cands = Array.from(cGrid.candidates[r][c]).sort((a, b) => a - b);
          return {
            ...cell,
            centerMarks: cands,
          };
        }
        return cell;
      })
    );

    set({ cells: newCells });
  },

  cleanInvalidCandidates: () => {
    SoundManager.erase();
    const { cells, puzzle, hasStarted } = get();
    if (!puzzle) return;

    if (!hasStarted) {
      get().startGame();
    }

    const rawGrid = cells.map(row => row.map(c => c.value));
    const cGrid = new CandidateGrid(rawGrid, puzzle.grid.length);

    const newCells = cells.map((row, r) =>
      row.map((cell, c) => {
        if (cell.value === null && !cell.given) {
          const validSet = cGrid.candidates[r][c];
          return {
            ...cell,
            cornerMarks: cell.cornerMarks.filter(d => validSet.has(d)),
            centerMarks: cell.centerMarks.filter(d => validSet.has(d)),
          };
        }
        return cell;
      })
    );

    set({ cells: newCells });
  },

  checkBoard: () => {
    const { cells, puzzle } = get();
    if (!puzzle) return;

    const size = cells.length;
    let hasEmpty = false;
    let hasMistake = false;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = cells[r][c].value;
        if (val === null || val === 0) {
          hasEmpty = true;
        } else if (puzzle.solution && puzzle.solution[r][c] !== val) {
          hasMistake = true;
        }
      }
    }

    if (!hasEmpty && !hasMistake && !get().isCompleted) {
      SoundManager.fanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      set({ isCompleted: true, gameStatus: 'completed' });
    }
  },

  requestHint: () => {
    const { cells, puzzle, hintsUsed, hasStarted } = get();
    if (!puzzle || get().isCompleted) return null;

    if (!hasStarted) {
      get().startGame();
    }

    const rawGrid = cells.map(row => row.map(c => c.value));
    const step = HumanSolver.getNextStep(rawGrid, puzzle.grid.length);

    if (step) {
      SoundManager.click();
      set({ activeHintStep: step, hintsUsed: hintsUsed + 1 });
      return step;
    }
    return null;
  },

  applyHintStep: (step: DeductionProofStep) => {
    SoundManager.click();
    const { cells, history, historyIndex, hasStarted } = get();

    if (!hasStarted) {
      get().startGame();
    }

    const newCells = cells.map(row => row.map(c => ({ ...c })));
    const prevValues: MoveAction['prevValues'] = [];
    const newValues: MoveAction['newValues'] = [];

    // Apply eliminations
    for (const elim of step.eliminations) {
      const cell = newCells[elim.cell.row][elim.cell.col];
      prevValues.push({
        cell: elim.cell,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      cell.cornerMarks = cell.cornerMarks.filter(d => d !== elim.digit);
      cell.centerMarks = cell.centerMarks.filter(d => d !== elim.digit);

      newValues.push({
        cell: elim.cell,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });
    }

    // Apply placements
    for (const place of step.placements) {
      const cell = newCells[place.cell.row][place.cell.col];
      prevValues.push({
        cell: place.cell,
        value: cell.value,
        cornerMarks: [...cell.cornerMarks],
        centerMarks: [...cell.centerMarks],
        color: cell.color,
      });

      cell.value = place.digit;
      cell.cornerMarks = [];
      cell.centerMarks = [];

      newValues.push({
        cell: place.cell,
        value: place.digit,
        cornerMarks: [],
        centerMarks: [],
        color: cell.color,
      });
    }

    const action: MoveAction = {
      type: 'applyStep',
      cells: step.primaryCells,
      prevValues,
      newValues,
      timestamp: Date.now(),
    };

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(action);

    set({
      cells: newCells,
      history: nextHistory,
      historyIndex: nextHistory.length - 1,
      activeHintStep: null,
    });

    get().checkBoard();
  },

  clearHint: () => set({ activeHintStep: null }),

  tickTimer: (deltaMs: number) => {
    const { hasStarted, isPaused, isCompleted, puzzle } = get();
    if (hasStarted && !isPaused && !isCompleted && puzzle) {
      const nextTime = get().timerMs + deltaMs;
      // Track active cell hesitation
      const sel = get().selectedCells[0];
      const hesitation = { ...get().cellHesitationMs };
      if (sel) {
        const k = `${sel.row},${sel.col}`;
        hesitation[k] = (hesitation[k] || 0) + deltaMs;
      }
      set({ timerMs: nextTime, cellHesitationMs: hesitation });
    }
  },

  togglePause: () => {
    const { hasStarted, isPaused, isCompleted } = get();
    if (isCompleted) return;

    if (!hasStarted) {
      get().startGame();
      return;
    }

    const nextPaused = !isPaused;
    set({
      isPaused: nextPaused,
      gameStatus: nextPaused ? 'paused' : 'playing',
    });
  },

  restartGame: () => {
    const { puzzle } = get();
    if (puzzle) {
      get().initGame(puzzle);
    }
  },
}));
