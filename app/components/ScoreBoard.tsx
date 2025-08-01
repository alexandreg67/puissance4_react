import React, { memo, useMemo } from 'react';
import { GameMode } from '../types/game';
import { useResponsive, getLayoutConfig, getSpacingConfig, getTextConfig } from '../utils/responsive';
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
	// RESPONSIVE: Get device-specific configurations
	const { deviceType, windowSize } = useResponsive();
	const layoutConfig = getLayoutConfig(deviceType);
	const spacingConfig = getSpacingConfig(deviceType, windowSize.width);
	const textConfig = getTextConfig(deviceType, windowSize.width);

	// Get responsive panel width for uniform sizing
	const getPanelWidth = useMemo(() => {
		switch(deviceType) {
			case 'mobile': return 'w-64 min-w-64 max-w-64';
			case 'tablet': return 'w-72 min-w-72 max-w-72';
			case 'desktop': return 'w-80 min-w-80 max-w-80';
			default: return 'w-72 min-w-72 max-w-72';
		}
	}, [deviceType]);

	// PERFORMANCE FIX: Memoize player displays with cyberpunk styling
	const player1Display = useMemo(() => (
		<div className={`hud-panel text-neon-cyan border-neon-cyan rounded-xl ${spacingConfig.cardPadding} ${getPanelWidth} backdrop-blur-lg group hover:shadow-neon-md transition-all duration-300`}>
			<div className="flex flex-col items-center space-y-4">
				{/* Player 1 Header */}
				<div className="flex items-center space-x-3">
					<UserIcon className="h-8 w-8 text-neon-cyan animate-neon-pulse" />
					<div className="text-center">
						<div className="text-xs font-mono tracking-widest opacity-80">PLAYER</div>
						<div className={`${textConfig.body} font-display font-bold text-shadow-neon-sm`}>ONE</div>
					</div>
				</div>
				
				{/* Score Display */}
				<div className="text-center space-y-2">
					<div className={`${textConfig.subtitle} font-display font-black text-shadow-neon-md`}>
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
	), [scores, spacingConfig.cardPadding, textConfig.body, textConfig.subtitle, getPanelWidth]);

	const player2Display = useMemo(() => {
		const isIA = gameMode === 'Player vs IA';
		const playerColor = 'neon-magenta';
		const iconComponent = isIA 
			? <CpuChipIcon className="h-8 w-8 text-neon-magenta animate-neon-pulse" />
			: <UserGroupIcon className="h-8 w-8 text-neon-magenta animate-neon-pulse" />;
		
		return (
			<div className={`hud-panel text-neon-magenta border-neon-magenta rounded-xl ${spacingConfig.cardPadding} ${getPanelWidth} backdrop-blur-lg group hover:shadow-neon-md transition-all duration-300`}>
				<div className="flex flex-col items-center space-y-4">
					{/* Player 2 Header */}
					<div className="flex items-center space-x-3">
						{iconComponent}
						<div className="text-center">
							<div className="text-xs font-mono tracking-widest opacity-80">
								{isIA ? 'ARTIFICIAL' : 'PLAYER'}
							</div>
							<div className={`${textConfig.body} font-display font-bold text-shadow-neon-sm`}>
								{isIA ? 'INTELLIGENCE' : 'TWO'}
							</div>
						</div>
					</div>
					
					{/* Score Display */}
					<div className="text-center space-y-2">
						<div className={`${textConfig.subtitle} font-display font-black text-shadow-neon-md`}>
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
	}, [gameMode, scores, spacingConfig.cardPadding, textConfig.body, textConfig.subtitle, getPanelWidth]);

	return (
		<div className={`${deviceType === 'mobile' ? layoutConfig.scoreboardLayout : 'grid grid-cols-3 gap-8'} items-center w-full ${spacingConfig.containerPadding}`}>
			{/* Player 1 */}
			<div className={`${deviceType === 'mobile' ? 'order-1' : 'justify-self-end'}`}>
				{player1Display}
			</div>
			
			{/* Battle indicator - VS */}
			<div className={`${deviceType === 'mobile' ? 'hidden' : 'justify-self-center'}`}>
				<div className="hud-panel text-neon-green border-neon-green px-4 py-2 rounded-full opacity-60">
					<div className="flex items-center space-x-2 text-xs font-mono tracking-wider">
						<div className="w-2 h-2 bg-current rounded-full animate-neon-pulse"></div>
						<span>VS</span>
						<div className="w-2 h-2 bg-current rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
					</div>
				</div>
			</div>
			
			{/* Player 2 */}
			<div className={`${deviceType === 'mobile' ? 'order-3' : 'justify-self-start'}`}>
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
