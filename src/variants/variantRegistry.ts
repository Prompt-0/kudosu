import { SudokuVariant, BoardConfig } from '../types/sudoku';
import { classicConfig } from './classic';
import { killerConfig } from './killer';
import { samuraiConfig } from './samurai';
import { jigsawConfig, standardJigsawRegions } from './jigsaw';
import { diagonalConfig } from './diagonal';
import { hyperConfig } from './hyper';
import { sandwichConfig } from './sandwich';
import { mini4Config, mini6Config } from './mini';
import { monster16Config } from './monster';

export const VARIANT_CONFIGS: Record<SudokuVariant, BoardConfig> = {
  classic: classicConfig,
  killer: killerConfig,
  samurai: samuraiConfig,
  jigsaw: { ...jigsawConfig, jigsawRegions: standardJigsawRegions },
  diagonal: diagonalConfig,
  hyper: hyperConfig,
  sandwich: sandwichConfig,
  mini4: mini4Config,
  mini6: mini6Config,
  monster16: monster16Config,
};

export interface VariantMeta {
  id: SudokuVariant;
  name: string;
  badge: string;
  description: string;
  iconName: string;
}

export const VARIANT_METAS: VariantMeta[] = [
  {
    id: 'classic',
    name: 'Classic 9x9',
    badge: 'Standard',
    description: 'The definitive standard 9x9 Sudoku puzzle.',
    iconName: 'Grid9',
  },
  {
    id: 'killer',
    name: 'Killer Sudoku',
    badge: 'Math Cages',
    description: 'Dotted cages with target sums and unique digit constraints.',
    iconName: 'Calculator',
  },
  {
    id: 'samurai',
    name: 'Samurai (5-Grid)',
    badge: '5 Interlocking',
    description: '5 interconnected 9x9 grids with shared corner blocks.',
    iconName: 'Layers',
  },
  {
    id: 'jigsaw',
    name: 'Jigsaw / Irregular',
    badge: 'Polyomino',
    description: 'Irregular polyomino regions replacing standard 3x3 boxes.',
    iconName: 'Puzzle',
  },
  {
    id: 'diagonal',
    name: 'X-Sudoku (Diagonals)',
    badge: 'Dual Diagonals',
    description: 'Both main diagonals must contain digits 1 through 9.',
    iconName: 'X',
  },
  {
    id: 'hyper',
    name: 'Hyper / Windoku',
    badge: '4 Windows',
    description: '4 extra 3x3 shaded windows with unique 1-9 constraints.',
    iconName: 'AppWindow',
  },
  {
    id: 'sandwich',
    name: 'Sandwich Sudoku',
    badge: 'Between 1 & 9',
    description: 'Perimeter clue sums sandwiched between 1 and 9.',
    iconName: 'Sandwich',
  },
  {
    id: 'mini4',
    name: 'Mini 4x4',
    badge: 'Blitz',
    description: 'Ultra-fast 4x4 grid with 2x2 boxes (digits 1–4).',
    iconName: 'Zap',
  },
  {
    id: 'mini6',
    name: 'Mini 6x6',
    badge: 'Sprint',
    description: 'Quick 6x6 grid with 2x3 boxes (digits 1–6).',
    iconName: 'Timer',
  },
  {
    id: 'monster16',
    name: 'Monster 16x16',
    badge: 'Grandmaster Hex',
    description: 'Massive 16x16 grid with 4x4 boxes using hex digits 1–G.',
    iconName: 'Crown',
  },
];
