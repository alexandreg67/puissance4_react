'use client';

import React from 'react';

const ROWS = 6;
const COLS = 7;

type Player = 'Player 1' | 'Player 2';
type Cell = 'red' | 'yellow' | null;

const Board: React.FC = () => {
	const [grid, setGrid] = React.useState<Cell[][]>(
		Array.from({ length: ROWS }, () => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = React.useState<Player>('Player 1');

	const handleClick = (colIndex: number) => {
		const newGrid = grid.map((row) => [...row]);

		// Trouver la première cellule vide dans la colonne sélectionnée
		for (let rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
			if (!newGrid[rowIndex][colIndex]) {
				newGrid[rowIndex][colIndex] =
					currentPlayer === 'Player 1' ? 'red' : 'yellow';
				break;
			}
		}

		setGrid(newGrid);
		setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
	};

	return (
		<div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl mx-auto p-4 space-y-4 md:space-y-0">
			<div className="flex flex-col items-center space-y-2 md:space-y-4">
				<div className="text-xl font-semibold text-gray-700">Joueur 1</div>
				<div className="h-12 w-12 rounded-full bg-red-500"></div>
			</div>
			<div className="grid grid-cols-7 gap-2">
				{grid.map((row, rowIndex) => (
					<React.Fragment key={rowIndex}>
						{row.map((cell, colIndex) => (
							<div
								key={colIndex}
								className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg"
								onClick={() => handleClick(colIndex)}
							>
								{cell && (
									<div
										className={`w-12 h-12 rounded-full ${
											cell === 'red' ? 'bg-red-500' : 'bg-yellow-500'
										}`}
									></div>
								)}
							</div>
						))}
					</React.Fragment>
				))}
			</div>
			<div className="flex flex-col items-center space-y-2 md:space-y-4">
				<div className="text-xl font-semibold text-gray-700">Joueur 2</div>
				<div className="h-12 w-12 rounded-full bg-yellow-500"></div>
			</div>
		</div>
	);
};

export default Board;
