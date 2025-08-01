'use client';

import React, { memo, Suspense, useMemo } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { GameProvider, useGameState, useGameActions } from '../context/GameContext';
import { OptimizedGrid } from './OptimizedGrid';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';
import { AIDifficultySelector } from './AIDifficultySelector';
import { useResponsive } from '../utils/responsive';

// Loading component
const GameLoading: React.FC = memo(() => (
  <div className="flex items-center justify-center min-h-[400px] matrix-bg">
    <div className="flex flex-col items-center space-y-6">
      {/* Cyberpunk loading spinner */}
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent">
          <div className="absolute inset-0 rounded-full border-4 border-neon-cyan border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-neon-magenta border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse"></div>
        </div>
      </div>
      
      {/* Loading text with neon effect */}
      <div className="text-center space-y-2">
        <p className="text-neon-cyan font-mono text-lg tracking-wider text-shadow-neon-sm animate-neon-pulse">
          INITIALIZING GAME MATRIX...
        </p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-1 bg-neon-cyan animate-neon-pulse"></div>
          <div className="w-2 h-1 bg-neon-cyan animate-neon-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-1 bg-neon-cyan animate-neon-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  </div>
));

GameLoading.displayName = 'GameLoading';

// Optimized background particles component
const BackgroundParticles: React.FC = memo(() => {
  const { deviceType } = useResponsive();
  
  // CSS variables for animation delays to improve performance
  const particleStyles = useMemo(() => ({
    '--delay-1': '1s',
    '--delay-2': '2s', 
    '--delay-3': '3s'
  } as React.CSSProperties), []);

  // Reduce particles on mobile for better performance
  if (deviceType === 'mobile') {
    return (
      <div className="absolute inset-0 pointer-events-none" style={particleStyles}>
        {/* Only 2 particles on mobile */}
        <div 
          className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-neon-cyan rounded-full animate-neon-pulse opacity-20"
          style={{ animationDelay: 'var(--delay-1)' }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-neon-magenta rounded-full animate-neon-pulse-slow opacity-15"
          style={{ animationDelay: 'var(--delay-2)' }}
        ></div>
      </div>
    );
  }

  // Full particle set for desktop/tablet
  return (
    <div className="absolute inset-0 pointer-events-none" style={particleStyles}>
      <div 
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse opacity-30"
      ></div>
      <div 
        className="absolute top-1/3 right-1/3 w-1 h-1 bg-neon-magenta rounded-full animate-neon-pulse-fast opacity-20"
        style={{ animationDelay: 'var(--delay-2)' }}
      ></div>
      <div 
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-neon-green rounded-full animate-neon-pulse-slow opacity-25"
        style={{ animationDelay: 'var(--delay-1)' }}
      ></div>
      <div 
        className="absolute top-2/3 right-1/4 w-1 h-1 bg-neon-yellow rounded-full animate-neon-pulse opacity-30"
        style={{ animationDelay: 'var(--delay-3)' }}
      ></div>
    </div>
  );
});

BackgroundParticles.displayName = 'BackgroundParticles';

// Game mode selection component
const GameModeSelection: React.FC = memo(() => {
  const { startGame } = useGameActions();

  return (
    <div className="flex flex-col items-center space-y-8 p-8 matrix-bg">
      {/* Cyberpunk title with glitch effect */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-display font-black text-neon-cyan text-shadow-neon-lg animate-matrix-reveal tracking-widest">
          SELECT GAME MODE
        </h2>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"></div>
      </div>
      
      {/* Futuristic game mode buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => startGame('Player vs Player')}
          className="group relative px-10 py-6 neon-button text-neon-blue border-neon-blue hover:text-white transition-colors duration-300"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'box-shadow, background-image, color'
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👥</span>
            <div className="text-left">
              <div className="font-bold text-sm tracking-wider">PLAYER VS</div>
              <div className="font-bold text-lg tracking-wider">PLAYER</div>
            </div>
          </div>
          
          {/* Hologram sweep effect */}
          <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
        </button>
        
        <button
          onClick={() => startGame('Player vs IA')}
          className="group relative px-10 py-6 neon-button text-neon-magenta border-neon-magenta hover:text-white transition-colors duration-300"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'box-shadow, background-image, color'
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <div className="font-bold text-sm tracking-wider">PLAYER VS</div>
              <div className="font-bold text-lg tracking-wider">A.I.</div>
            </div>
          </div>
          
          {/* Hologram sweep effect */}
          <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
        </button>
      </div>
      
      {/* Additional cyberpunk decoration */}
      <div className="flex space-x-2 opacity-40">
        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse"></div>
        <div className="w-2 h-2 bg-neon-magenta rounded-full animate-neon-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-2 h-2 bg-neon-green rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
});

GameModeSelection.displayName = 'GameModeSelection';

// PERFORMANCE FIX: Game status display with proper memoization
const GameStatus: React.FC = memo(() => {
  const { currentPlayer, winner, canMakeMove, gameMode } = useGameState();

  // Memoize the status message to prevent recalculation
  const statusContent = useMemo(() => {
    if (winner) {
      return (
        <div className="hud-panel text-success-neon border-success-neon rounded-xl p-4 text-center animate-victory-glow">
          <div className="flex items-center justify-center space-x-3">
            <span className="text-3xl">🏆</span>
            <div>
              <div className="text-sm font-mono tracking-wider opacity-80">VICTORY</div>
              <div className="text-xl font-display font-bold text-shadow-neon-md">
                {winner} WINS!
              </div>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
        </div>
      );
    }

    if (!canMakeMove && gameMode === 'Player vs IA' && currentPlayer === 2) {
      return (
        <div className="hud-panel text-neon-magenta border-neon-magenta rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
            <div>
              <div className="text-sm font-mono tracking-wider opacity-80">A.I. PROCESSING</div>
              <div className="text-lg font-display font-semibold text-shadow-neon-sm">
                Calculating optimal move...
              </div>
            </div>
            <span className="text-xl animate-neon-pulse">🤖</span>
          </div>
        </div>
      );
    }

    const playerColor = currentPlayer === 1 ? 'neon-cyan' : 'neon-yellow';
    const playerEmoji = currentPlayer === 1 ? '🔵' : '🟡';
    const playerName = currentPlayer === 1 ? 'PLAYER 1' : 'PLAYER 2';

    return (
      <div className={`hud-panel text-${playerColor} border-${playerColor} rounded-lg p-3 text-center animate-neon-pulse-slow`}>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-2xl animate-neon-pulse">{playerEmoji}</span>
          <div>
            <div className="text-sm font-mono tracking-wider opacity-80">CURRENT TURN</div>
            <div className="text-lg font-display font-bold text-shadow-neon-sm">
              {playerName}
            </div>
          </div>
        </div>
      </div>
    );
  }, [winner, canMakeMove, gameMode, currentPlayer]);

  return statusContent;
});

GameStatus.displayName = 'GameStatus';

// Main game content component
const GameContent: React.FC = memo(() => {
  const { grid, gameMode, scores, lastMove, aiDifficulty, aiThinking } = useGameState();
  const { handleClick, changeMode, setAIDifficulty, resetGame } = useGameActions();

  if (!gameMode) {
    return <GameModeSelection />;
  }

  return (
    <div className="flex flex-col items-center space-y-4 xs:space-y-6 sm:space-y-8 w-full max-w-5xl mx-auto px-4 py-4 sm:p-6 matrix-bg min-h-screen">
      {/* Cyberpunk Header */}
      <div className="text-center space-y-3 xs:space-y-4 sm:space-y-6 py-4 xs:py-6 sm:py-8">
        <div className="relative">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-transparent bg-clip-text bg-neon-gradient-1 text-shadow-neon-intense animate-matrix-reveal tracking-wider">
            CONNECT FOUR
          </h1>
          <div className="absolute -top-2 -left-2 text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-neon-cyan opacity-20 -z-10 blur-sm">
            CONNECT FOUR
          </div>
        </div>
        
        {/* Mode indicator with HUD styling */}
        <div className="hud-panel text-neon-cyan border-neon-cyan inline-block px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 rounded-full">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-current rounded-full animate-neon-pulse"></div>
            <span className="font-mono text-xs xs:text-sm tracking-widest uppercase">
              MODE: {gameMode === 'Player vs Player' ? 'PvP' : 'PvAI'}
            </span>
            <div className="w-2 h-2 bg-current rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        
        {/* Decorative cyber lines */}
        <div className="flex justify-center space-x-4 opacity-30">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-neon-cyan"></div>
          <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse"></div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-neon-cyan"></div>
        </div>
      </div>

      {/* AI Difficulty Selector - Only show when playing against AI */}
      {gameMode === 'Player vs IA' && (
        <div className="w-full max-w-md">
          <AIDifficultySelector
            currentDifficulty={aiDifficulty}
            onDifficultyChange={setAIDifficulty}
            isAIThinking={aiThinking}
            disabled={aiThinking}
          />
        </div>
      )}

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

      {/* Cyberpunk Game Controls */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <button
          onClick={resetGame}
          className="neon-button text-neon-green border-neon-green hover:text-white group relative"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'box-shadow, color'
          }}
          aria-label="Recommencer la partie"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg group-hover:animate-bounce transition-transform duration-300">🔄</span>
            <span className="font-bold tracking-wider">RESTART GAME</span>
          </div>
          
          {/* Hologram sweep effect */}
          <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
        </button>
        
        <button
          onClick={changeMode}
          className="neon-button text-neon-orange border-neon-orange hover:text-white group relative"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            willChange: 'box-shadow, color'
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg group-hover:animate-spin transition-transform duration-300">🔄</span>
            <span className="font-bold tracking-wider">CHANGE MODE</span>
          </div>
          
          {/* Hologram sweep effect */}
          <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
        </button>
        
        {/* Reset button will be handled by GameControls when there's a winner */}
      </div>
      
      {/* Cyberpunk footer decoration */}
      <div className="flex justify-center space-x-1 opacity-20 mt-4 xs:mt-6 sm:mt-8">
        {Array.from({ length: 7 }, (_, i) => (
          <div 
            key={i}
            className="w-1 bg-neon-cyan"
            style={{ 
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
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
        <div className="min-h-screen cyber-grid relative overflow-x-hidden w-full">
          {/* Optimized animated background particles */}
          <BackgroundParticles />
          
          <div className="container mx-auto px-2 xs:px-4 relative z-10 w-full max-w-full">
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