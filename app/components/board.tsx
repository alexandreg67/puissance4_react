'use client';

import React, { useState } from 'react';
import IA, { IAGameState } from './IA';
import Cell from './Cell';

const ROWS = 6;
const COLS = 7;

type Player = 'Player 1' | 'Player 2';
type CellValue = 'red' | 'yellow' | null;
type GameMode = 'Player vs Player' | 'Player vs IA';

const Board: React.FC = () => {
	const [grid, setGrid] = useState<CellValue[][]>(
		Array.from({ length: ROWS }, () => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
	const [winner, setWinner] = useState<string | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);

	const jouerCase = (colIndex: number, player: Player): number | null => {
		const newGrid = [...grid];
		let rowIndex: number | null = null;

		// Trouver la première ligne vide dans la colonne
		for (let i = ROWS - 1; i >= 0; i--) {
			if (newGrid[i][colIndex] === null) {
				newGrid[i][colIndex] = player === 'Player 1' ? 'red' : 'yellow';
				rowIndex = i;
				break;
			}
		}

		if (rowIndex !== null) {
			setGrid(newGrid);
		}

		return rowIndex;
	};

	const handleClick = (colIndex: number) => {
		// Si le jeu est terminé ou c'est au tour de l'IA, on ne fait rien
		if (winner || (gameMode === 'Player vs IA' && currentPlayer === 'Player 2'))
			return;

		const rowIndex = jouerCase(colIndex, currentPlayer);
		if (rowIndex === null) return; // Si la colonne est pleine, on ne fait rien

		if (checkWin(rowIndex, colIndex, currentPlayer)) {
			setWinner(currentPlayer);
			return;
		}

		// Changer de joueur
		const nextPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
		setCurrentPlayer(nextPlayer);

		if (gameMode === 'Player vs IA' && nextPlayer === 'Player 2') {
			setTimeout(() => {
				jouerIA();
			}, 500);
		}
	};

	const jouerIA = () => {
		const gameState: IAGameState = {
			grid: grid.map((row) =>
				row.map((cell) => (cell === 'red' ? 1 : cell === 'yellow' ? 2 : 0))
			),
			nbLigne: ROWS,
			nbColonne: COLS,
		};
		const colIA = IA.choixColonne(gameState);

		const rowIndex = jouerCase(colIA, 'Player 2');
		if (rowIndex === null) return; // Si la colonne est pleine, on ne fait rien

		if (checkWin(rowIndex, colIA, 'Player 2')) {
			setWinner('Player 2');
		} else {
			setCurrentPlayer('Player 1'); // Retour à Player 1
		}
	};

	const checkWin = (row: number, col: number, player: Player): boolean => {
		const joueur = player === 'Player 1' ? 1 : 2;
		const gameState: IAGameState = {
			grid: grid.map((row) =>
				row.map((cell) => (cell === 'red' ? 1 : cell === 'yellow' ? 2 : 0))
			),
			nbLigne: ROWS,
			nbColonne: COLS,
		};
		return IA.verifGagner(gameState, row, col, joueur);
	};

	const resetGame = () => {
		setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
		setCurrentPlayer('Player 1');
		setWinner(null);
	};

	const startGame = (mode: GameMode) => {
		setGameMode(mode);
		resetGame();
	};

	return (
		<div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-4">
			<h1 className="text-4xl font-bold text-gray-800 mt-4">Puissance 4</h1>

			{!gameMode && (
				<div className="flex flex-col items-center space-y-4">
					<h2 className="text-2xl font-semibold">Choisissez un mode de jeu</h2>
					<button
						onClick={() => startGame('Player vs Player')}
						className="p-2 bg-blue-500 text-white rounded-lg"
					>
						Joueur contre Joueur
					</button>
					<button
						onClick={() => startGame('Player vs IA')}
						className="p-2 bg-blue-500 text-white rounded-lg"
					>
						Joueur contre IA
					</button>
				</div>
			)}

			{gameMode && (
				<>
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

					<div className="flex flex-col md:flex-row justify-center items-center w-full mt-4 space-y-4 md:space-y-0 md:space-x-4">
						<div className="flex flex-col items-center space-y-2">
							<div className="text-xl font-semibold text-gray-700">
								Joueur 1
							</div>
							<div className="h-12 w-12 rounded-full bg-red-500"></div>
						</div>

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

						<div className="flex flex-col items-center space-y-2">
							<div className="text-xl font-semibold text-gray-700">
								{gameMode === 'Player vs IA' ? 'IA' : 'Joueur 2'}
							</div>
							<div className="h-12 w-12 rounded-full bg-yellow-500"></div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Board;
