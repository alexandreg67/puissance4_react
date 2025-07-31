import React, { memo, useMemo } from 'react';
import { GameMode } from './Types';
import {
	UserIcon,
	UserGroupIcon,
	CpuChipIcon,
} from '@heroicons/react/24/solid';

type ScoreBoardProps = {
	scores: { 'Player 1': number; 'Player 2': number };
	gameMode: GameMode;
};

const ScoreBoardComponent: React.FC<ScoreBoardProps> = ({ scores, gameMode }) => {
	// PERFORMANCE FIX: Memoize player 2 display to prevent recalculation
	const player2Display = useMemo(() => {
		if (gameMode === 'Player vs IA') {
			return (
				<>
					<CpuChipIcon className="h-6 w-6 text-yellow-500 mr-2" />
					IA: {scores['Player 2']}
				</>
			);
		}
		
		return (
			<>
				<UserGroupIcon className="h-6 w-6 text-yellow-500 mr-2" />
				Joueur 2 : {scores['Player 2']}
			</>
		);
	}, [gameMode, scores]);

	return (
		<div className="flex flex-col md:flex-row justify-between items-center w-full space-y-4 md:space-y-0 md:space-x-4">
			<div className="flex flex-col items-center space-y-2">
				<div className="flex items-center text-xl font-semibold text-gray-700">
					<UserIcon className="h-6 w-6 text-red-500 mr-2" />
					Joueur 1 : {scores['Player 1']}
				</div>
				<div className="h-12 w-12 rounded-full bg-red-500"></div>
			</div>

			<div className="flex flex-col items-center space-y-2">
				<div className="flex items-center text-xl font-semibold text-gray-700">
					{player2Display}
				</div>
				<div className="h-12 w-12 rounded-full bg-yellow-500"></div>
			</div>
		</div>
	);
};

// PERFORMANCE FIX: Memoize ScoreBoard component
const ScoreBoard = memo(ScoreBoardComponent, (prevProps, nextProps) => {
	return (
		prevProps.scores['Player 1'] === nextProps.scores['Player 1'] &&
		prevProps.scores['Player 2'] === nextProps.scores['Player 2'] &&
		prevProps.gameMode === nextProps.gameMode
	);
});

export default ScoreBoard;
