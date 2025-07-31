import { Board, CellValue, Player, Position, GRID_ROWS, GRID_COLS, WIN_CONDITION } from '../types/game';

/**
 * Creates an empty game board
 */
export const createEmptyBoard = (): Board => {
  return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
};

/**
 * Creates a deep copy of the board
 */
export const cloneBoard = (board: Board): Board => {
  return board.map(row => [...row]);
};

/**
 * Checks if a column is valid for a move (not full)
 */
export const isValidColumn = (board: Board, col: number): boolean => {
  return col >= 0 && col < GRID_COLS && board[0][col] === 0;
};

/**
 * Gets the row where a piece would land in a given column
 */
export const getDropRow = (board: Board, col: number): number => {
  for (let row = GRID_ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      return row;
    }
  }
  return -1; // Column is full
};

/**
 * Makes a move on the board and returns the new board and position
 */
export const makeMove = (board: Board, col: number, player: Player): { newBoard: Board; position: Position } | null => {
  if (!isValidColumn(board, col)) {
    return null;
  }

  const row = getDropRow(board, col);
  if (row === -1) {
    return null;
  }

  const newBoard = cloneBoard(board);
  newBoard[row][col] = player;

  return {
    newBoard,
    position: { row, col }
  };
};

/**
 * Comprehensive win detection - eliminates code duplication
 * Checks all four directions: horizontal, vertical, and both diagonals
 */
export const checkWin = (board: Board, row: number, col: number, player: Player): boolean => {
  if (board[row][col] !== player) {
    return false;
  }

  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical  
    [1, 1],   // diagonal \
    [1, -1]   // diagonal /
  ];

  return directions.some(([deltaRow, deltaCol]) => {
    let count = 1; // Count the current piece

    // Check positive direction
    for (let i = 1; i < WIN_CONDITION; i++) {
      const newRow = row + i * deltaRow;
      const newCol = col + i * deltaCol;
      
      if (
        newRow < 0 || newRow >= GRID_ROWS ||
        newCol < 0 || newCol >= GRID_COLS ||
        board[newRow][newCol] !== player
      ) {
        break;
      }
      count++;
    }

    // Check negative direction
    for (let i = 1; i < WIN_CONDITION; i++) {
      const newRow = row - i * deltaRow;
      const newCol = col - i * deltaCol;
      
      if (
        newRow < 0 || newRow >= GRID_ROWS ||
        newCol < 0 || newCol >= GRID_COLS ||
        board[newRow][newCol] !== player
      ) {
        break;
      }
      count++;
    }

    return count >= WIN_CONDITION;
  });
};

/**
 * Checks if the board is full (draw condition)
 */
export const isBoardFull = (board: Board): boolean => {
  return board[0].every(cell => cell !== 0);
};

/**
 * Gets all valid moves (non-full columns)
 */
export const getValidMoves = (board: Board): number[] => {
  const validMoves: number[] = [];
  for (let col = 0; col < GRID_COLS; col++) {
    if (isValidColumn(board, col)) {
      validMoves.push(col);
    }
  }
  return validMoves;
};

/**
 * Simulates a move without modifying the original board
 */
export const simulateMove = (board: Board, col: number, player: Player): Board | null => {
  const result = makeMove(board, col, player);
  return result ? result.newBoard : null;
};

/**
 * Converts player representation between different formats
 */
export const convertPlayerToNumber = (player: Player): number => {
  return player === 1 ? 1 : 2;
};

export const convertNumberToPlayer = (num: number): Player => {
  return num === 1 ? 1 : 2;
};

/**
 * Gets the opponent of a given player
 */
export const getOpponent = (player: Player): Player => {
  return player === 1 ? 2 : 1;
};

/**
 * Validates board state integrity
 */
export const isValidBoardState = (board: Board): boolean => {
  // Check dimensions
  if (board.length !== GRID_ROWS || board.some(row => row.length !== GRID_COLS)) {
    return false;
  }

  // Check that pieces fall properly (no floating pieces)
  for (let col = 0; col < GRID_COLS; col++) {
    let foundEmpty = false;
    for (let row = 0; row < GRID_ROWS; row++) {
      const cell = board[row][col];
      
      // Invalid cell value
      if (cell !== 0 && cell !== 1 && cell !== 2) {
        return false;
      }
      
      // Found piece after empty space (floating piece)
      if (foundEmpty && cell !== 0) {
        return false;
      }
      
      if (cell === 0) {
        foundEmpty = true;
      }
    }
  }

  return true;
};

/**
 * Calculates game statistics
 */
export const calculateBoardStats = (board: Board) => {
  let player1Count = 0;
  let player2Count = 0;
  let emptyCount = 0;

  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 1) player1Count++;
      else if (cell === 2) player2Count++;
      else emptyCount++;
    });
  });

  return {
    player1Count,
    player2Count,
    emptyCount,
    totalMoves: player1Count + player2Count,
    boardFillPercentage: ((player1Count + player2Count) / (GRID_ROWS * GRID_COLS)) * 100
  };
};