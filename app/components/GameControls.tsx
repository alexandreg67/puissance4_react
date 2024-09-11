import React from 'react';

export type GameMode = 'Player vs Player' | 'Player vs IA';

type GameControlsProps = {
	winner: string;
	resetGame: () => void;
	setGameMode: React.Dispatch<React.SetStateAction<GameMode | null>>;
};

const GameControls: React.FC<GameControlsProps> = ({
	winner,
	resetGame,
	setGameMode,
}) => {
	return (
		<div className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 p-4 flex flex-col items-center z-50">
			<div className="text-2xl font-bold text-green-500 mb-4">
				{winner} a gagné !
			</div>
			<div className="text-center">
				<button
					onClick={resetGame}
					className="p-2 bg-blue-500 text-white rounded-lg mr-4"
				>
					Recommencer
				</button>
				<button
					onClick={() => setGameMode(null)}
					className="p-2 bg-red-500 text-white rounded-lg"
				>
					Choisir un nouveau mode
				</button>
			</div>
		</div>
	);
};

export default GameControls;
