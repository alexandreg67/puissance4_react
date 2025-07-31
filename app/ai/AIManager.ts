/**
 * AI Manager - Orchestrates different AI difficulty levels
 *
 * This manager:
 * - Handles AI difficulty switching
 * - Provides backward compatibility with existing IAGameState interface
 * - Manages AI thinking time and user experience
 * - Coordinates between old and new AI systems
 */

import { Board, AIDifficulty, AISettings } from "../types/game";
import { ConnectFourAI, AIGameState } from "./ConnectFourAI";

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

  constructor(
    config: AIManagerConfig = {
      difficulty: "medium",
      showThinking: true,
      adaptiveTime: true,
    }
  ) {
    this.config = config;
    this.currentAI = new ConnectFourAI(config.difficulty);
  }

  /**
   * Get the best move for the current position
   */
  public async getBestMove(board: Board): Promise<AIResult> {
    this.thinkingStartTime = Date.now();

    // Add input validation
    if (!board || board.length === 0 || board[0].length === 0) {
      throw new Error("Invalid board state provided to AI");
    }

    // Validate board dimensions
    if (board.length !== 6 || board[0].length !== 7) {
      throw new Error(
        `Invalid board dimensions: ${board.length}x${board[0].length}. Expected 6x7.`
      );
    }

    // Validate board content
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = board[row][col];
        if (cell !== 0 && cell !== 1 && cell !== 2) {
          throw new Error(
            `Invalid cell value ${cell} at position [${row}, ${col}]. Expected 0, 1, or 2.`
          );
        }
      }
    }

    const gameState: AIGameState = {
      board,
      rows: board.length,
      cols: board[0].length,
    };

    try {
      const aiMove = this.currentAI.getBestMove(gameState);

      // Validate AI response
      if (aiMove.column < 0 || aiMove.column >= board[0].length) {
        throw new Error(
          `AI returned invalid column: ${
            aiMove.column
          }. Must be between 0 and ${board[0].length - 1}.`
        );
      }

      // Check if the column is actually playable
      if (board[0][aiMove.column] !== 0) {
        throw new Error(`AI returned full column: ${aiMove.column}`);
      }

      const thinkingTime = Date.now() - this.thinkingStartTime;
      const minThinkingTime = this.getMinThinkingTime();

      if (thinkingTime < minThinkingTime) {
        await this.delay(minThinkingTime - thinkingTime);
      }

      return {
        column: aiMove.column,
        evaluation: aiMove.evaluation,
        depth: aiMove.depth,
        thinkingTime: Date.now() - this.thinkingStartTime,
        principalVariation: aiMove.pv,
      };
    } catch (error) {
      console.error("AI Error:", error);

      // Enhanced fallback with validation
      const validColumns = this.getValidColumns(board);
      if (validColumns.length === 0) {
        throw new Error("No valid moves available - game should have ended");
      }

      const randomColumn =
        validColumns[Math.floor(Math.random() * validColumns.length)];

      return {
        column: randomColumn,
        evaluation: 0,
        depth: 0,
        thinkingTime: Date.now() - this.thinkingStartTime,
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
    const board: Board = iaGameState.grid.map((row) =>
      row.map((cell) => cell as 0 | 1 | 2)
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
        description: "Casual play with occasional mistakes",
        maxDepth: 1,
        estimatedStrength: 3,
      },
      medium: {
        description: "Balanced play with tactical awareness",
        maxDepth: 3,
        estimatedStrength: 6,
      },
      hard: {
        description: "Strong tactical play with deep calculation",
        maxDepth: 5,
        estimatedStrength: 8,
      },
      expert: {
        description: "Near-perfect play with advanced strategy",
        maxDepth: 7,
        estimatedStrength: 10,
      },
    };

    return {
      difficulty: this.config.difficulty,
      ...configs[this.config.difficulty],
    };
  }

  /**
   * Clear AI cache to prevent memory leaks
   */
  public clearCache(): void {
    this.currentAI.clearCache();
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
        name: "Facile",
        icon: "🟢",
        color: "text-green-600 bg-green-100",
        description: "Parfait pour débuter, l'IA fait quelques erreurs",
      },
      medium: {
        name: "Moyen",
        icon: "🟡",
        color: "text-yellow-600 bg-yellow-100",
        description: "Un bon challenge avec une tactique équilibrée",
      },
      hard: {
        name: "Difficile",
        icon: "🔴",
        color: "text-red-600 bg-red-100",
        description: "IA forte avec analyse profonde des positions",
      },
      expert: {
        name: "Expert",
        icon: "⚡",
        color: "text-purple-600 bg-purple-100",
        description: "Quasi-parfait, pour les joueurs expérimentés",
      },
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
      easy: 300, // Quick moves
      medium: 800, // Moderate thinking
      hard: 1500, // Deep thinking
      expert: 2500, // Very deep thinking
    };

    return timings[this.config.difficulty];
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
      totalMoves: 0,
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
