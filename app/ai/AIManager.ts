/**
 * AI Manager - Orchestrates different AI difficulty levels
 * 
 * This manager:
 * - Handles AI difficulty switching
 * - Provides backward compatibility with existing IAGameState interface
 * - Manages AI thinking time and user experience
 * - Coordinates between old and new AI systems
 */

import { Board, AIDifficulty, AISettings } from '../types/game';
import { ConnectFourAI, AIGameState } from './ConnectFourAI';

export interface AIManagerConfig {
  difficulty: AIDifficulty;
  showThinking: boolean;
  adaptiveTime: boolean;
}

export interface AIResult {
  column: number;
  evaluation: number;
  depth: number;
  thinkingTime: number;
  nodesEvaluated?: number;
  principalVariation?: number[];
}

/**
 * AI Manager - Central hub for all AI operations
 */
export class AIManager {
  private currentAI: ConnectFourAI;
  private config: AIManagerConfig;
  private thinkingStartTime = 0;

  constructor(config: AIManagerConfig = {
    difficulty: 'medium',
    showThinking: true,
    adaptiveTime: true
  }) {
    this.config = config;
    this.currentAI = new ConnectFourAI(config.difficulty);
  }

  /**
   * Get the best move for the current position
   */
  public async getBestMove(board: Board): Promise<AIResult> {
    this.thinkingStartTime = Date.now();

    // Convert board format for AI
    const gameState: AIGameState = {
      board,
      rows: board.length,
      cols: board[0].length
    };

    try {
      // Get move from current AI
      const aiMove = this.currentAI.getBestMove(gameState);
      const thinkingTime = Date.now() - this.thinkingStartTime;

      // Add minimum thinking time for UX (except for easy mode)
      const minThinkingTime = this.getMinThinkingTime();
      if (thinkingTime < minThinkingTime) {
        await this.delay(minThinkingTime - thinkingTime);
      }

      return {
        column: aiMove.column,
        evaluation: aiMove.evaluation,
        depth: aiMove.depth,
        thinkingTime: Date.now() - this.thinkingStartTime,
        principalVariation: aiMove.pv
      };

    } catch (error) {
      console.error('AI Error:', error);
      
      // Fallback to random valid move
      const validColumns = this.getValidColumns(board);
      const randomColumn = validColumns[Math.floor(Math.random() * validColumns.length)];
      
      return {
        column: randomColumn,
        evaluation: 0,
        depth: 0,
        thinkingTime: Date.now() - this.thinkingStartTime
      };
    }
  }

  /**
   * Legacy compatibility method for existing game hook
   */
  public async getLegacyMove(iaGameState: {
    grid: number[][];
    nbLigne: number;
    nbColonne: number;
  }): Promise<number> {
    // Convert legacy format to new format
    const board: Board = iaGameState.grid.map(row => 
      row.map(cell => cell as 0 | 1 | 2)
    );

    const result = await this.getBestMove(board);
    return result.column;
  }

  /**
   * Change AI difficulty
   */
  public setDifficulty(difficulty: AIDifficulty): void {
    if (this.config.difficulty !== difficulty) {
      this.config.difficulty = difficulty;
      this.currentAI = new ConnectFourAI(difficulty);
    }
  }

  /**
   * Get current AI difficulty
   */
  public getDifficulty(): AIDifficulty {
    return this.config.difficulty;
  }

  /**
   * Get AI configuration for UI display
   */
  public getAIInfo(): {
    difficulty: AIDifficulty;
    description: string;
    maxDepth: number;
    estimatedStrength: number; // 1-10 scale
  } {
    const configs = {
      easy: {
        description: 'Casual play with occasional mistakes',
        maxDepth: 1,
        estimatedStrength: 3
      },
      medium: {
        description: 'Balanced play with tactical awareness',
        maxDepth: 3,
        estimatedStrength: 6
      },
      hard: {
        description: 'Strong tactical play with deep calculation',
        maxDepth: 5,
        estimatedStrength: 8
      },
      expert: {
        description: 'Near-perfect play with advanced strategy',
        maxDepth: 7,
        estimatedStrength: 10
      }
    };

    return {
      difficulty: this.config.difficulty,
      ...configs[this.config.difficulty]
    };
  }

  /**
   * Get difficulty display information
   */
  public static getDifficultyInfo(difficulty: AIDifficulty): {
    name: string;
    icon: string;
    color: string;
    description: string;
  } {
    const difficultyMap = {
      easy: {
        name: 'Facile',
        icon: '🟢',
        color: 'text-green-600 bg-green-100',
        description: 'Parfait pour débuter, l\'IA fait quelques erreurs'
      },
      medium: {
        name: 'Moyen',
        icon: '🟡',
        color: 'text-yellow-600 bg-yellow-100',
        description: 'Un bon challenge avec une tactique équilibrée'
      },
      hard: {
        name: 'Difficile',
        icon: '🔴',
        color: 'text-red-600 bg-red-100',
        description: 'IA forte avec analyse profonde des positions'
      },
      expert: {
        name: 'Expert',
        icon: '⚡',
        color: 'text-purple-600 bg-purple-100',
        description: 'Quasi-parfait, pour les joueurs expérimentés'
      }
    };

    return difficultyMap[difficulty];
  }

  /**
   * Check if move is valid
   */
  private getValidColumns(board: Board): number[] {
    const validColumns: number[] = [];
    for (let col = 0; col < board[0].length; col++) {
      if (board[0][col] === 0) {
        validColumns.push(col);
      }
    }
    return validColumns;
  }

  /**
   * Get minimum thinking time based on difficulty for UX
   */
  private getMinThinkingTime(): number {
    const timings = {
      easy: 300,    // Quick moves
      medium: 800,  // Moderate thinking
      hard: 1500,   // Deep thinking
      expert: 2500  // Very deep thinking
    };

    return timings[this.config.difficulty];
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<AIManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.difficulty) {
      this.currentAI = new ConnectFourAI(newConfig.difficulty);
    }
  }

  /**
   * Get performance statistics (for debugging/development)
   */
  public getStats(): {
    difficulty: AIDifficulty;
    avgThinkingTime: number;
    totalMoves: number;
  } {
    // This would typically track statistics over time
    // For now, return basic info
    return {
      difficulty: this.config.difficulty,
      avgThinkingTime: this.getMinThinkingTime(),
      totalMoves: 0
    };
  }
}

// Global AI Manager instance
let globalAIManager: AIManager | null = null;

/**
 * Get or create the global AI manager
 */
export function getAIManager(config?: AIManagerConfig): AIManager {
  if (!globalAIManager) {
    globalAIManager = new AIManager(config);
  }
  return globalAIManager;
}

/**
 * Reset the global AI manager (useful for testing)
 */
export function resetAIManager(): void {
  globalAIManager = null;
}