export type Player = 'Player 1' | 'Player 2';
export type GameMode = 'Player vs Player' | 'Player vs IA' | null;
export type CellValue = 'red' | 'yellow' | null;

export interface GameControlsProps {
  winner: string | 'Draw' | null;
  resetGame: () => void;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode | null>>;
}