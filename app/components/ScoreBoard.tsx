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
	// PERFORMANCE FIX: Memoize player displays with cyberpunk styling
	const player1Display = useMemo(() => (
		<div className="hud-panel text-neon-cyan border-neon-cyan rounded-xl p-6 backdrop-blur-lg group hover:shadow-neon-md transition-all duration-300">
			<div className="flex flex-col items-center space-y-4">
				{/* Player 1 Header */}
				<div className="flex items-center space-x-3">
					<UserIcon className="h-8 w-8 text-neon-cyan animate-neon-pulse" />
					<div className="text-center">
						<div className="text-xs font-mono tracking-widest opacity-80">PLAYER</div>
						<div className="text-lg font-display font-bold text-shadow-neon-sm">ONE</div>
					</div>
				</div>
				
				{/* Score Display */}
				<div className="text-center space-y-2">
					<div className="text-3xl font-display font-black text-shadow-neon-md">
						{scores['Player 1'].toString().padStart(2, '0')}
					</div>
					<div className="text-xs font-mono tracking-wider opacity-60">VICTORIES</div>
				</div>
				
				{/* Player Avatar - Neon Cyan */}
				<div className="relative">
					<div className="w-16 h-16 rounded-full bg-gradient-radial from-neon-cyan/90 via-neon-cyan/70 to-neon-cyan/50 border-2 border-neon-cyan shadow-neon-cyan animate-neon-pulse-slow"></div>
					<div className="absolute inset-2 rounded-full bg-gradient-radial from-neon-cyan/50 to-transparent animate-neon-pulse"></div>
					{/* Circuit pattern */}
					<div className="absolute inset-0 opacity-30">
						<div className="absolute top-1/4 left-1/4 w-2 h-px bg-white"></div>
						<div className="absolute top-1/4 left-1/4 w-px h-2 bg-white"></div>
						<div className="absolute bottom-1/4 right-1/4 w-2 h-px bg-white"></div>
						<div className="absolute bottom-1/4 right-1/4 w-px h-2 bg-white"></div>
					</div>
				</div>
				
				{/* Status indicator */}
				<div className="flex items-center space-x-2 opacity-60">
					<div className="w-2 h-2 bg-success-neon rounded-full animate-neon-pulse"></div>
					<span className="text-xs font-mono tracking-wider">ONLINE</span>
				</div>
			</div>
		</div>
	), [scores]);

	const player2Display = useMemo(() => {
		const isIA = gameMode === 'Player vs IA';
		const playerColor = 'neon-magenta';
		const iconComponent = isIA 
			? <CpuChipIcon className="h-8 w-8 text-neon-magenta animate-neon-pulse" />
			: <UserGroupIcon className="h-8 w-8 text-neon-magenta animate-neon-pulse" />;
		
		return (
			<div className="hud-panel text-neon-magenta border-neon-magenta rounded-xl p-6 backdrop-blur-lg group hover:shadow-neon-md transition-all duration-300">
				<div className="flex flex-col items-center space-y-4">
					{/* Player 2 Header */}
					<div className="flex items-center space-x-3">
						{iconComponent}
						<div className="text-center">
							<div className="text-xs font-mono tracking-widest opacity-80">
								{isIA ? 'ARTIFICIAL' : 'PLAYER'}
							</div>
							<div className="text-lg font-display font-bold text-shadow-neon-sm">
								{isIA ? 'INTELLIGENCE' : 'TWO'}
							</div>
						</div>
					</div>
					
					{/* Score Display */}
					<div className="text-center space-y-2">
						<div className="text-3xl font-display font-black text-shadow-neon-md">
							{scores['Player 2'].toString().padStart(2, '0')}
						</div>
						<div className="text-xs font-mono tracking-wider opacity-60">VICTORIES</div>
					</div>
					
					{/* Player Avatar - Neon Magenta */}
					<div className="relative">
						<div className="w-16 h-16 rounded-full bg-gradient-radial from-neon-magenta/90 via-neon-magenta/70 to-neon-magenta/50 border-2 border-neon-magenta shadow-neon-magenta animate-neon-pulse-slow"></div>
						<div className="absolute inset-2 rounded-full bg-gradient-radial from-neon-magenta/50 to-transparent animate-neon-pulse"></div>
						{/* Enhanced circuit pattern for AI */}
						<div className="absolute inset-0 opacity-30">
							{isIA ? (
								<>
									<div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-neon-pulse"></div>
									<div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-neon-pulse" style={{ animationDelay: '0.5s' }}></div>
									<div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
									<div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full animate-neon-pulse" style={{ animationDelay: '1.5s' }}></div>
									<div className="absolute top-1/2 left-1/2 w-2 h-px bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
									<div className="absolute top-1/2 left-1/2 w-px h-2 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
								</>
							) : (
								<>
									<div className="absolute top-1/4 left-1/4 w-2 h-px bg-white"></div>
									<div className="absolute top-1/4 left-1/4 w-px h-2 bg-white"></div>
									<div className="absolute bottom-1/4 right-1/4 w-2 h-px bg-white"></div>
									<div className="absolute bottom-1/4 right-1/4 w-px h-2 bg-white"></div>
								</>
							)}
						</div>
					</div>
					
					{/* Status indicator */}
					<div className="flex items-center space-x-2 opacity-60">
						<div className="w-2 h-2 bg-success-neon rounded-full animate-neon-pulse"></div>
						<span className="text-xs font-mono tracking-wider">
							{isIA ? 'ACTIVE' : 'ONLINE'}
						</span>
					</div>
				</div>
			</div>
		);
	}, [gameMode, scores]);

	return (
		<div className="flex flex-col lg:flex-row justify-center items-center w-full space-y-6 lg:space-y-0 lg:space-x-8 px-4">
			{/* Battle indicator */}
			<div className="hidden lg:block order-2">
				<div className="hud-panel text-neon-green border-neon-green px-4 py-2 rounded-full opacity-60">
					<div className="flex items-center space-x-2 text-xs font-mono tracking-wider">
						<div className="w-2 h-2 bg-current rounded-full animate-neon-pulse"></div>
						<span>VS</span>
						<div className="w-2 h-2 bg-current rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
					</div>
				</div>
			</div>
			
			{/* Player 1 */}
			<div className="order-1 lg:order-1">
				{player1Display}
			</div>
			
			{/* Player 2 */}
			<div className="order-3 lg:order-3">
				{player2Display}
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
