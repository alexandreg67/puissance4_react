'use client';

import React, { memo, useCallback } from 'react';
import { OptimizedCell } from './OptimizedCell';
import { Board, Position } from '../types/game';
import { useResponsive, getGridConfig, getSpacingConfig } from '../utils/responsive';

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
  // RESPONSIVE: Get device-specific configurations
  const { deviceType, windowSize } = useResponsive();
  const gridConfig = getGridConfig(deviceType, windowSize.width);
  const spacingConfig = getSpacingConfig(deviceType, windowSize.width);
  
  // Memoized click handler to prevent recreating on every render
  const handleCellClick = useCallback((columnIndex: number) => {
    if (canMakeMove) {
      handleClick(columnIndex);
    }
  }, [canMakeMove, handleClick]);

  return (
    <div className={`flex flex-col items-center ${spacingConfig.sectionSpacing}`}>
      {/* Cyberpunk Grid Container */}
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute -inset-4 bg-neon-gradient-1 opacity-20 blur-xl rounded-3xl animate-neon-pulse-slow"></div>
        
        {/* Main grid with advanced glassmorphism */}
        <div 
          className={`relative grid grid-cols-7 ${gridConfig.gap} ${gridConfig.gridPadding} backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-neon-cyan/30 overflow-hidden`}
          style={{
            background: `
              linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 255, 0.05) 100%),
              rgba(10, 10, 10, 0.8)
            `,
            boxShadow: `
              0 0 30px rgba(0, 255, 255, 0.3),
              0 0 60px rgba(255, 0, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `
          }}
          role="grid"
          aria-label="Grille de jeu Connect Four cyberpunk, 6 rangées et 7 colonnes"
        >
          {/* Grid scanning lines effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent"
              style={{
                top: '25%',
                animation: 'hologram-sweep 4s linear infinite'
              }}
            ></div>
            <div 
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/20 to-transparent"
              style={{
                top: '75%',
                animation: 'hologram-sweep 6s linear infinite reverse'
              }}
            ></div>
          </div>

          {/* Corner accent lights */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan opacity-60"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-neon-cyan opacity-60"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-neon-magenta opacity-60"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-neon-magenta opacity-60"></div>

          {/* Game cells with enhanced styling */}
          {grid.map((row, rowIndex) =>
            row.map((cellValue, columnIndex) => {
              const isLastMove = lastMove?.row === rowIndex && lastMove?.col === columnIndex;
              
              return (
                <div
                  key={`cell-wrapper-${rowIndex}-${columnIndex}`}
                  className="relative transform-gpu will-change-transform"
                  style={{
                    filter: isLastMove ? 'drop-shadow(0 0 15px currentColor)' : 'none'
                  }}
                >
                  <OptimizedCell
                    key={`${rowIndex}-${columnIndex}`}
                    value={cellValue}
                    isClickable={canMakeMove}
                    isLastMove={isLastMove}
                    onClick={() => handleCellClick(columnIndex)}
                    data-testid={`cell-${rowIndex}-${columnIndex}`}
                  />
                </div>
              );
            })
          )}

          {/* Grid power indicators */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-success-neon rounded-full animate-neon-pulse opacity-60"></div>
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-neon-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-neon-magenta rounded-full animate-neon-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Futuristic Column Indicators */}
      <div className={`flex ${gridConfig.gap}`}>
        {Array.from({ length: 7 }, (_, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 group"
          >
            {/* Column number with neon styling */}
            <div className="hud-panel text-neon-cyan border-neon-cyan px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
              COL_{index + 1}
            </div>
            
            {/* Drop zone indicator */}
            <div className="w-4 h-1 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-neon-pulse"></div>
          </div>
        ))}
      </div>

      {/* Grid status display */}
      <div className="hud-panel text-neon-cyan border-neon-cyan px-6 py-2 rounded-full opacity-40">
        <div className="flex items-center space-x-3 text-xs font-mono tracking-wider">
          <div className="w-2 h-2 bg-current rounded-full animate-neon-pulse"></div>
          <span>GRID MATRIX ACTIVE</span>
          <div className="w-2 h-2 bg-current rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
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