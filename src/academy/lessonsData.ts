import { AcademyLesson } from '../types/academy';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson-1',
    chapterNumber: 1,
    title: 'Naked Singles',
    techniqueName: 'Naked Single',
    category: 'Elementary',
    difficulty: 'Beginner',
    difficultyRating: 100,
    shortSummary: 'A cell where only 1 remaining candidate digit is mathematically possible.',
    theoryMarkdown: `### What is a Naked Single?
A **Naked Single** (also called a Forced Digit or Sole Candidate) occurs when 8 other unique digits are already present in the intersecting Row, Column, and 3x3 Box.

Because a cell can only hold digits 1 through 9, and 8 of those digits are already occupied by its peers, the cell has no choice but to take the single remaining digit.

#### How to Spot It:
1. Examine cells surrounded by heavily populated rows and columns.
2. Cross-reference the digits in the row, column, and box.
3. If only one number is missing, place it immediately!`,
    interactiveExample: {
      initialGrid: [
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
      initialCandidates: [],
      proofStep: {
        technique: 'Naked Single',
        category: 'singles',
        difficultyScore: 100,
        nudgeMessage: 'Inspect cell R1C3. Look at its row, column, and box.',
        techniqueTitle: 'Naked Single: 4 at R1C3',
        explanation: 'Cell R1C3 sees 1,2,3,5,6,7,8,9 in its row, column, and box. The only candidate left is 4.',
        primaryCells: [{ row: 0, col: 2 }],
        highlightCandidates: [{ cell: { row: 0, col: 2 }, digit: 4 }],
        eliminations: [],
        placements: [{ cell: { row: 0, col: 2 }, digit: 4 }],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-2',
    chapterNumber: 2,
    title: 'Hidden Singles',
    techniqueName: 'Hidden Single',
    category: 'Elementary',
    difficulty: 'Beginner',
    difficultyRating: 150,
    shortSummary: 'A digit that can only appear in one specific cell within a row, column, or box.',
    theoryMarkdown: `### What is a Hidden Single?
Unlike a Naked Single (where a *cell* has only 1 candidate), a **Hidden Single** occurs when a *digit* has only 1 available cell in an entire unit (Row, Column, or Box), even if that cell has multiple candidate notes.

It is called "hidden" because the cell might still contain notes like \`[2, 4, 7]\`, but \`7\` cannot go anywhere else in that column.

#### How to Spot It:
Scan each digit (1 through 9) one-by-one across all boxes and lines to see if any cell is the *sole possible home* for that digit.`,
    interactiveExample: {
      initialGrid: [
        [null, null, null, 2, 6, null, 7, null, 1],
        [6, 8, null, null, 7, null, null, 9, null],
        [1, 9, null, null, null, 4, 5, null, null],
        [8, 2, null, 1, null, null, null, 4, null],
        [null, null, 4, 6, null, 2, 9, null, null],
        [null, 5, null, null, null, 3, null, 2, 8],
        [null, null, 9, 3, null, null, null, 7, 4],
        [null, 4, null, null, 5, null, null, 3, 6],
        [7, null, 3, null, 1, 8, null, null, null],
      ],
      initialCandidates: [],
      proofStep: {
        technique: 'Hidden Single',
        category: 'singles',
        difficultyScore: 150,
        nudgeMessage: 'Look at Row 1 for digit 3.',
        techniqueTitle: 'Hidden Single: 3 in Row 1',
        explanation: 'In Row 1, digit 3 cannot appear in C1-C3 (Box 1 already has 3) or C6 (sees 3 below). The only spot is R1C8.',
        primaryCells: [{ row: 0, col: 7 }],
        highlightCandidates: [{ cell: { row: 0, col: 7 }, digit: 3 }],
        eliminations: [],
        placements: [{ cell: { row: 0, col: 7 }, digit: 3 }],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-3',
    chapterNumber: 3,
    title: 'Naked Pairs',
    techniqueName: 'Naked Pair',
    category: 'Subsets',
    difficulty: 'Intermediate',
    difficultyRating: 250,
    shortSummary: 'Two cells in the same unit containing only the same two candidates.',
    theoryMarkdown: `### What is a Naked Pair?
When two cells in the same row, column, or 3x3 box contain **exactly the same two candidates** (e.g. \`[3, 7]\` and \`[3, 7]\`) and no other candidates, those two digits are locked into those two cells.

Because one cell must be 3 and the other must be 7 (or vice versa), **neither 3 nor 7 can appear anywhere else in that unit**!

#### Elimination Rule:
Remove candidates \`3\` and \`7\` from all other cells in that row, column, or box.`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'Naked Pair',
        category: 'subsets',
        difficultyScore: 250,
        nudgeMessage: 'Inspect Row 3 for two cells sharing identical pair candidates.',
        techniqueTitle: 'Naked Pair: [3, 7] in Row 3',
        explanation: 'Cells R3C2 and R3C8 contain exclusively [3, 7]. Therefore, 3 and 7 are eliminated from the rest of Row 3.',
        primaryCells: [{ row: 2, col: 1 }, { row: 2, col: 7 }],
        highlightCandidates: [
          { cell: { row: 2, col: 1 }, digit: 3 },
          { cell: { row: 2, col: 1 }, digit: 7 },
          { cell: { row: 2, col: 7 }, digit: 3 },
          { cell: { row: 2, col: 7 }, digit: 7 },
        ],
        eliminations: [{ cell: { row: 2, col: 4 }, digit: 3 }],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-4',
    chapterNumber: 4,
    title: 'Pointing Pairs & Triples',
    techniqueName: 'Pointing Pair/Triple',
    category: 'Intersections',
    difficulty: 'Intermediate',
    difficultyRating: 350,
    shortSummary: 'Candidates in a box aligned on a single line eliminate that digit from the rest of the line.',
    theoryMarkdown: `### Box-to-Line Reduction (Pointing)
When all candidates for a digit within a 3x3 box are confined to a single row or column, that digit **must** be placed in that row/column inside the box.

Consequently, that digit cannot appear anywhere else along that entire row or column outside the box!`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'Pointing Pair/Triple',
        category: 'intersections',
        difficultyScore: 350,
        nudgeMessage: 'In Box 1, candidate 5 is locked into Row 2.',
        techniqueTitle: 'Pointing Pair on digit 5 in Box 1',
        explanation: 'In Box 1, digit 5 only appears in Row 2 (R2C1 and R2C2). Therefore, 5 is eliminated from R2C4, R2C7, R2C8.',
        primaryCells: [{ row: 1, col: 0 }, { row: 1, col: 1 }],
        highlightCandidates: [
          { cell: { row: 1, col: 0 }, digit: 5 },
          { cell: { row: 1, col: 1 }, digit: 5 },
        ],
        eliminations: [{ cell: { row: 1, col: 4 }, digit: 5 }],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-5',
    chapterNumber: 5,
    title: 'X-Wing',
    techniqueName: 'X-Wing',
    category: 'Wings',
    difficulty: 'Advanced',
    difficultyRating: 550,
    shortSummary: 'A 2x2 rectangular conjugate grid locking a candidate across two rows/columns.',
    theoryMarkdown: `### What is an X-Wing?
An **X-Wing** forms when a digit appears as a candidate in exactly **two cells in Row A** and exactly **two cells in Row B**, and both pairs share the **exact same two columns** (forming the corners of a rectangle).

Because one diagonal or the other must hold the digit:
- Either (Top-Left and Bottom-Right) are true, OR
- (Top-Right and Bottom-Left) are true.

In either scenario, those two columns already have their digit accounted for!

#### Elimination Rule:
Eliminate the digit from all other cells in those two columns.`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'X-Wing',
        category: 'wings',
        difficultyScore: 550,
        nudgeMessage: 'Search for candidate 7 in Rows 2 and 8.',
        techniqueTitle: 'X-Wing on digit 7 in Rows 2 and 8',
        explanation: 'Digit 7 in Rows 2 and 8 is confined to Columns 2 and 7. Thus, 7 is eliminated from the rest of Columns 2 and 7.',
        primaryCells: [
          { row: 1, col: 1 }, { row: 1, col: 6 },
          { row: 7, col: 1 }, { row: 7, col: 6 },
        ],
        laserLines: [
          { from: { row: 1, col: 1 }, to: { row: 1, col: 6 }, type: 'wing' },
          { from: { row: 7, col: 1 }, to: { row: 7, col: 6 }, type: 'wing' },
        ],
        highlightCandidates: [
          { cell: { row: 1, col: 1 }, digit: 7 },
          { cell: { row: 1, col: 6 }, digit: 7 },
          { cell: { row: 7, col: 1 }, digit: 7 },
          { cell: { row: 7, col: 6 }, digit: 7 },
        ],
        eliminations: [{ cell: { row: 4, col: 1 }, digit: 7 }],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-6',
    chapterNumber: 6,
    title: 'XY-Wing (Y-Wing)',
    techniqueName: 'XY-Wing',
    category: 'Wings',
    difficulty: 'Advanced',
    difficultyRating: 600,
    shortSummary: 'A 3-cell bivalue pivot and pincers structure eliminating shared candidates.',
    theoryMarkdown: `### The XY-Wing Structure
An **XY-Wing** consists of 3 bivalue cells:
1. **Pivot Cell**: contains candidates \`[A, B]\`
2. **Pincer 1**: sees Pivot, contains \`[A, C]\`
3. **Pincer 2**: sees Pivot, contains \`[B, C]\`

#### The Logic:
- If Pivot is \`A\`, Pincer 1 is forced to be \`C\`.
- If Pivot is \`B\`, Pincer 2 is forced to be \`C\`.

In every conceivable reality, candidate \`C\` will end up in either Pincer 1 or Pincer 2!

#### Elimination:
Any cell that simultaneously sees **both Pincer 1 and Pincer 2** can never contain \`C\`.`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'XY-Wing',
        category: 'wings',
        difficultyScore: 600,
        nudgeMessage: 'Inspect pivot R2C2 [1, 2] and pincers R2C8 [1, 9], R8C2 [2, 9].',
        techniqueTitle: 'XY-Wing on digit 9',
        explanation: 'Pivot R2C2 [1, 2] connects pincers R2C8 [1, 9] and R8C2 [2, 9]. Any cell seeing both pincers cannot be 9.',
        primaryCells: [
          { row: 1, col: 1 },
          { row: 1, col: 7 },
          { row: 7, col: 1 },
        ],
        laserLines: [
          { from: { row: 1, col: 1 }, to: { row: 1, col: 7 }, type: 'wing' },
          { from: { row: 1, col: 1 }, to: { row: 7, col: 1 }, type: 'wing' },
        ],
        highlightCandidates: [
          { cell: { row: 1, col: 1 }, digit: 1 },
          { cell: { row: 1, col: 1 }, digit: 2 },
          { cell: { row: 1, col: 7 }, digit: 1 },
          { cell: { row: 1, col: 7 }, digit: 9 },
          { cell: { row: 7, col: 1 }, digit: 2 },
          { cell: { row: 7, col: 1 }, digit: 9 },
        ],
        eliminations: [{ cell: { row: 7, col: 7 }, digit: 9 }],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-7',
    chapterNumber: 7,
    title: 'Simple Coloring (Single’s Chains)',
    techniqueName: 'Simple Coloring',
    category: 'Chains',
    difficulty: 'Master',
    difficultyRating: 800,
    shortSummary: '2-Coloring conjugate candidate pairs to expose contradictions and traps.',
    theoryMarkdown: `### Conjugate Pairs & Bipartite Graphing
When a digit appears exactly twice in a unit, those two cells form a **Conjugate Pair** (Strong Link). Exactly one is true, and one is false.

By chaining multiple conjugate pairs together across the board, we can assign alternating colors (e.g. Blue and Green) to the nodes.

#### Color Trap:
Any candidate cell outside the chain that sees **at least one Blue cell AND at least one Green cell** must see a placed digit regardless of which color is true, and is therefore eliminated!`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'Simple Coloring',
        category: 'chains',
        difficultyScore: 800,
        nudgeMessage: 'Follow the 2-color conjugate chain on digit 6.',
        techniqueTitle: 'Simple Coloring (Color Trap) on digit 6',
        explanation: 'Conjugate chain on digit 6 splits cells into alternating colors. Target cell sees both colors and is eliminated.',
        primaryCells: [{ row: 0, col: 0 }, { row: 0, col: 8 }, { row: 8, col: 8 }],
        highlightCandidates: [
          { cell: { row: 0, col: 0 }, digit: 6 },
          { cell: { row: 0, col: 8 }, digit: 6 },
          { cell: { row: 8, col: 8 }, digit: 6 },
        ],
        eliminations: [{ cell: { row: 8, col: 0 }, digit: 6 }],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
  {
    id: 'lesson-8',
    chapterNumber: 8,
    title: 'Unique Rectangles (UR Type 1)',
    techniqueName: 'Unique Rectangle',
    category: 'Uniqueness',
    difficulty: 'Master',
    difficultyRating: 850,
    shortSummary: 'Exploiting the mathematical uniqueness of Sudoku puzzles to avoid 2x2 deadly patterns.',
    theoryMarkdown: `### The Principle of Uniqueness
Every valid Sudoku puzzle has **exactly one unique solution**.

If 4 cells forming a 2x2 rectangle across 2 rows, 2 columns, and 2 boxes all contain identical pairs \`[A, B]\`, the puzzle would possess two interchangeable solutions (a deadly pattern).

To prevent this invalid state:
If 3 corners of the rectangle are already locked to \`[A, B]\`, the 4th corner **cannot** be \`A\` or \`B\`!

#### Elimination:
Remove \`A\` and \`B\` from the 4th corner cell.`,
    interactiveExample: {
      initialGrid: Array.from({ length: 9 }, () => Array(9).fill(null)),
      initialCandidates: [],
      proofStep: {
        technique: 'Unique Rectangle (Type 1)',
        category: 'uniqueness',
        difficultyScore: 850,
        nudgeMessage: 'Inspect the 2x2 rectangle between Rows 1, 3 and Cols 2, 7.',
        techniqueTitle: 'Unique Rectangle Type 1 [4, 8]',
        explanation: 'To prevent a non-unique deadly pattern, candidates 4 and 8 are eliminated from R3C7.',
        primaryCells: [
          { row: 0, col: 1 }, { row: 0, col: 6 },
          { row: 2, col: 1 }, { row: 2, col: 6 },
        ],
        highlightCandidates: [
          { cell: { row: 0, col: 1 }, digit: 4 },
          { cell: { row: 0, col: 1 }, digit: 8 },
        ],
        eliminations: [
          { cell: { row: 2, col: 6 }, digit: 4 },
          { cell: { row: 2, col: 6 }, digit: 8 },
        ],
        placements: [],
      },
    },
    practicePuzzles: [],
  },
];
