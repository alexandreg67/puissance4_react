import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Board,
  Player,
  GameState,
  GameMode,
  GameScore,
  Position,
  DEFAULT_GAME_CONFIG,
  AIDifficulty,
  IAGameState,
} from "../types/game";
import { getAIManager, AIManager } from "../ai/AIManager";
import {
  createEmptyBoard,
  makeMove,
  checkWin,
  isBoardFull,
  isValidColumn,
  getOpponent,
} from "../utils/gameLogic";

interface UseConnect4GameReturn {
  // State
  grid: Board;
  currentPlayer: Player;
  winner: string | null;
  gameMode: GameMode | null;
  scores: GameScore;
  lastMove: Position | null;
  aiDifficulty: AIDifficulty;
  aiThinking: boolean;

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
  setAIDifficulty: (difficulty: AIDifficulty) => void;
  getAIInfo: () => {
    difficulty: AIDifficulty;
    description: string;
    maxDepth: number;
    estimatedStrength: number;
  };
}

const INITIAL_SCORES: GameScore = {
  "Player 1": 0,
  "Player 2": 0,
};

export const useConnect4Game = (): UseConnect4GameReturn => {
  // Core game state
  const [grid, setGrid] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [scores, setScores] = useState<GameScore>(INITIAL_SCORES);
  const [lastMove, setLastMove] = useState<Position | null>(null);

  // AI state
  const [aiDifficulty, setAIDifficultyState] = useState<AIDifficulty>("medium");
  const [aiThinking, setAIThinking] = useState<boolean>(false);

  // Refs to avoid infinite loops in useEffect
  const gridRef = useRef<Board>(grid);
  const aiProcessingRef = useRef<boolean>(false);
  const aiManagerRef = useRef<AIManager>(
    getAIManager({
      difficulty: aiDifficulty,
      showThinking: true,
      adaptiveTime: true,
    })
  );

  // Update ref when grid changes
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Computed values
  const isGameActive = useMemo(
    () => !winner && gameMode !== null,
    [winner, gameMode]
  );
  const isDraw = useMemo(() => !winner && isBoardFull(grid), [winner, grid]);
  const canMakeMove = useMemo(
    () =>
      isGameActive &&
      !isDraw &&
      (gameMode !== "Player vs IA" || currentPlayer === 1),
    [isGameActive, isDraw, gameMode, currentPlayer]
  );

  // Core game logic: place a token
  const jouerCase = useCallback(
    (colIndex: number, player: Player): number | null => {
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
        const playerName = player === 1 ? "Player 1" : "Player 2";
        setWinner(playerName);
        setScores((prev) => ({
          ...prev,
          [playerName]: prev[playerName] + 1,
        }));
      }

      return position.row;
    },
    [grid]
  );

  // Handle click events
  const handleClick = useCallback(
    (colIndex: number) => {
      if (!canMakeMove) return;

      const rowIndex = jouerCase(colIndex, currentPlayer);
      if (rowIndex === null) return;

      // Check if game ended
      if (winner) return;

      // Switch to next player
      const nextPlayer = getOpponent(currentPlayer);
      setCurrentPlayer(nextPlayer);

      // AI will move in useEffect if it's AI mode and AI's turn
    },
    [canMakeMove, jouerCase, currentPlayer, winner]
  );

  // AI move effect - use refs to prevent infinite loops
  useEffect(() => {
    if (
      gameMode === "Player vs IA" &&
      currentPlayer === 2 &&
      !winner &&
      !isDraw &&
      !aiProcessingRef.current
    ) {
      aiProcessingRef.current = true;
      setAIThinking(true);

      const aiMoveTimer = setTimeout(async () => {
        try {
          const currentGrid = gridRef.current;

          // Use the new AI system
          const aiResult = await aiManagerRef.current.getBestMove(currentGrid);
          const colIA = aiResult.column;

          // Make AI move using current grid from ref
          if (isValidColumn(currentGrid, colIA)) {
            const result = makeMove(currentGrid, colIA, 2);
            if (result) {
              const { newBoard, position } = result;
              setGrid(newBoard);
              setLastMove(position);

              // Check for win
              if (checkWin(newBoard, position.row, position.col, 2)) {
                setWinner("Player 2");
                setScores((prev) => ({
                  ...prev,
                  "Player 2": prev["Player 2"] + 1,
                }));
              } else {
                setCurrentPlayer(1);
              }
            }
          }
        } catch (error) {
          console.error("AI Error:", error);
          // Fallback to random move
          const currentGrid = gridRef.current;
          const validColumns = [];
          for (let col = 0; col < DEFAULT_GAME_CONFIG.cols; col++) {
            if (isValidColumn(currentGrid, col)) {
              validColumns.push(col);
            }
          }
          if (validColumns.length > 0) {
            const randomCol =
              validColumns[Math.floor(Math.random() * validColumns.length)];
            const result = makeMove(currentGrid, randomCol, 2);
            if (result) {
              setGrid(result.newBoard);
              setLastMove(result.position);
              setCurrentPlayer(1);
            }
          }
        } finally {
          aiProcessingRef.current = false;
          setAIThinking(false);
        }
      }, DEFAULT_GAME_CONFIG.aiDelay);

      return () => {
        clearTimeout(aiMoveTimer);
        aiProcessingRef.current = false;
        setAIThinking(false);
      };
    }
  }, [gameMode, currentPlayer, winner, isDraw]);

  // Update AI manager when difficulty changes
  useEffect(() => {
    aiManagerRef.current.setDifficulty(aiDifficulty);
  }, [aiDifficulty]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    const aiManager = aiManagerRef.current;
    return () => {
      // Clear any pending AI operations
      aiProcessingRef.current = false;
      setAIThinking(false);
      // Clear AI cache to prevent memory leaks
      aiManager.clearCache();
    };
  }, []);

  // Game control functions
  const resetGame = useCallback(() => {
    setGrid(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    setLastMove(null);
  }, []);

  const startGame = useCallback(
    (mode: GameMode) => {
      setGameMode(mode);
      resetGame();
      setScores(INITIAL_SCORES);
    },
    [resetGame]
  );

  const changeMode = useCallback(() => {
    setGameMode(null);
    resetGame();
    setScores(INITIAL_SCORES);
  }, [resetGame]);

  // AI methods
  const setAIDifficulty = useCallback((difficulty: AIDifficulty) => {
    setAIDifficultyState(difficulty);
    aiManagerRef.current.setDifficulty(difficulty);
    
    // Auto-restart the game when difficulty changes during active gameplay
    if (isGameActive && gameMode === "Player vs IA") {
      resetGame();
    }
  }, [isGameActive, gameMode, resetGame]);

  const getAIInfo = useCallback(() => {
    return aiManagerRef.current.getAIInfo();
  }, []);

  return {
    // State
    grid,
    currentPlayer,
    winner,
    gameMode,
    scores,
    lastMove,
    aiDifficulty,
    aiThinking,

    // Computed values
    isGameActive,
    canMakeMove,
    isDraw,

    // Actions
    jouerCase,
    handleClick,
    resetGame,
    startGame,
    changeMode,
    setAIDifficulty,
    getAIInfo,
  };
};
