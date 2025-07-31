/**
 * Advanced Connect 4 AI System with Multiple Difficulty Levels
 * 
 * Features:
 * - Easy: Heuristic with intentional mistakes
 * - Medium: 2-ply lookahead with enhanced patterns
 * - Hard: Minimax with alpha-beta pruning (4-6 ply)
 * - Expert: Advanced minimax with opening book (6-8 ply)
 */

import { Board, CellValue, Position } from '../types/game';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface AIGameState {
  board: Board;
  rows: number;
  cols: number;
}

export interface AIMove {
  column: number;
  evaluation: number;
  depth: number;
  pv?: number[]; // Principal variation (best line)
}

export interface AIConfig {
  difficulty: AIDifficulty;
  maxDepth: number;
  mistakeRate: number;
  thinkingTime: number;
}

/**
 * Main AI Engine Class
 */
export class ConnectFourAI {
  private readonly config: AIConfig;
  private nodesEvaluated = 0;
  private startTime = 0;

  constructor(difficulty: AIDifficulty = 'medium') {
    this.config = this.getAIConfig(difficulty);
  }

  /**
   * Get the best move for the current position
   */
  public getBestMove(gameState: AIGameState): AIMove {
    this.nodesEvaluated = 0;
    this.startTime = Date.now();

    const { board } = gameState;
    const validColumns = this.getValidColumns(board);

    if (validColumns.length === 0) {
      throw new Error('No valid moves available');
    }

    switch (this.config.difficulty) {
      case 'easy':
        return this.getEasyMove(gameState);
      case 'medium':
        return this.getMediumMove(gameState);
      case 'hard':
        return this.getHardMove(gameState);
      case 'expert':
        return this.getExpertMove(gameState);
      default:
        return this.getMediumMove(gameState);
    }
  }

  /**
   * Easy AI: Enhanced heuristic with intentional mistakes
   */
  private getEasyMove(gameState: AIGameState): AIMove {
    const { board } = gameState;
    const validColumns = this.getValidColumns(board);
    
    // Check for immediate wins first (but sometimes miss them)
    if (Math.random() > 0.3) { // 70% chance to see winning moves
      for (const col of validColumns) {
        const row = this.getLowestEmptyRow(board, col);
        if (row !== -1 && this.isWinningMove(board, row, col, 2)) {
          return { column: col, evaluation: 1000, depth: 1 };
        }
      }
    }

    // Check for blocking opponent wins (but sometimes miss them)
    if (Math.random() > 0.4) { // 60% chance to see blocking moves
      for (const col of validColumns) {
        const row = this.getLowestEmptyRow(board, col);
        if (row !== -1 && this.isWinningMove(board, row, col, 1)) {
          return { column: col, evaluation: 500, depth: 1 };
        }
      }
    }

    // Use simple heuristic with some randomness
    const columnScores = validColumns.map(col => ({
      column: col,
      score: this.getSimpleColumnScore(gameState, col) + (Math.random() - 0.5) * 20
    }));

    columnScores.sort((a, b) => b.score - a.score);
    
    // Sometimes pick a random move instead of the best
    const bestIndex = Math.random() < 0.2 ? Math.floor(Math.random() * Math.min(3, columnScores.length)) : 0;
    
    return {
      column: columnScores[bestIndex].column,
      evaluation: columnScores[bestIndex].score,
      depth: 1
    };
  }

  /**
   * Medium AI: 2-ply lookahead with enhanced pattern recognition
   */
  private getMediumMove(gameState: AIGameState): AIMove {
    const { board } = gameState;
    const validColumns = this.getValidColumns(board);
    
    let bestMove: AIMove = { column: validColumns[0], evaluation: -Infinity, depth: 2 };

    for (const col of validColumns) {
      const row = this.getLowestEmptyRow(board, col);
      if (row === -1) continue;

      // Make the move
      const newBoard = this.makeMove(board, row, col, 2);
      const evaluation = this.evaluatePosition(newBoard, 1, 1, -Infinity, Infinity);
      
      if (evaluation > bestMove.evaluation) {
        bestMove = { column: col, evaluation, depth: 2 };
      }
    }

    return bestMove;
  }

  /**
   * Hard AI: Minimax with alpha-beta pruning (4-6 ply)
   */
  private getHardMove(gameState: AIGameState): AIMove {
    const { board } = gameState;
    const depth = this.config.maxDepth;
    
    const result = this.minimax(board, depth, -Infinity, Infinity, true);
    
    return {
      column: result.bestColumn,
      evaluation: result.evaluation,
      depth: depth,
      pv: result.pv
    };
  }

  /**
   * Expert AI: Advanced minimax with sophisticated evaluation
   */
  private getExpertMove(gameState: AIGameState): AIMove {
    const { board } = gameState;
    
    // Check opening book first
    const openingMove = this.getOpeningBookMove(board);
    if (openingMove !== -1) {
      return { column: openingMove, evaluation: 100, depth: 0 };
    }

    const depth = this.config.maxDepth;
    const result = this.minimax(board, depth, -Infinity, Infinity, true, true);
    
    return {
      column: result.bestColumn,
      evaluation: result.evaluation,
      depth: depth,
      pv: result.pv
    };
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private minimax(
    board: Board, 
    depth: number, 
    alpha: number, 
    beta: number, 
    isMaximizing: boolean,
    useAdvancedEval = false
  ): { evaluation: number; bestColumn: number; pv?: number[] } {
    this.nodesEvaluated++;

    const validColumns = this.getValidColumns(board);
    
    // Terminal node evaluation
    if (depth === 0 || validColumns.length === 0) {
      const evaluation = useAdvancedEval 
        ? this.evaluatePositionAdvanced(board)
        : this.evaluatePosition(board, isMaximizing ? 2 : 1, 0, alpha, beta);
      
      return { evaluation, bestColumn: -1 };
    }

    let bestColumn = validColumns[0];
    let bestEvaluation = isMaximizing ? -Infinity : Infinity;
    let principalVariation: number[] = [];

    // Order moves by center preference for better alpha-beta pruning
    const orderedColumns = this.orderMoves(validColumns, board);

    for (const col of orderedColumns) {
      const row = this.getLowestEmptyRow(board, col);
      if (row === -1) continue;

      const newBoard = this.makeMove(board, row, col, isMaximizing ? 2 : 1);
      
      // Check for immediate win
      if (this.isWinningMove(board, row, col, isMaximizing ? 2 : 1)) {
        const winValue = isMaximizing ? 10000 + depth : -10000 - depth;
        return { evaluation: winValue, bestColumn: col, pv: [col] };
      }

      const result = this.minimax(newBoard, depth - 1, alpha, beta, !isMaximizing, useAdvancedEval);
      
      if (isMaximizing) {
        if (result.evaluation > bestEvaluation) {
          bestEvaluation = result.evaluation;
          bestColumn = col;
          principalVariation = [col, ...(result.pv || [])];
        }
        alpha = Math.max(alpha, result.evaluation);
      } else {
        if (result.evaluation < bestEvaluation) {
          bestEvaluation = result.evaluation;
          bestColumn = col;
          principalVariation = [col, ...(result.pv || [])];
        }
        beta = Math.min(beta, result.evaluation);
      }

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    return { 
      evaluation: bestEvaluation, 
      bestColumn, 
      pv: principalVariation 
    };
  }

  /**
   * Enhanced position evaluation for medium/hard difficulties
   */
  private evaluatePosition(
    board: Board, 
    player: number, 
    depth: number, 
    alpha: number, 
    beta: number
  ): number {
    const opponent = player === 1 ? 2 : 1;
    
    // Check for wins
    if (this.hasWon(board, player)) return 1000 - depth;
    if (this.hasWon(board, opponent)) return -1000 + depth;
    
    let score = 0;
    
    // Center column preference
    const centerCol = Math.floor(board[0].length / 2);
    for (let row = 0; row < board.length; row++) {
      if (board[row][centerCol] === player) score += 3;
      if (board[row][centerCol] === opponent) score -= 3;
    }
    
    // Count potential winning positions
    score += this.countWinningPositions(board, player) * 2;
    score -= this.countWinningPositions(board, opponent) * 2;
    
    return score;
  }

  /**
   * Advanced position evaluation for expert difficulty
   */
  private evaluatePositionAdvanced(board: Board): number {
    let score = 0;
    
    // Check for wins
    if (this.hasWon(board, 2)) return 10000;
    if (this.hasWon(board, 1)) return -10000;
    
    // Threat analysis
    score += this.evaluateThreats(board, 2) * 10;
    score -= this.evaluateThreats(board, 1) * 10;
    
    // Positional evaluation
    score += this.evaluatePositional(board, 2);
    score -= this.evaluatePositional(board, 1);
    
    // Connectivity evaluation
    score += this.evaluateConnectivity(board, 2);
    score -= this.evaluateConnectivity(board, 1);
    
    return score;
  }

  /**
   * Get AI configuration based on difficulty
   */
  private getAIConfig(difficulty: AIDifficulty): AIConfig {
    switch (difficulty) {
      case 'easy':
        return {
          difficulty,
          maxDepth: 1,
          mistakeRate: 0.3,
          thinkingTime: 500
        };
      case 'medium':
        return {
          difficulty,
          maxDepth: 3,
          mistakeRate: 0.1,
          thinkingTime: 1000
        };
      case 'hard':
        return {
          difficulty,
          maxDepth: 5,
          mistakeRate: 0.02,
          thinkingTime: 2000
        };
      case 'expert':
        return {
          difficulty,
          maxDepth: 7,
          mistakeRate: 0,
          thinkingTime: 3000
        };
    }
  }

  // Utility methods will be implemented in the next part...
  private getValidColumns(board: Board): number[] {
    const validColumns: number[] = [];
    for (let col = 0; col < board[0].length; col++) {
      if (board[0][col] === 0) {
        validColumns.push(col);
      }
    }
    return validColumns;
  }

  private getLowestEmptyRow(board: Board, col: number): number {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][col] === 0) {
        return row;
      }
    }
    return -1;
  }

  private makeMove(board: Board, row: number, col: number, player: number): Board {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player as CellValue;
    return newBoard;
  }

  private isWinningMove(board: Board, row: number, col: number, player: number): boolean {
    const newBoard = this.makeMove(board, row, col, player);
    return this.hasWon(newBoard, player);
  }

  private hasWon(board: Board, player: number): boolean {
    // Check all directions for 4 in a row
    const rows = board.length;
    const cols = board[0].length;
    
    // Horizontal
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (board[r][c] === player && 
            board[r][c + 1] === player && 
            board[r][c + 2] === player && 
            board[r][c + 3] === player) {
          return true;
        }
      }
    }
    
    // Vertical
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === player && 
            board[r + 1][c] === player && 
            board[r + 2][c] === player && 
            board[r + 3][c] === player) {
          return true;
        }
      }
    }
    
    // Diagonal (top-left to bottom-right)
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (board[r][c] === player && 
            board[r + 1][c + 1] === player && 
            board[r + 2][c + 2] === player && 
            board[r + 3][c + 3] === player) {
          return true;
        }
      }
    }
    
    // Diagonal (top-right to bottom-left)
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 3; c < cols; c++) {
        if (board[r][c] === player && 
            board[r + 1][c - 1] === player && 
            board[r + 2][c - 2] === player && 
            board[r + 3][c - 3] === player) {
          return true;
        }
      }
    }
    
    return false;
  }

  // Placeholder methods for advanced evaluation (to be implemented)
  private getSimpleColumnScore(gameState: AIGameState, col: number): number {
    // Simple center preference
    const centerCol = Math.floor(gameState.cols / 2);
    return 10 - Math.abs(col - centerCol);
  }

  private countWinningPositions(board: Board, player: number): number {
    // Count 2-in-a-row and 3-in-a-row positions that can lead to wins
    let count = 0;
    const rows = board.length;
    const cols = board[0].length;
    
    // Check all possible 4-cell windows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Horizontal windows
        if (c <= cols - 4) {
          count += this.evaluateWindow(board, r, c, 0, 1, player);
        }
        // Vertical windows
        if (r <= rows - 4) {
          count += this.evaluateWindow(board, r, c, 1, 0, player);
        }
        // Diagonal (top-left to bottom-right) windows
        if (r <= rows - 4 && c <= cols - 4) {
          count += this.evaluateWindow(board, r, c, 1, 1, player);
        }
        // Diagonal (top-right to bottom-left) windows
        if (r <= rows - 4 && c >= 3) {
          count += this.evaluateWindow(board, r, c, 1, -1, player);
        }
      }
    }
    
    return count;
  }

  private evaluateWindow(board: Board, row: number, col: number, deltaRow: number, deltaCol: number, player: number): number {
    const opponent = player === 1 ? 2 : 1;
    let playerCount = 0;
    let opponentCount = 0;
    let empty = 0;
    
    // Check 4 consecutive cells in the given direction
    for (let i = 0; i < 4; i++) {
      const r = row + i * deltaRow;
      const c = col + i * deltaCol;
      
      if (board[r][c] === player) {
        playerCount++;
      } else if (board[r][c] === opponent) {
        opponentCount++;
      } else {
        empty++;
      }
    }
    
    // Can't win if opponent has pieces in this window
    if (opponentCount > 0) return 0;
    
    // Scoring based on player pieces in window
    if (playerCount === 3) return 50;
    if (playerCount === 2) return 10;
    if (playerCount === 1) return 1;
    
    return 0;
  }

  private evaluateThreats(board: Board, player: number): number {
    // Evaluate immediate threats and forced sequences
    let threatScore = 0;
    const rows = board.length;
    const cols = board[0].length;
    
    for (let col = 0; col < cols; col++) {
      const row = this.getLowestEmptyRow(board, col);
      if (row === -1) continue;
      
      // Check if this move creates a threat (3 in a row with one open end)
      if (this.createsThreat(board, row, col, player)) {
        threatScore += 25;
      }
      
      // Check if this move creates multiple threats
      if (this.createsMultipleThreats(board, row, col, player)) {
        threatScore += 100;
      }
    }
    
    return threatScore;
  }

  private evaluatePositional(board: Board, player: number): number {
    // Evaluate positional factors like control of center, height, etc.
    let score = 0;
    const rows = board.length;
    const cols = board[0].length;
    const centerCol = Math.floor(cols / 2);
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === player) {
          // Center columns are more valuable
          const centerDistance = Math.abs(c - centerCol);
          score += Math.max(0, 4 - centerDistance);
          
          // Lower rows are more valuable (better foundation)
          score += (rows - r);
        }
      }
    }
    
    return score;
  }

  private evaluateConnectivity(board: Board, player: number): number {
    // Evaluate piece connectivity and potential
    let connectivityScore = 0;
    const rows = board.length;
    const cols = board[0].length;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === player) {
          // Count adjacent same-color pieces
          let adjacentPieces = 0;
          const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
          ];
          
          for (const [dr, dc] of directions) {
            const newR = r + dr;
            const newC = c + dc;
            
            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
              if (board[newR][newC] === player) {
                adjacentPieces++;
              }
            }
          }
          
          connectivityScore += adjacentPieces;
        }
      }
    }
    
    return connectivityScore;
  }

  private orderMoves(validColumns: number[], board: Board): number[] {
    // Order moves for better alpha-beta pruning (center first)
    const centerCol = Math.floor(board[0].length / 2);
    return validColumns.sort((a, b) => 
      Math.abs(a - centerCol) - Math.abs(b - centerCol)
    );
  }

  private getOpeningBookMove(board: Board): number {
    // Simple opening book - prefer center
    const centerCol = Math.floor(board[0].length / 2);
    if (board[board.length - 1][centerCol] === 0) {
      return centerCol;
    }
    return -1; // No opening book move
  }

  private createsThreat(board: Board, row: number, col: number, player: number): boolean {
    // Temporarily place the piece
    const newBoard = this.makeMove(board, row, col, player);
    
    // Check if this creates 3-in-a-row with one open end
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];
    
    for (const [dr, dc] of directions) {
      if (this.hasThreeInRowWithOpenEnd(newBoard, row, col, dr, dc, player)) {
        return true;
      }
    }
    
    return false;
  }

  private createsMultipleThreats(board: Board, row: number, col: number, player: number): boolean {
    // Temporarily place the piece
    const newBoard = this.makeMove(board, row, col, player);
    
    let threatCount = 0;
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical  
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];
    
    for (const [dr, dc] of directions) {
      if (this.hasThreeInRowWithOpenEnd(newBoard, row, col, dr, dc, player)) {
        threatCount++;
      }
    }
    
    return threatCount >= 2;
  }

  private hasThreeInRowWithOpenEnd(board: Board, row: number, col: number, deltaRow: number, deltaCol: number, player: number): boolean {
    const rows = board.length;
    const cols = board[0].length;
    
    // Count consecutive pieces in both directions
    let count = 1; // Count the placed piece
    
    // Count in positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + i * deltaRow;
      const c = col + i * deltaCol;
      
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }
    
    // Count in negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - i * deltaRow;
      const c = col - i * deltaCol;
      
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }
    
    return count >= 3;
  }
}