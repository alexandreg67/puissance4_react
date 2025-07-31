'use client';

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useConnect4Game } from '../hooks/useConnect4Game';
import { Board, Player, GameMode, GameScore, Position } from '../types/game';

interface GameContextType {
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

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const gameState = useConnect4Game();

  // CRITICAL FIX: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    grid: gameState.grid,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    gameMode: gameState.gameMode,
    scores: gameState.scores,
    lastMove: gameState.lastMove,
    isGameActive: gameState.isGameActive,
    canMakeMove: gameState.canMakeMove,
    isDraw: gameState.isDraw,
    jouerCase: gameState.jouerCase,
    handleClick: gameState.handleClick,
    resetGame: gameState.resetGame,
    startGame: gameState.startGame,
    changeMode: gameState.changeMode
  }), [
    gameState.grid,
    gameState.currentPlayer,
    gameState.winner,
    gameState.gameMode,
    gameState.scores,
    gameState.lastMove,
    gameState.isGameActive,
    gameState.canMakeMove,
    gameState.isDraw,
    gameState.jouerCase,
    gameState.handleClick,
    gameState.resetGame,
    gameState.startGame,
    gameState.changeMode
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  
  return context;
};

// Additional hook for accessing specific parts of the game state
export const useGameState = () => {
  const { grid, currentPlayer, winner, gameMode, scores, lastMove, isGameActive, canMakeMove, isDraw } = useGameContext();
  
  return {
    grid,
    currentPlayer,
    winner,
    gameMode,
    scores,
    lastMove,
    isGameActive,
    canMakeMove,
    isDraw
  };
};

export const useGameActions = () => {
  const { jouerCase, handleClick, resetGame, startGame, changeMode } = useGameContext();
  
  return {
    jouerCase,
    handleClick,
    resetGame,
    startGame,
    changeMode
  };
};