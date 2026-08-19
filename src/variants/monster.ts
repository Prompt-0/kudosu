import { BoardConfig } from '../types/sudoku';

export const monster16Config: BoardConfig = {
  variant: 'monster16',
  size: 16,
  boxWidth: 4,
  boxHeight: 4,
};

export const MONSTER_HEX_CHARS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G'
];

export function digitToMonsterChar(d: number): string {
  if (d >= 1 && d <= 16) return MONSTER_HEX_CHARS[d - 1];
  return `${d}`;
}

export function monsterCharToDigit(char: string): number | null {
  const upper = char.toUpperCase();
  const idx = MONSTER_HEX_CHARS.indexOf(upper);
  if (idx !== -1) return idx + 1;
  return null;
}
