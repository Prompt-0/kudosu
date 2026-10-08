import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { PuzzleDefinition } from '../types/sudoku';

// Mock canvas-confetti to prevent ReferenceError: document is not defined in node environment
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock SoundManager to prevent errors in tests
vi.mock('../audio/soundManager', () => ({
  SoundManager: {
    click: vi.fn(),
    pencil: vi.fn(),
    erase: vi.fn(),
    fanfare: vi.fn(),
  },
}));

const dummyPuzzle: PuzzleDefinition = {
  id: 'test-1',
  title: 'Test Puzzle',
  variant: 'classic',
  difficulty: 'easy',
  difficultyScore: 100,
  grid: [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ],
  solution: [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ]
};

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useGameStore.setState({
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
    });
  });

  describe('Board Initialization', () => {
    it('initializes the board correctly with puzzle data', () => {
      const store = useGameStore.getState();
      store.initGame(dummyPuzzle);
      
      const updatedStore = useGameStore.getState();
      expect(updatedStore.cells.length).toBe(9);
      expect(updatedStore.cells[0][0].value).toBe(5);
      expect(updatedStore.cells[0][0].given).toBe(true);
      expect(updatedStore.cells[0][2].value).toBe(null);
      expect(updatedStore.cells[0][2].given).toBe(false);
      expect(updatedStore.puzzle).toEqual(dummyPuzzle);
      expect(updatedStore.gameStatus).toBe('ready');
      expect(updatedStore.hasStarted).toBe(false);
    });
  });

  describe('Game Status Transitions', () => {
    it('starts the game correctly', () => {
      const store = useGameStore.getState();
      store.initGame(dummyPuzzle);
      
      useGameStore.getState().startGame();
      
      const updated = useGameStore.getState();
      expect(updated.hasStarted).toBe(true);
      expect(updated.gameStatus).toBe('playing');
    });

    it('toggles pause state', () => {
      const store = useGameStore.getState();
      store.initGame(dummyPuzzle);
      
      // Attempting to pause before start should auto-start
      store.togglePause();
      expect(useGameStore.getState().hasStarted).toBe(true);
      expect(useGameStore.getState().isPaused).toBe(false);
      
      // Now let's pause again
      useGameStore.getState().togglePause();
      expect(useGameStore.getState().isPaused).toBe(true);
      expect(useGameStore.getState().gameStatus).toBe('paused');
      
      // Unpause
      useGameStore.getState().togglePause();
      expect(useGameStore.getState().isPaused).toBe(false);
      expect(useGameStore.getState().gameStatus).toBe('playing');
    });

    it('completes the game when board is solved', () => {
      const store = useGameStore.getState();
      
      // Create an almost solved puzzle
      const almostSolved = {
        ...dummyPuzzle,
        grid: dummyPuzzle.solution!.map(row => [...row]) as (number | null)[][]
      };
      // Leave one cell empty
      almostSolved.grid[0][2] = null;
      
      store.initGame(almostSolved);
      useGameStore.getState().startGame();
      
      // Select the empty cell
      useGameStore.getState().selectCell({ row: 0, col: 2 });
      
      // Input the missing digit
      useGameStore.getState().inputDigit(4);
      
      const updated = useGameStore.getState();
      expect(updated.isCompleted).toBe(true);
      expect(updated.gameStatus).toBe('completed');
    });
  });

  describe('Pencilmark Mode Toggles & Inputs', () => {
    beforeEach(() => {
      useGameStore.getState().initGame(dummyPuzzle);
      useGameStore.getState().selectCell({ row: 0, col: 2 }); // An empty cell
    });

    it('sets input mode', () => {
      useGameStore.getState().setInputMode('corner');
      expect(useGameStore.getState().inputMode).toBe('corner');
    });

    it('inputs normal value', () => {
      useGameStore.getState().setInputMode('normal');
      useGameStore.getState().inputDigit(4);
      
      const cell = useGameStore.getState().cells[0][2];
      expect(cell.value).toBe(4);
      // Auto-started
      expect(useGameStore.getState().hasStarted).toBe(true);
    });

    it('toggles normal value on same input', () => {
      useGameStore.getState().setInputMode('normal');
      useGameStore.getState().inputDigit(4);
      useGameStore.getState().inputDigit(4); // Same digit again toggles it off
      
      const cell = useGameStore.getState().cells[0][2];
      expect(cell.value).toBe(null);
    });

    it('inputs corner mark', () => {
      useGameStore.getState().setInputMode('corner');
      useGameStore.getState().inputDigit(1);
      useGameStore.getState().inputDigit(2);
      
      let cell = useGameStore.getState().cells[0][2];
      expect(cell.cornerMarks).toEqual([1, 2]);
      
      // Toggle off
      useGameStore.getState().inputDigit(1);
      cell = useGameStore.getState().cells[0][2];
      expect(cell.cornerMarks).toEqual([2]);
    });

    it('inputs center mark', () => {
      useGameStore.getState().setInputMode('center');
      useGameStore.getState().inputDigit(5);
      useGameStore.getState().inputDigit(9);
      
      let cell = useGameStore.getState().cells[0][2];
      expect(cell.centerMarks).toEqual([5, 9]);
      
      // Toggle off
      useGameStore.getState().inputDigit(5);
      cell = useGameStore.getState().cells[0][2];
      expect(cell.centerMarks).toEqual([9]);
    });

    it('applies color', () => {
      useGameStore.getState().setInputMode('color');
      useGameStore.getState().setActivePaletteColor(3);
      useGameStore.getState().inputDigit(3); // digit argument is ignored for color mode, it uses activePaletteColor
      
      let cell = useGameStore.getState().cells[0][2];
      expect(cell.color).toBe(3);
      
      // Toggle off
      useGameStore.getState().inputDigit(3);
      cell = useGameStore.getState().cells[0][2];
      expect(cell.color).toBe(null);
    });
  });

  describe('Cell Value Updates & History', () => {
    beforeEach(() => {
      useGameStore.getState().initGame(dummyPuzzle);
      useGameStore.getState().selectCell({ row: 0, col: 2 });
    });

    it('clears selected cell', () => {
      useGameStore.getState().inputDigit(4);
      expect(useGameStore.getState().cells[0][2].value).toBe(4);
      
      useGameStore.getState().clearSelected();
      expect(useGameStore.getState().cells[0][2].value).toBe(null);
    });

    it('does not modify given cells', () => {
      useGameStore.getState().selectCell({ row: 0, col: 0 }); // Given cell (5)
      useGameStore.getState().inputDigit(4);
      expect(useGameStore.getState().cells[0][0].value).toBe(5);
      
      useGameStore.getState().clearSelected();
      expect(useGameStore.getState().cells[0][0].value).toBe(5);
    });

    it('undoes and redoes actions', () => {
      useGameStore.getState().inputDigit(4);
      expect(useGameStore.getState().cells[0][2].value).toBe(4);
      
      useGameStore.getState().undo();
      expect(useGameStore.getState().cells[0][2].value).toBe(null);
      
      useGameStore.getState().redo();
      expect(useGameStore.getState().cells[0][2].value).toBe(4);
    });
    
    it('prunes candidates from peers on value input', () => {
      // Setup some candidates in a peer cell (0, 3)
      useGameStore.getState().selectCell({ row: 0, col: 3 });
      useGameStore.getState().setInputMode('center');
      useGameStore.getState().inputDigit(4);
      useGameStore.getState().inputDigit(7);
      
      expect(useGameStore.getState().cells[0][3].centerMarks).toEqual([4, 7]);
      
      // Select (0, 2) and input 4 in normal mode
      useGameStore.getState().selectCell({ row: 0, col: 2 });
      useGameStore.getState().setInputMode('normal');
      useGameStore.getState().inputDigit(4, true); // autoPrune is true by default
      
      // Candidate 4 should be pruned from peer (0, 3)
      expect(useGameStore.getState().cells[0][3].centerMarks).toEqual([7]);
    });
  });
});
