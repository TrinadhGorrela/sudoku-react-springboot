import { storageManager } from "./storageManager";

// ============ VALIDATION HELPERS ============

/**
 * Check if a cell contains a wrong value by comparing with solution
 */
export const isCellWrong = (board, solution, row, col) => {
  if (!board || !solution || board.length === 0 || solution.length === 0) {
    return false;
  }

  if (row < 0 || row >= 9 || col < 0 || col >= 9) return false;
  if (!board[row] || !solution[row]) return false;

  const userValue = board[row][col];
  const correctValue = solution[row][col];

  // Return false for empty cells or prefilled cells
  if (
    userValue === null ||
    userValue === undefined ||
    userValue === correctValue
  ) {
    return false;
  }

  // Only return true if user entered a wrong value
  return userValue !== correctValue;
};
/**
 * Format time in seconds to MM:SS
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Validate if a move follows Sudoku rules (without solution)
 */
export const isValidSudokuMove = (board, row, col, value) => {
  if (value === null || value < 1 || value > 9) return false;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (r !== row && c !== col && board[r][c] === value) return false;
    }
  }

  return true;
};

// ============ LOCALSTORAGE HELPERS ============

/**
 * Save game state to localStorage
 */
export const saveGameState = (
  gameId,
  difficulty,
  time,
  timerRunning,
  board,
  puzzle,
) => {
  storageManager.save("sudokuGameId", gameId);
  storageManager.save("sudokuDifficulty", difficulty);
  storageManager.save("sudokuTime", time);
  storageManager.save("sudokuTimerRunning", timerRunning);

  // Optional: Save board state for quick restore
  if (board && puzzle) {
    storageManager.save("sudokuBoard", board);
    storageManager.save("sudokuPuzzle", puzzle);
  }
};

/**
 * Load game state from localStorage
 */
export const loadGameState = () => {
  return {
    gameId: storageManager.load("sudokuGameId", null),
    difficulty: storageManager.load("sudokuDifficulty", "MEDIUM"),
    time: storageManager.load("sudokuTime", 0),
    timerRunning: storageManager.load("sudokuTimerRunning", false),
    board: storageManager.load("sudokuBoard", null),
    puzzle: storageManager.load("sudokuPuzzle", null),
  };
};

/**
 * Clear all game-related localStorage
 */
export const clearGameState = () => {
  const keys = [
    "sudokuGameId",
    "sudokuDifficulty",
    "sudokuTime",
    "sudokuTimerRunning",
    "sudokuBoard",
    "sudokuPuzzle",
  ];

  keys.forEach((key) => storageManager.remove(key));
};
