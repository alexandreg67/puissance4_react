'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { CellValue } from '../types/game';
import { useResponsive, getGridConfig, getAnimationConfig, getInteractionConfig } from '../utils/responsive';

interface OptimizedCellProps {
  value: CellValue;
  isClickable?: boolean;
  isLastMove?: boolean;
  onClick?: () => void;
  'data-testid'?: string;
}

const CellComponent: React.FC<OptimizedCellProps> = ({ 
  value, 
  isClickable = false, 
  isLastMove = false,
  onClick,
  'data-testid': testId
}) => {
  // RESPONSIVE: Get device-specific configurations
  const { deviceType, windowSize } = useResponsive();
  const gridConfig = getGridConfig(deviceType, windowSize.width);
  const animationConfig = getAnimationConfig(deviceType);
  const interactionConfig = getInteractionConfig(deviceType);

  // PERFORMANCE FIX: Memoize expensive style calculations with cyberpunk theme
  const cellStyles = useMemo(() => {
    // Use minimal borders on mobile to save space and reduce visual clutter
    const borderClass = deviceType === 'mobile' ? 'border' : 'border-2';
    const baseClasses = `relative ${gridConfig.cellSize} rounded-full ${borderClass} focus:outline-none overflow-hidden ${interactionConfig.tapTargetSize}`;
    
    // GPU ACCELERATION FIX: Enhanced hardware acceleration for neon effects
    const performanceClasses = `transform-gpu will-change-transform backface-visibility-hidden transition-all ${animationConfig.transitionDuration} ease-out`;
    
    let colorClasses = '';
    let hoverClasses = '';
    let neonEffect = '';
    
    switch (value) {
      case 1: 
        // Player 1: Neon Cyan pieces with energy core (reduced glow on mobile)
        const glowIntensity1 = deviceType === 'mobile' && windowSize.width < 428 ? 'shadow-lg' : animationConfig.glowIntensity;
        colorClasses = `bg-gradient-radial from-neon-cyan/90 via-neon-cyan/70 to-neon-cyan/50 border-neon-cyan ${glowIntensity1}`;
        hoverClasses = isClickable && interactionConfig.hoverEffects ? `hover:${glowIntensity1} hover:border-neon-cyan/80` : '';
        neonEffect = 'neon-cyan';
        break;
      case 2: 
        // Player 2: Neon Magenta pieces with energy core (reduced glow on mobile)
        const glowIntensity2 = deviceType === 'mobile' && windowSize.width < 428 ? 'shadow-lg' : animationConfig.glowIntensity;
        colorClasses = `bg-gradient-radial from-neon-magenta/90 via-neon-magenta/70 to-neon-magenta/50 border-neon-magenta ${glowIntensity2}`;
        hoverClasses = isClickable && interactionConfig.hoverEffects ? `hover:${glowIntensity2} hover:border-neon-magenta/80` : '';
        neonEffect = 'neon-magenta';
        break;
      default: 
        // Empty cells: Cyberpunk grid holes with subtle glow
        colorClasses = 'bg-gradient-radial from-cyber-metal/30 via-cyber-obsidian/50 to-cyber-space border-neon-cyan/20';
        hoverClasses = isClickable && interactionConfig.hoverEffects ? 'hover:border-neon-cyan/60 hover:shadow-neon-sm hover:bg-gradient-radial hover:from-neon-cyan/10 hover:via-cyber-obsidian/60 hover:to-cyber-space' : '';
        neonEffect = 'empty';
    }

    // Last move gets special victory glow effect
    const lastMoveClasses = isLastMove 
      ? 'ring-4 ring-success-neon/50 animate-victory-glow border-success-neon shadow-neon-xl'
      : '';

    // Enhanced interaction classes with neon feedback (responsive)
    const interactionClasses = isClickable 
      ? `cursor-pointer ${interactionConfig.focusRing} ${interactionConfig.hoverEffects ? 'hover:scale-105' : ''} ${interactionConfig.touchFeedback ? 'active:scale-95' : ''}` 
      : 'cursor-default';

    // Prevent overflow on mobile with box constraints and border-box sizing
    const containerClasses = deviceType === 'mobile' ? 'max-w-full flex-shrink-0 box-border' : 'box-border';

    return `${baseClasses} ${performanceClasses} ${colorClasses} ${lastMoveClasses} ${interactionClasses} ${hoverClasses} ${containerClasses}`;
  }, [value, isLastMove, isClickable, gridConfig, animationConfig, interactionConfig, deviceType, windowSize.width]);

  // PERFORMANCE FIX: Memoize aria-label to prevent string recalculation
  const ariaLabel = useMemo(() => {
    const cellState = value === 0 ? 'empty' : `occupied by player ${value}`;
    const lastMoveIndicator = isLastMove ? ', last move' : '';
    return `Cell ${cellState}${lastMoveIndicator}`;
  }, [value, isLastMove]);

  // PERFORMANCE FIX: Memoize click handler
  const handleClick = useCallback(() => {
    if (isClickable && onClick) {
      onClick();
    }
  }, [isClickable, onClick]);

  // PERFORMANCE FIX: Memoize keyboard handler  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }, [isClickable, handleClick]);

  return (
    <button
      className={cellStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={!isClickable}
      data-testid={testId}
      aria-label={ariaLabel}
      tabIndex={isClickable ? 0 : -1}
      style={{
        // CRITICAL GPU ACCELERATION: Force hardware layer creation
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Optimize hover performance for neon effects
        willChange: isClickable ? 'transform, box-shadow, border-color' : 'auto',
        // Prevent overflow on mobile
        ...(deviceType === 'mobile' && {
          boxSizing: 'border-box',
          maxWidth: '100%',
          flexShrink: 0
        })
      }}
    >
      {/* Energy core effect for filled cells */}
      {value !== 0 && (
        <>
          {/* Central energy core */}
          <div 
            className={`absolute inset-2 rounded-full ${animationConfig.enableComplexAnimations ? 'animate-neon-pulse' : 'animate-pulse'}`}
            style={{
              background: value === 1 
                ? 'radial-gradient(circle, rgba(0, 255, 255, 0.8) 0%, rgba(0, 255, 255, 0.3) 50%, transparent 100%)'
                : 'radial-gradient(circle, rgba(255, 0, 255, 0.8) 0%, rgba(255, 0, 255, 0.3) 50%, transparent 100%)',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Holographic shine effect */}
          <div 
            className="absolute top-2 left-2 w-4 h-4 rounded-full animate-hologram opacity-60"
            style={{
              background: `linear-gradient(45deg, 
                rgba(255, 255, 255, 0.8) 0%, 
                ${value === 1 ? 'rgba(0, 255, 255, 0.4)' : 'rgba(255, 0, 255, 0.4)'} 50%, 
                transparent 100%)`,
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-px bg-white"></div>
            <div className="absolute top-1/4 left-1/4 w-px h-2 bg-white"></div>
            <div className="absolute bottom-1/4 right-1/4 w-2 h-px bg-white"></div>
            <div className="absolute bottom-1/4 right-1/4 w-px h-2 bg-white"></div>
          </div>
        </>
      )}
      
      {/* Empty cell grid pattern */}
      {value === 0 && (
        <div className="absolute inset-0 opacity-30">
          {/* Cross pattern for empty cells */}
          <div className="absolute top-1/2 left-2 right-2 h-px bg-neon-cyan/20 transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-2 bottom-2 w-px bg-neon-cyan/20 transform -translate-x-1/2"></div>
          
          {/* Corner dots */}
          <div className="absolute top-2 left-2 w-1 h-1 bg-neon-cyan/30 rounded-full"></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-neon-cyan/30 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-neon-cyan/30 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-neon-cyan/30 rounded-full"></div>
        </div>
      )}
      
      {/* Last move victory indicator */}
      {isLastMove && (
        <>
          {/* Pulsing victory ring */}
          <div 
            className="absolute -inset-1 rounded-full animate-victory-glow border-2 border-success-neon opacity-80"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
          
          {/* Victory particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-success-neon rounded-full animate-neon-pulse transform -translate-x-1/2 -translate-y-2"></div>
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-success-neon rounded-full animate-neon-pulse transform -translate-x-1/2 translate-y-2" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute left-0 top-1/2 w-1 h-1 bg-success-neon rounded-full animate-neon-pulse transform -translate-x-2 -translate-y-1/2" style={{ animationDelay: '0.25s' }}></div>
            <div className="absolute right-0 top-1/2 w-1 h-1 bg-success-neon rounded-full animate-neon-pulse transform translate-x-2 -translate-y-1/2" style={{ animationDelay: '0.75s' }}></div>
          </div>
        </>
      )}
      
      {/* Hover interaction feedback */}
      {isClickable && value === 0 && (
        <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-30 transition-opacity duration-200 bg-gradient-radial from-neon-cyan/20 to-transparent pointer-events-none"></div>
      )}
    </button>
  );
};

// Memoized component with custom comparison
export const OptimizedCell = memo(CellComponent, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isClickable === nextProps.isClickable &&
    prevProps.isLastMove === nextProps.isLastMove &&
    prevProps.onClick === nextProps.onClick
  );
});

OptimizedCell.displayName = 'OptimizedCell';