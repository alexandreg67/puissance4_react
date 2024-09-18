'use client';

import React, { useState } from 'react';
import IA, { IAGameState } from './IA';
import Grid from './Grid';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';
import { CellValue, GameMode, Player } from './Types';

const ROWS = 6;
const COLS = 7;

const Board: React.FC = () => {
	const [grid, setGrid] = useState<CellValue[][]>(
		Array.from({ length: ROWS }, () => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
	const [winner, setWinner] = useState<string | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [scores, setScores] = useState({ 'Player 1': 0, 'Player 2': 0 });

	const jouerCase = (colIndex: number, player: Player): number | null => {
		const newGrid = [...grid];
		let rowIndex: number | null = null;

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
		if (winner || (gameMode === 'Player vs IA' && currentPlayer === 'Player 2'))
			return;

		const rowIndex = jouerCase(colIndex, currentPlayer);
		if (rowIndex === null) return;

		if (checkWin(rowIndex, colIndex, currentPlayer)) {
			setWinner(currentPlayer);
			setScores({
				...scores,
				[currentPlayer]: scores[currentPlayer] + 1,
			});
			return;
		}

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
		if (rowIndex === null) return;

		if (checkWin(rowIndex, colIA, 'Player 2')) {
			setWinner('Player 2');
			setScores({
				...scores,
				'Player 2': scores['Player 2'] + 1,
			});
		} else {
			setCurrentPlayer('Player 1');
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
		setScores({ 'Player 1': 0, 'Player 2': 0 });
	};

	const changeMode = () => {
		setGameMode(null);
		resetGame();
		setScores({ 'Player 1': 0, 'Player 2': 0 });
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
					<ScoreBoard scores={scores} gameMode={gameMode} />

					<div className="flex flex-col items-center w-full space-y-4">
						<button
							onClick={changeMode}
							className="p-2 bg-red-500 text-white rounded-lg"
						>
							Changer de Mode
						</button>

						<Grid grid={grid} handleClick={handleClick} />
					</div>

					{winner && (
						<GameControls
							winner={winner}
							resetGame={resetGame}
							setGameMode={setGameMode}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default Board;
