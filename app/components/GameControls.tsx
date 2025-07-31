import React from "react";
import { GameControlsProps } from "../types/game";

const GameControls: React.FC<GameControlsProps> = ({
  winner,
  resetGame,
  setGameMode,
}) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 p-4 flex flex-col items-center z-50"
      role="dialog"
      aria-labelledby="game-result"
      aria-modal="true"
    >
      <div
        id="game-result"
        className={`text-2xl font-bold mb-4 ${
          winner === "Draw" ? "text-yellow-500" : "text-green-500"
        }`}
        aria-live="polite"
      >
        {winner === "Draw" ? "Match nul !" : `${winner} a gagné !`}
      </div>
      <div className="text-center">
        <button
          onClick={resetGame}
          className="p-2 bg-blue-500 text-white rounded-lg mr-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Recommencer la partie"
        >
          Recommencer
        </button>
        <button
          onClick={() => setGameMode(null)}
          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Retourner à la sélection de mode"
        >
          Choisir un nouveau mode
        </button>
      </div>
    </div>
  );
};

export default GameControls;
