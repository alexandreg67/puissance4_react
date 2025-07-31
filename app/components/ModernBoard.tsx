'use client';

import React, { memo, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { GameProvider, useGameState, useGameActions } from '../context/GameContext';
import { OptimizedGrid } from './OptimizedGrid';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';

// Loading component
const GameLoading: React.FC = memo(() => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">Chargement du jeu...</p>
    </div>
  </div>
));

GameLoading.displayName = 'GameLoading';

// Game mode selection component
const GameModeSelection: React.FC = memo(() => {
  const { startGame } = useGameActions();

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Choisissez un mode de jeu
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => startGame('Player vs Player')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          👥 Joueur contre Joueur
        </button>
        
        <button
          onClick={() => startGame('Player vs IA')}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          🤖 Joueur contre IA
        </button>
      </div>
    </div>
  );
});

GameModeSelection.displayName = 'GameModeSelection';

// Game status display
const GameStatus: React.FC = memo(() => {
  const { currentPlayer, winner, canMakeMove, gameMode } = useGameState();

  if (winner) {
    return (
      <div className="text-2xl font-bold text-green-600 text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
        🎉 {winner} a gagné !
      </div>
    );
  }

  if (!canMakeMove && gameMode === 'Player vs IA' && currentPlayer === 2) {
    return (
      <div className="text-xl font-semibold text-purple-600 text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
        🤖 L&apos;IA réfléchit...
      </div>
    );
  }

  return (
    <div className="text-xl font-semibold text-blue-600 text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
      {currentPlayer === 1 ? '🔴' : '🟡'} Au tour du {currentPlayer === 1 ? 'Joueur 1' : 'Joueur 2'}
    </div>
  );
});

GameStatus.displayName = 'GameStatus';

// Main game content component
const GameContent: React.FC = memo(() => {
  const { grid, gameMode, scores, lastMove } = useGameState();
  const { handleClick, changeMode } = useGameActions();

  if (!gameMode) {
    return <GameModeSelection />;
  }

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          🔴 Puissance 4 🟡
        </h1>
        <p className="text-gray-600 font-medium">
          Mode: {gameMode === 'Player vs Player' ? 'Joueur vs Joueur' : 'Joueur vs IA'}
        </p>
      </div>

      {/* Score Board */}
      <ScoreBoard scores={scores} gameMode={gameMode} />

      {/* Game Status */}
      <GameStatus />

      {/* Game Grid */}
      <OptimizedGrid
        grid={grid}
        handleClick={handleClick}
        canMakeMove={true} // Will be handled by the hook logic
        lastMove={lastMove}
      />

      {/* Game Controls */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={changeMode}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-md"
        >
          🔄 Changer de Mode
        </button>
        
        {/* Reset button will be handled by GameControls when there's a winner */}
      </div>
    </div>
  );
});

GameContent.displayName = 'GameContent';

// Error fallback component
const GameErrorFallback: React.FC = memo(() => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-red-50 border-2 border-red-200 rounded-xl p-8 m-4">
    <div className="text-red-600 text-2xl font-bold mb-4">
      🚨 Erreur de jeu
    </div>
    <div className="text-red-700 mb-6 text-center max-w-md">
      Une erreur s&apos;est produite dans le jeu. Veuillez recharger la page.
    </div>
    <button
      onClick={() => window.location.reload()}
      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
    >
      Recharger
    </button>
  </div>
));

GameErrorFallback.displayName = 'GameErrorFallback';

// Main Board component with all providers
export const ModernBoard: React.FC = memo(() => {
  return (
    <ErrorBoundary fallback={<GameErrorFallback />}>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
          <div className="container mx-auto px-4">
            <Suspense fallback={<GameLoading />}>
              <GameContent />
            </Suspense>
          </div>
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
});

ModernBoard.displayName = 'ModernBoard';