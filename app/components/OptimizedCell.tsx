'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { CellValue } from '../types/game';

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
  // PERFORMANCE FIX: Memoize expensive style calculations
  const cellStyles = useMemo(() => {
    const baseClasses = 'w-16 h-16 rounded-full transition-all duration-300 ease-in-out focus:outline-none';
    
    let colorClasses = '';
    switch (value) {
      case 1: 
        colorClasses = 'bg-red-500 border-red-300 shadow-red-500/50';
        break;
      case 2: 
        colorClasses = 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50';
        break;
      default: 
        colorClasses = 'bg-gray-200 border-gray-400 hover:bg-gray-300';
    }

    const borderClasses = isLastMove 
      ? 'border-4 border-blue-500 ring-2 ring-blue-300'
      : 'border-2';

    const interactionClasses = isClickable 
      ? 'hover:scale-105 cursor-pointer focus:ring-2 focus:ring-blue-400' 
      : 'cursor-default';

    const shadowClasses = value !== 0 ? 'shadow-lg' : '';

    return `${baseClasses} ${colorClasses} ${borderClasses} ${interactionClasses} ${shadowClasses}`;
  }, [value, isLastMove, isClickable]);

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
    >
      {/* Inner shine effect for filled cells */}
      {value !== 0 && (
        <div className="absolute top-2 left-2 w-3 h-3 bg-white/40 rounded-full blur-sm" />
      )}
      
      {/* Last move indicator */}
      {isLastMove && (
        <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400/20" />
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