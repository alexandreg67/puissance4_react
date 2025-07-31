'use client';

import React, { memo } from 'react';
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
  const getCellColor = () => {
    switch (value) {
      case 1: return 'bg-red-500 border-red-300 shadow-red-500/50';
      case 2: return 'bg-yellow-500 border-yellow-300 shadow-yellow-500/50';
      default: return 'bg-gray-200 border-gray-400 hover:bg-gray-300';
    }
  };

  const getCellBorder = () => {
    if (isLastMove) {
      return 'border-4 border-blue-500 ring-2 ring-blue-300';
    }
    return 'border-2';
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      className={`
        w-16 h-16 rounded-full transition-all duration-300 ease-in-out
        ${getCellColor()} 
        ${getCellBorder()}
        ${isClickable ? 'hover:scale-105 cursor-pointer focus:ring-2 focus:ring-blue-400' : 'cursor-default'}
        ${value !== 0 ? 'shadow-lg' : ''}
        focus:outline-none
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={!isClickable}
      data-testid={testId}
      aria-label={`Cell ${value === 0 ? 'empty' : `occupied by player ${value}`}${isLastMove ? ', last move' : ''}`}
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