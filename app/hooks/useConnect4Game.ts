import { useState, useCallback, useMemo, useEffect } from 'react';
import { Board, Player, GameState, GameMode, GameScore, Position, DEFAULT_GAME_CONFIG } from '../types/game';
import { 
  createEmptyBoard, 
  makeMove, 
  checkWin, 
  isBoardFull, 
  isValidColumn,
  getOpponent 
} from '../utils/gameLogic';

interface UseConnect4GameReturn {
  // State
  grid: Board;
  currentPlayer: Player;
  winner: string | null;
  gameMode: GameMode | null;
  scores: GameScore;
  lastMove: Position | null;
  
  // Computed values
  isGameActive: boolean;
  canMakeMove: boolean;
  isDraw: boolean;
  
  // Actions
  jouerCase: (colIndex: number, player: Player) => number | null;
  handleClick: (colIndex: number) => void;
  resetGame: () => void;
  startGame: (mode: GameMode) => void;
  changeMode: () => void;
}

const INITIAL_SCORES: GameScore = {
  'Player 1': 0,
  'Player 2': 0
};

export const useConnect4Game = (): UseConnect4GameReturn => {
  // Core game state
  const [grid, setGrid] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [scores, setScores] = useState<GameScore>(INITIAL_SCORES);
  const [lastMove, setLastMove] = useState<Position | null>(null);

  // Computed values
  const isGameActive = useMemo(() => !winner && gameMode !== null, [winner, gameMode]);
  const isDraw = useMemo(() => !winner && isBoardFull(grid), [winner, grid]);
  const canMakeMove = useMemo(() => 
    isGameActive && !isDraw && (gameMode !== 'Player vs IA' || currentPlayer === 1),
    [isGameActive, isDraw, gameMode, currentPlayer]
  );

  // Core game logic: place a token
  const jouerCase = useCallback((colIndex: number, player: Player): number | null => {
    if (!isValidColumn(grid, colIndex)) {
      return null;
    }

    const result = makeMove(grid, colIndex, player);
    if (!result) {
      return null;
    }

    const { newBoard, position } = result;
    setGrid(newBoard);
    setLastMove(position);

    // Check for win
    if (checkWin(newBoard, position.row, position.col, player)) {
      const playerName = player === 1 ? 'Player 1' : 'Player 2';
      setWinner(playerName);
      setScores(prev => ({
        ...prev,
        [playerName]: prev[playerName] + 1
      }));
    }

    return position.row;
  }, [grid]);

  // Handle click events
  const handleClick = useCallback((colIndex: number) => {
    if (!canMakeMove) return;

    const rowIndex = jouerCase(colIndex, currentPlayer);
    if (rowIndex === null) return;

    // Check if game ended
    if (winner) return;

    // Switch to next player
    const nextPlayer = getOpponent(currentPlayer);
    setCurrentPlayer(nextPlayer);

    // AI will move in useEffect if it's AI mode and AI's turn
  }, [canMakeMove, jouerCase, currentPlayer, winner]);

  // AI move effect
  useEffect(() => {
    if (
      gameMode === 'Player vs IA' &&
      currentPlayer === 2 &&
      !winner &&
      !isDraw
    ) {
      const aiMoveTimer = setTimeout(() => {
        // Import AI logic dynamically to avoid circular dependencies
        import('../components/IA').then(({ default: IA, IAGameState }) => {
          try {
            const gameState: IAGameState = {
              grid: grid.map(row => 
                row.map(cell => cell === 1 ? 1 : cell === 2 ? 2 : 0)
              ),
              nbLigne: DEFAULT_GAME_CONFIG.rows,
              nbColonne: DEFAULT_GAME_CONFIG.cols
            };

            const colIA = IA.choixColonne(gameState);
            const rowIndex = jouerCase(colIA, 2);

            if (rowIndex !== null && !winner) {
              setCurrentPlayer(1);
            }
          } catch (error) {
            console.error('AI Error:', error);
            // Fallback to random move
            const validColumns = [];
            for (let col = 0; col < DEFAULT_GAME_CONFIG.cols; col++) {
              if (isValidColumn(grid, col)) {
                validColumns.push(col);
              }
            }
            if (validColumns.length > 0) {
              const randomCol = validColumns[Math.floor(Math.random() * validColumns.length)];
              jouerCase(randomCol, 2);
              setCurrentPlayer(1);
            }
          }
        });
      }, DEFAULT_GAME_CONFIG.aiDelay);

      return () => clearTimeout(aiMoveTimer);
    }
  }, [gameMode, currentPlayer, winner, isDraw, grid, jouerCase]);

  // Game control functions
  const resetGame = useCallback(() => {
    setGrid(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setLastMove(null);
  }, []);

  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame();
    setScores(INITIAL_SCORES);
  }, [resetGame]);

  const changeMode = useCallback(() => {
    setGameMode(null);
    resetGame();
    setScores(INITIAL_SCORES);
  }, [resetGame]);

  return {
    // State
    grid,
    currentPlayer,
    winner,
    gameMode,
    scores,
    lastMove,
    
    // Computed values
    isGameActive,
    canMakeMove,
    isDraw,
    
    // Actions
    jouerCase,
    handleClick,
    resetGame,
    startGame,
    changeMode
  };
};