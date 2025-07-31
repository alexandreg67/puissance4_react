// Core game types
export type Player = 1 | 2;
export type CellValue = 0 | Player;
export type GameState = 'playing' | 'won' | 'draw';
export type GameMode = 'Player vs Player' | 'Player vs IA';

// Board and grid types
export type Board = CellValue[][];
export type Position = { row: number; col: number };

// Game statistics
export interface GameScore {
  'Player 1': number;
  'Player 2': number;
}

// Component prop types
export interface CellProps {
  value: CellValue;
  isClickable?: boolean;
  isLastMove?: boolean;
  onClick?: () => void;
  'data-testid'?: string;
}

export interface GridProps {
  grid: Board;
  handleClick: (columnIndex: number) => void;
  lastMove?: Position | null;
}

export interface GameControlsProps {
  winner: string | null;
  resetGame: () => void;
  setGameMode: (mode: GameMode | null) => void;
}

export interface ScoreBoardProps {
  scores: GameScore;
  gameMode: GameMode;
}

// AI types
export interface IAGameState {
  grid: number[][];
  nbLigne: number;
  nbColonne: number;
}

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface AIMove {
  column: number;
  score: number;
  evaluation?: number;
  depth?: number;
  pv?: number[]; // Principal variation
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface AISettings {
  difficulty: AIDifficulty;
  thinkingTime: number;
  showThinking: boolean;
}

// Error types
export interface GameError {
  type: 'INVALID_MOVE' | 'GAME_ENDED' | 'COLUMN_FULL' | 'AI_ERROR';
  message: string;
  columnIndex?: number;
}

// Constants
export const GRID_ROWS = 6;
export const GRID_COLS = 7;
export const WIN_CONDITION = 4;

// Game configuration
export interface GameConfig {
  rows: number;
  cols: number;
  winCondition: number;
  aiDelay: number;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  rows: GRID_ROWS,
  cols: GRID_COLS,
  winCondition: WIN_CONDITION,
  aiDelay: 500
};