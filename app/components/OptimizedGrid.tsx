'use client';

import React, { memo, useCallback } from 'react';
import { OptimizedCell } from './OptimizedCell';
import { Board, Position } from '../types/game';

interface OptimizedGridProps {
  grid: Board;
  handleClick: (columnIndex: number) => void;
  canMakeMove: boolean;
  lastMove?: Position | null;
}

const GridComponent: React.FC<OptimizedGridProps> = ({ 
  grid, 
  handleClick, 
  canMakeMove, 
  lastMove 
}) => {
  // Memoized click handler to prevent recreating on every render
  const handleCellClick = useCallback((columnIndex: number) => {
    if (canMakeMove) {
      handleClick(columnIndex);
    }
  }, [canMakeMove, handleClick]);

  return (
    <div className="flex flex-col items-center">
      {/* Grid container with glassmorphism effect */}
      <div 
        className="grid grid-cols-7 gap-2 p-6 bg-blue-600/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-400/30"
        role="grid"
        aria-label="Grille de jeu Puissance 4, 6 rangées et 7 colonnes"
      >
        {grid.map((row, rowIndex) =>
          row.map((cellValue, columnIndex) => {
            const isLastMove = lastMove?.row === rowIndex && lastMove?.col === columnIndex;
            
            return (
              <OptimizedCell
                key={`${rowIndex}-${columnIndex}`}
                value={cellValue}
                isClickable={canMakeMove}
                isLastMove={isLastMove}
                onClick={() => handleCellClick(columnIndex)}
                data-testid={`cell-${rowIndex}-${columnIndex}`}
              />
            );
          })
        )}
      </div>
      
      {/* Column indicators for accessibility */}
      <div className="flex gap-2 mt-2">
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className="w-16 text-center text-sm text-gray-600 font-medium"
            aria-hidden="true"
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

// PERFORMANCE FIX: Memoized grid with optimized comparison
export const OptimizedGrid = memo(GridComponent, (prevProps, nextProps) => {
  // Quick reference check first (most common case)
  if (prevProps.grid === nextProps.grid && 
      prevProps.handleClick === nextProps.handleClick &&
      prevProps.canMakeMove === nextProps.canMakeMove &&
      prevProps.lastMove === nextProps.lastMove) {
    return true;
  }

  // Compare primitive props
  if (prevProps.canMakeMove !== nextProps.canMakeMove) {
    return false;
  }

  // Compare function references (should be stable with useCallback)
  if (prevProps.handleClick !== nextProps.handleClick) {
    return false;
  }

  // Compare lastMove object
  if (prevProps.lastMove !== nextProps.lastMove) {
    if (!prevProps.lastMove || !nextProps.lastMove) {
      return false;
    }
    if (prevProps.lastMove.row !== nextProps.lastMove.row ||
        prevProps.lastMove.col !== nextProps.lastMove.col) {
      return false;
    }
  }

  // Optimized grid comparison - check dimensions first
  if (prevProps.grid.length !== nextProps.grid.length) {
    return false;
  }

  // Deep compare grid cells
  for (let i = 0; i < prevProps.grid.length; i++) {
    const prevRow = prevProps.grid[i];
    const nextRow = nextProps.grid[i];
    
    if (prevRow.length !== nextRow.length) {
      return false;
    }
    
    for (let j = 0; j < prevRow.length; j++) {
      if (prevRow[j] !== nextRow[j]) {
        return false;
      }
    }
  }

  return true;
});

OptimizedGrid.displayName = 'OptimizedGrid';