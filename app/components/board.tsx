'use client';

import React, { useState, useEffect } from 'react';
import Cell from './Cell';

const ROWS = 6;
const COLS = 7;

type Player = 'Player 1' | 'Player 2';
type CellValue = 'red' | 'yellow' | null;

const Board: React.FC = () => {
	const [grid, setGrid] = useState<CellValue[][]>(
		Array.from({ length: ROWS }, () => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
	const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(
		null
	);
	const [winner, setWinner] = useState<string | null>(null);

	const handleClick = (colIndex: number) => {
		if (winner) return; // Arrêter le jeu si nous avons un gagnant

		const newGrid = [...grid];
		let rowIndex;

		for (rowIndex = ROWS - 1; rowIndex >= 0; rowIndex--) {
			if (newGrid[rowIndex][colIndex] === null) {
				newGrid[rowIndex][colIndex] =
					currentPlayer === 'Player 1' ? 'red' : 'yellow';
				break;
			}
		}

		setGrid(newGrid);
		setLastMove({ row: rowIndex, col: colIndex });
		setCurrentPlayer(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
	};

	useEffect(() => {
		if (lastMove) {
			const playerColor = grid[lastMove.row][lastMove.col];
			if (checkWin(grid, playerColor)) {
				setWinner(currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1');
			}
		}
	}, [lastMove]);

	const checkWin = (grid: CellValue[][], player: CellValue): boolean => {
		const directions = [
			{ x: 0, y: 1 }, // Vertical
			{ x: 1, y: 0 }, // Horizontal
			{ x: 1, y: 1 }, // Diagonale descendante
			{ x: 1, y: -1 }, // Diagonale montante
		];

		for (let row = 0; row < ROWS; row++) {
			for (let col = 0; col < COLS; col++) {
				if (grid[row][col] === player) {
					for (let { x, y } of directions) {
						let win = true;
						for (let i = 1; i < 4; i++) {
							const newRow = row + i * y;
							const newCol = col + i * x;
							if (
								newRow < 0 ||
								newRow >= ROWS ||
								newCol < 0 ||
								newCol >= COLS ||
								grid[newRow][newCol] !== player
							) {
								win = false;
								break;
							}
						}
						if (win) return true;
					}
				}
			}
		}
		return false;
	};

	const resetGame = () => {
		setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
		setCurrentPlayer('Player 1');
		setLastMove(null);
		setWinner(null);
	};

	return (
		<div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-4">
			{/* Titre du jeu */}
			<h1 className="text-4xl font-bold text-gray-800 mt-4">Puissance 4</h1>

			{/* Message de victoire et bouton, superposés */}
			{winner && (
				<div className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 p-4 flex flex-col items-center z-50">
					<div className="text-2xl font-bold text-green-500 mb-4">
						{winner} a gagné !
					</div>
					<button
						onClick={resetGame}
						className="p-2 bg-blue-500 text-white rounded-lg"
					>
						Recommencer le jeu
					</button>
				</div>
			)}

			{/* Tableau de jeu avec affichage des joueurs */}
			<div className="flex flex-col md:flex-row justify-center items-center w-full mt-4 space-y-4 md:space-y-0 md:space-x-4">
				{/* Joueur 1 */}
				<div className="flex flex-col items-center space-y-2">
					<div className="text-xl font-semibold text-gray-700">Joueur 1</div>
					<div className="h-12 w-12 rounded-full bg-red-500"></div>
				</div>

				{/* Tableau de jeu */}
				<div className="grid grid-cols-7 gap-2">
					{grid.map((row, rowIndex) => (
						<React.Fragment key={rowIndex}>
							{row.map((cell, colIndex) => (
								<div key={colIndex} onClick={() => handleClick(colIndex)}>
									<Cell color={cell} />
								</div>
							))}
						</React.Fragment>
					))}
				</div>

				{/* Joueur 2 */}
				<div className="flex flex-col items-center space-y-2">
					<div className="text-xl font-semibold text-gray-700">Joueur 2</div>
					<div className="h-12 w-12 rounded-full bg-yellow-500"></div>
				</div>
			</div>
		</div>
	);
};

export default Board;
