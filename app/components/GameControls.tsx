import React from "react";
import { GameControlsProps } from "../types/game";

const GameControls: React.FC<GameControlsProps> = ({
  winner,
  resetGame,
  setGameMode,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 matrix-bg"
      role="dialog"
      aria-labelledby="game-result"
      aria-modal="true"
    >
      <div className="hud-panel border-neon-cyan bg-black bg-opacity-90 p-8 rounded-xl max-w-md mx-4 text-center animate-neon-pulse-slow">
        {/* Cyberpunk title */}
        <div
          id="game-result"
          className={`text-3xl font-display font-bold mb-8 tracking-wider ${
            winner === "Draw" 
              ? "text-neon-yellow text-shadow-neon-sm" 
              : "text-neon-cyan text-shadow-neon-md"
          }`}
          aria-live="polite"
        >
          {winner === "Draw" ? (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">⚡</span>
              <span>DRAW!</span>
              <span className="text-2xl">⚡</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-sm opacity-80 tracking-widest">VICTORY</div>
                <div>{winner?.toUpperCase()}</div>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          )}
        </div>
        
        {/* Cyberpunk buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
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
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg group-hover:animate-bounce transition-transform duration-300">🔄</span>
              <span className="font-bold tracking-wider">RESTART</span>
            </div>
            
            {/* Hologram sweep effect */}
            <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
          </button>
          
          <button
            onClick={() => setGameMode(null)}
            className="neon-button text-neon-orange border-neon-orange hover:text-white group relative"
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'box-shadow, color'
            }}
            aria-label="Retourner à la sélection de mode"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg group-hover:animate-spin transition-transform duration-300">⚙️</span>
              <span className="font-bold tracking-wider">NEW MODE</span>
            </div>
            
            {/* Hologram sweep effect */}
            <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded"></div>
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="flex justify-center space-x-2 mt-6 opacity-40">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-neon-cyan"></div>
          <div className="w-1 h-1 bg-neon-cyan rounded-full animate-neon-pulse"></div>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-neon-cyan"></div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
