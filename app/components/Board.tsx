'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getAIManager } from '../ai/AIManager';
import Grid from './Grid';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';
import { AIDifficultySelector } from './AIDifficultySelector';
import { CellValue, GameMode, Player } from './Types';
import { AIDifficulty } from '../types/game';

const ROWS = 6;
const COLS = 7;

const Board: React.FC = () => {
	const [grid, setGrid] = useState<CellValue[][]>(
		Array.from({ length: ROWS }, () => Array(COLS).fill(null))
	);
	const [currentPlayer, setCurrentPlayer] = useState<Player>('Player 1');
	const [winner, setWinner] = useState<string | 'Draw' | null>(null);
	const [gameMode, setGameMode] = useState<GameMode | null>(null);
	const [scores, setScores] = useState({ 'Player 1': 0, 'Player 2': 0 });
	const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');
	const [isAIThinking, setIsAIThinking] = useState(false);
	const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Nettoyer le timeout lorsque le composant est démonté
	useEffect(() => {
		return () => {
			if (aiTimeoutRef.current) {
				clearTimeout(aiTimeoutRef.current);
			}
		};
	}, []);

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

		// Vérifier s'il y a un match nul APRÈS avoir joué le coup
		if (checkDraw()) {
			setWinner('Draw');
			return;
		}

		const nextPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
		setCurrentPlayer(nextPlayer);

		if (gameMode === 'Player vs IA' && nextPlayer === 'Player 2') {
			// Nettoyer le timeout précédent s'il existe
			if (aiTimeoutRef.current) {
				clearTimeout(aiTimeoutRef.current);
			}
			
			aiTimeoutRef.current = setTimeout(() => {
				jouerIA();
			}, 500);
		}
	};

	const jouerIA = async () => {
		// Vérifier si le jeu est déjà terminé
		if (winner) return;
		
		setIsAIThinking(true);
		
		try {
			const aiManager = getAIManager({ difficulty: aiDifficulty, showThinking: true, adaptiveTime: true });
			
			const gameState = {
				grid: grid.map((row) =>
					row.map((cell) => (cell === 'red' ? 1 : cell === 'yellow' ? 2 : 0))
				),
				nbLigne: ROWS,
				nbColonne: COLS,
			};
			
			const colIA = await aiManager.getLegacyMove(gameState);
			const rowIndex = jouerCase(colIA, 'Player 2');
			
			if (rowIndex === null) {
				// Colonne pleine, match nul
				setWinner('Draw');
				return;
			}
	
			if (checkWin(rowIndex, colIA, 'Player 2')) {
				setWinner('Player 2');
				setScores(prev => ({
					...prev,
					'Player 2': prev['Player 2'] + 1,
				}));
			} else if (checkDraw()) {
				setWinner('Draw');
			} else {
				setCurrentPlayer('Player 1');
			}
		} catch (error) {
			console.error('AI Error:', error);
			// Fallback: vérifier s'il reste des colonnes disponibles
			const availableColumns = [];
			for (let col = 0; col < COLS; col++) {
				if (grid[0][col] === null) {
					availableColumns.push(col);
				}
			}
			
			if (availableColumns.length > 0) {
				const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
				const rowIndex = jouerCase(randomCol, 'Player 2');
				
				if (rowIndex !== null) {
					if (checkWin(rowIndex, randomCol, 'Player 2')) {
						setWinner('Player 2');
						setScores(prev => ({
							...prev,
							'Player 2': prev['Player 2'] + 1,
						}));
					} else if (checkDraw()) {
						setWinner('Draw');
					} else {
						setCurrentPlayer('Player 1');
					}
				}
			} else {
				// Plus de colonnes disponibles, match nul
				setWinner('Draw');
			}
		} finally {
			setIsAIThinking(false);
		}
	};

	const checkWin = (row: number, col: number, player: Player): boolean => {
		const playerValue = player === 'Player 1' ? 'red' : 'yellow';
		
		// Check horizontal
		let count = 1;
		// Check left
		for (let c = col - 1; c >= 0 && grid[row][c] === playerValue; c--) count++;
		// Check right  
		for (let c = col + 1; c < COLS && grid[row][c] === playerValue; c++) count++;
		if (count >= 4) return true;
		
		// Check vertical
		count = 1;
		// Check down (no need to check up since pieces fall down)
		for (let r = row + 1; r < ROWS && grid[r][col] === playerValue; r++) count++;
		if (count >= 4) return true;
		
		// Check diagonal (top-left to bottom-right)
		count = 1;
		// Check up-left
		for (let r = row - 1, c = col - 1; r >= 0 && c >= 0 && grid[r][c] === playerValue; r--, c--) count++;
		// Check down-right
		for (let r = row + 1, c = col + 1; r < ROWS && c < COLS && grid[r][c] === playerValue; r++, c++) count++;
		if (count >= 4) return true;
		
		// Check diagonal (top-right to bottom-left)
		count = 1;
		// Check up-right
		for (let r = row - 1, c = col + 1; r >= 0 && c < COLS && grid[r][c] === playerValue; r--, c++) count++;
		// Check down-left
		for (let r = row + 1, c = col - 1; r < ROWS && c >= 0 && grid[r][c] === playerValue; r++, c--) count++;
		if (count >= 4) return true;
		
		return false;
	};

	const checkDraw = (): boolean => {
		// Vérifie si la grille est pleine (match nul)
		return grid[0].every(cell => cell !== null);
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

	const handleDifficultyChange = (difficulty: AIDifficulty) => {
		setAiDifficulty(difficulty);
		const aiManager = getAIManager();
		aiManager.setDifficulty(difficulty);
	};

	return (
		<div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 space-y-4">
			<h1 className="text-4xl font-bold text-gray-800 mt-4">Puissance 4</h1>

			{!gameMode && (
				<div className="flex flex-col items-center space-y-6">
					<h2 className="text-2xl font-semibold">Choisissez un mode de jeu</h2>
					<div className="flex flex-col space-y-4 w-full max-w-md">
						<button
							onClick={() => startGame('Player vs Player')}
							className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
						>
							Joueur contre Joueur
						</button>
						
						<div className="space-y-4">
							<button
								onClick={() => startGame('Player vs IA')}
								className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
							>
								Joueur contre IA
							</button>
							
							{/* AI Difficulty Selector */}
							<div className="bg-gray-50 p-4 rounded-lg">
								<AIDifficultySelector
									currentDifficulty={aiDifficulty}
									onDifficultyChange={handleDifficultyChange}
									disabled={false}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{gameMode && (
				<>
					<ScoreBoard scores={scores} gameMode={gameMode} />

					<div className="flex flex-col items-center w-full space-y-4">
						<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
							<button
								onClick={changeMode}
								className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
							>
								Changer de Mode
							</button>
							
							{/* AI Difficulty Selector during gameplay */}
							{gameMode === 'Player vs IA' && (
								<div className="bg-white border-2 border-gray-200 p-3 rounded-lg shadow-sm">
									<AIDifficultySelector
										currentDifficulty={aiDifficulty}
										onDifficultyChange={handleDifficultyChange}
										isAIThinking={isAIThinking}
										disabled={false}
									/>
								</div>
							)}
						</div>

						{/* AI Thinking Indicator */}
						{gameMode === 'Player vs IA' && isAIThinking && (
							<div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
								<span className="text-blue-800 font-medium">L&apos;IA réfléchit...</span>
							</div>
						)}

						{/* Current Player Indicator */}
						{gameMode && !winner && !isAIThinking && (
							<div className="bg-white border-2 border-gray-200 px-4 py-2 rounded-lg">
								<span className="font-semibold">
									Tour de: <span className={currentPlayer === 'Player 1' ? 'text-red-600' : 'text-yellow-600'}>
										{currentPlayer === 'Player 1' ? 'Joueur (Rouge)' : 
										 gameMode === 'Player vs IA' ? 'IA (Jaune)' : 'Joueur 2 (Jaune)'}
									</span>
								</span>
							</div>
						)}

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
