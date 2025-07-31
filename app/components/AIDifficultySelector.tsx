'use client';

import React, { memo, useMemo } from 'react';
import { AIDifficulty } from '../types/game';
import { AIManager } from '../ai/AIManager';
import {
  CpuChipIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

interface AIDifficultySelectorProps {
  currentDifficulty: AIDifficulty;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  isAIThinking?: boolean;
  disabled?: boolean;
}

const AIDifficultySelectorComponent: React.FC<AIDifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
  isAIThinking = false,
  disabled = false
}) => {
  // Memoize difficulty options to prevent recalculation
  const difficultyOptions = useMemo(() => {
    const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
    
    return difficulties.map(difficulty => ({
      value: difficulty,
      ...AIManager.getDifficultyInfo(difficulty)
    }));
  }, []);

  // Memoize current difficulty info
  const currentInfo = useMemo(() => 
    AIManager.getDifficultyInfo(currentDifficulty), 
    [currentDifficulty]
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const handleDifficultySelect = React.useCallback((difficulty: AIDifficulty) => {
    onDifficultyChange(difficulty);
    setIsOpen(false);
  }, [onDifficultyChange]);

  const toggleDropdown = React.useCallback(() => {
    if (!disabled && !isAIThinking) {
      setIsOpen(prev => !prev);
    }
  }, [disabled, isAIThinking]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-difficulty-selector]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div 
      className="relative"
      data-difficulty-selector
    >
      {/* Cyberpunk Label */}
      <label className="block text-sm font-mono tracking-wider text-neon-cyan mb-3">
        <div className="flex items-center space-x-2">
          <CpuChipIcon className="w-5 h-5 text-neon-magenta animate-neon-pulse" />
          <span className="text-shadow-neon-sm">A.I. DIFFICULTY MATRIX</span>
        </div>
      </label>

      {/* Cyberpunk Dropdown Button */}
      <button
        onClick={toggleDropdown}
        disabled={disabled || isAIThinking}
        className={`
          hud-panel relative w-full px-6 py-4 text-left text-neon-cyan border-neon-cyan rounded-lg
          transition-all duration-300 ease-out group
          ${(disabled || isAIThinking) 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-neon-md focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 cursor-pointer hover:border-neon-cyan/80'
          }
          ${isOpen ? 'ring-2 ring-neon-cyan/50 border-neon-cyan shadow-neon-md' : ''}
        `}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: isAIThinking ? 'auto' : 'box-shadow, border-color'
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Current difficulty: ${currentInfo.name}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-3xl animate-neon-pulse-slow">{currentInfo.icon}</span>
            <div>
              <div className="font-display font-bold text-lg text-shadow-neon-sm tracking-wider">
                {currentInfo.name.toUpperCase()}
              </div>
              <div className="text-sm opacity-70 font-mono tracking-wide">
                {currentInfo.description}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAIThinking && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-neon-magenta border-t-transparent"></div>
                <span className="text-xs text-neon-magenta font-mono tracking-wider animate-neon-pulse">PROCESSING...</span>
              </div>
            )}
            <ChevronDownIcon 
              className={`h-6 w-6 text-neon-cyan/60 transition-all duration-300 group-hover:text-neon-cyan ${
                isOpen ? 'rotate-180 animate-neon-pulse' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Cyberpunk Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-3 hud-panel border-neon-cyan rounded-lg overflow-hidden animate-matrix-reveal"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
          }}
          role="listbox"
          aria-label="A.I. Difficulty Options"
        >
          {difficultyOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleDifficultySelect(option.value)}
              className={`
                w-full px-6 py-4 text-left transition-all duration-300 ease-out group relative
                hover:bg-gradient-to-r hover:from-neon-cyan/10 hover:to-transparent
                focus:outline-none focus:ring-2 focus:ring-neon-cyan/50
                ${option.value === currentDifficulty 
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/10 border-l-2 border-neon-cyan shadow-inner-sm' 
                  : 'hover:border-l-2 hover:border-neon-cyan/50'
                }
                ${index !== difficultyOptions.length - 1 ? 'border-b border-neon-cyan/20' : ''}
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              role="option"
              aria-selected={option.value === currentDifficulty}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl group-hover:animate-neon-pulse transition-all duration-300">
                    {option.icon}
                  </span>
                  <div>
                    <div className="font-display font-bold text-neon-cyan text-shadow-neon-sm tracking-wider group-hover:text-white transition-colors duration-300">
                      {option.name.toUpperCase()}
                    </div>
                    <div className="text-sm opacity-70 font-mono tracking-wide group-hover:opacity-90 transition-opacity duration-300">
                      {option.description}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {option.value === currentDifficulty && (
                    <CheckIcon className="h-6 w-6 text-success-neon animate-neon-pulse" />
                  )}
                  
                  {/* Hologram sweep effect */}
                  <div className="absolute inset-0 bg-hologram-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              </div>
            </button>
          ))}
          
          {/* Menu footer decoration */}
          <div className="px-6 py-2 border-t border-neon-cyan/20 bg-gradient-to-r from-transparent via-neon-cyan/5 to-transparent">
            <div className="flex justify-center space-x-1 opacity-40">
              <div className="w-1 h-1 bg-neon-cyan rounded-full animate-neon-pulse"></div>
              <div className="w-1 h-1 bg-neon-magenta rounded-full animate-neon-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-1 h-1 bg-neon-green rounded-full animate-neon-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Accessibility */}
      {isOpen && (
        <div className="sr-only" aria-live="polite">
          Menu de sélection de difficulté ouvert. Utilisez les flèches pour naviguer.
        </div>
      )}
    </div>
  );
};

// Memoized component with custom comparison
export const AIDifficultySelector = memo(AIDifficultySelectorComponent, (prevProps, nextProps) => {
  return (
    prevProps.currentDifficulty === nextProps.currentDifficulty &&
    prevProps.isAIThinking === nextProps.isAIThinking &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.onDifficultyChange === nextProps.onDifficultyChange
  );
});

AIDifficultySelector.displayName = 'AIDifficultySelector';