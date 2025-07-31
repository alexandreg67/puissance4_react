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
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <CpuChipIcon className="inline-block w-4 h-4 mr-1" />
        Difficulté de l&apos;IA
      </label>

      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        disabled={disabled || isAIThinking}
        className={`
          relative w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm
          transition-all duration-200 ease-out
          ${(disabled || isAIThinking) 
            ? 'opacity-50 cursor-not-allowed bg-gray-50' 
            : 'hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer'
          }
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: isAIThinking ? 'auto' : 'box-shadow, border-color'
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Difficulté actuelle: ${currentInfo.name}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentInfo.icon}</span>
            <div>
              <div className="font-semibold text-gray-900">
                {currentInfo.name}
              </div>
              <div className="text-sm text-gray-500">
                {currentInfo.description}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isAIThinking && (
              <div className="flex items-center space-x-1">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs text-blue-600 font-medium">Réflexion...</span>
              </div>
            )}
            <ChevronDownIcon 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
          role="listbox"
          aria-label="Options de difficulté"
        >
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDifficultySelect(option.value)}
              className={`
                w-full px-4 py-3 text-left transition-colors duration-150 ease-out
                hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                ${option.value === currentDifficulty ? 'bg-blue-50' : ''}
              `}
              role="option"
              aria-selected={option.value === currentDifficulty}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {option.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </div>
                
                {option.value === currentDifficulty && (
                  <CheckIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
          ))}
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