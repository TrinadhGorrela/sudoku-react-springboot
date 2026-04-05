import { storageManager } from "./storageManager";
import { GRID_SIZE } from "../constants/gameConstants";

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// ============ VALIDATION HELPERS ============
export const isValidSudokuMove = (board, row, col, value) => {
  if (value === null || value < 1 || value > GRID_SIZE) return false;

  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && board[row][c] === value) return false;
  }

  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && board[r][col] === value) return false;
  }

  const boxStride = GRID_SIZE / 3;
  const boxRow = Math.floor(row / boxStride) * boxStride;
  const boxCol = Math.floor(col / boxStride) * boxStride;

  for (let r = boxRow; r < boxRow + boxStride; r++) {
    for (let c = boxCol; c < boxCol + boxStride; c++) {
      if (r !== row && c !== col && board[r][c] === value) return false;
    }
  }

  return true;
};

// ============ LOCALSTORAGE HELPERS ============

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

  if (board && puzzle) {
    storageManager.save("sudokuBoard", board);
    storageManager.save("sudokuPuzzle", puzzle);
  }
};

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
