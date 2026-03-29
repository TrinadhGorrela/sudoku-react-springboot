import { useState, useEffect, useCallback } from "react";
import {
  saveGameState,
  loadGameState,
  clearGameState,
} from "../utils/sudokuHelpers";
import { gameAPI } from "../services/api";

const getEmptyNotes = () => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null).map(() => []));
};

const MAX_HINTS = 3;

const useSudokuGame = (initialDifficulty = "MEDIUM") => {
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([]);
  const [puzzle, setPuzzle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorCells, setErrorCells] = useState(new Set());
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [notes, setNotes] = useState(getEmptyNotes());
  const [hintInfo, setHintInfo] = useState(null);
  const [highlightedCell, setHighlightedCell] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const saveNotesToStorage = (notesData) => {
    try {
      localStorage.setItem("sudokuNotes", JSON.stringify(notesData));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  };

  const saveHintToStorage = (hint, highlighted) => {
    try {
      if (hint && highlighted) {
        localStorage.setItem(
          "sudokuHint",
          JSON.stringify({ hint, highlighted }),
        );
      } else {
        localStorage.removeItem("sudokuHint");
      }
    } catch (error) {
      console.error("Failed to save hint to localStorage:", error);
    }
  };

  const loadHintFromStorage = () => {
    try {
      const savedHint = localStorage.getItem("sudokuHint");
      if (savedHint) {
        const { hint, highlighted } = JSON.parse(savedHint);
        return { hint, highlighted };
      }
    } catch (error) {
      console.error("Failed to load hint from localStorage:", error);
    }
    return { hint: null, highlighted: null };
  };

  const saveHintsUsedToStorage = (count) => {
    try {
      localStorage.setItem("sudokuHintsUsed", count.toString());
    } catch (error) {
      console.error("Failed to save hints used to localStorage:", error);
    }
  };

  const loadHintsUsedFromStorage = () => {
    try {
      const savedHints = localStorage.getItem("sudokuHintsUsed");
      return savedHints ? parseInt(savedHints, 10) : 0;
    } catch (error) {
      console.error("Failed to load hints used from localStorage:", error);
      return 0;
    }
  };

  const clearRelatedNotes = (rowIdx, colIdx, value) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.map((row) => row.map((cell) => [...cell]));
      for (let i = 0; i < 9; i++) {
        if (newNotes[rowIdx][i].includes(value)) {
          newNotes[rowIdx][i] = newNotes[rowIdx][i].filter((n) => n !== value);
        }
        if (newNotes[i][colIdx].includes(value)) {
          newNotes[i][colIdx] = newNotes[i][colIdx].filter((n) => n !== value);
        }
      }
      const boxRow = Math.floor(rowIdx / 3) * 3;
      const boxCol = Math.floor(colIdx / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (newNotes[r][c].includes(value)) {
            newNotes[r][c] = newNotes[r][c].filter((n) => n !== value);
          }
        }
      }
      saveNotesToStorage(newNotes);
      return newNotes;
    });
  };

  const loadGame = async (difficulty = "MEDIUM") => {
    setLoading(true);
    setError(null);
    try {
      const gameData = await gameAPI.startGame(difficulty);
      setGameId(gameData.gameId);
      setBoard(gameData.currentBoard);
      setPuzzle(gameData.puzzle);
      setMistakes(0);
      setTime(0);
      setHintsUsed(0);
      saveHintsUsedToStorage(0);
      setIsTimerRunning(true);
      setHasGameStarted(true);
      setSelected(null);
      setIsCompleted(false);
      setSolution(gameData.solution);
      const emptyNotes = getEmptyNotes();
      setNotes(emptyNotes);
      saveNotesToStorage(emptyNotes);
      setIsNoteMode(false);
      setHintInfo(null);
      setHighlightedCell(null);
      saveHintToStorage(null, null);
      saveGameState(gameData.gameId, difficulty, 0, false, gameData.currentBoard, gameData.puzzle);
    } catch (err) {
      setError("Failed to load game. Check if backend is running.");
      console.error("Error loading game:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = async (rIdx, cIdx, value) => {
    if (puzzle[rIdx][cIdx] !== null) return;
    if (!gameId) return;
    if (value !== null && (value < 1 || value > 9)) return;

    if (isNoteMode) {
      if (value !== null && board[rIdx][cIdx] === null) {
        setNotes((prevNotes) => {
          const newNotes = prevNotes.map((row) => row.map((cell) => [...cell]));
          const currentCellNotes = newNotes[rIdx][cIdx];
          if (currentCellNotes.includes(value)) {
            newNotes[rIdx][cIdx] = currentCellNotes.filter((n) => n !== value);
          } else {
            newNotes[rIdx][cIdx] = [...currentCellNotes, value].sort();
          }
          saveNotesToStorage(newNotes);
          return newNotes;
        });
      }
      return;
    }

    if (value !== null) {
      setNotes((prev) => {
        const newNotes = prev.map((row) => row.map((cell) => [...cell]));
        newNotes[rIdx][cIdx] = [];
        saveNotesToStorage(newNotes);
        return newNotes;
      });
      clearRelatedNotes(rIdx, cIdx, value);
      setHighlightedCell(null);
      setHintInfo(null);
      saveHintToStorage(null, null);
    }

    if (!hasGameStarted && value !== null) {
      setHasGameStarted(true);
      setIsTimerRunning(true);
    }

    try {
      const gameData = await gameAPI.makeMove(gameId, rIdx, cIdx, value);
      setBoard(gameData.currentBoard);
      setMistakes(gameData.mistakes || 0);
      setSolution(gameData.solution);
      saveGameState(gameData.gameId, difficulty, time, isTimerRunning, gameData.currentBoard, puzzle);
      localStorage.setItem("sudokuBoard", JSON.stringify(gameData.currentBoard));
      if (gameData.completed || gameData.mistakes >= 3) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        setHighlightedCell(null);
        setHintInfo(null);
        saveHintToStorage(null, null);
      }
    } catch (error) {
      console.error("Backend error:", error);
      try {
        const gameData = await gameAPI.getGame(gameId);
        setBoard(gameData.currentBoard);
        setMistakes(gameData.mistakes || 0);
        setSolution(gameData.solution);
      } catch (fetchError) {
        console.error("Failed to fetch game state:", fetchError);
      }
    }
  };

  const handleUndo = async () => {
    if (!gameId) return;
    try {
      const gameData = await gameAPI.undoMove(gameId);
      setBoard(gameData.currentBoard);
      setMistakes(gameData.mistakes || 0);
      setSolution(gameData.solution);
      localStorage.setItem("sudokuBoard", JSON.stringify(gameData.currentBoard));
      saveGameState(gameData.gameId, difficulty, time, isTimerRunning, gameData.currentBoard, puzzle);
      setHighlightedCell(null);
      setHintInfo(null);
      saveHintToStorage(null, null);
    } catch (error) {
      console.error("Undo failed:", error);
    }
  };

  const handleHintRequest = async () => {
    if (!isTimerRunning) {
      alert("Please resume the game to use hints.");
      return;
    }
    if (hintsUsed >= MAX_HINTS) {
      alert(`No more hints available. You've used all ${MAX_HINTS} hints for this game.`);
      return;
    }
    if (!gameId) return;

    try {
      const hintData = await gameAPI.getHint(gameId);
      if (hintData && hintData.row !== undefined && hintData.col !== undefined) {
        // Always use the locally-known solution value — corrects any wrong value from backend.
        const correctValue = solution[hintData.row][hintData.col];
        const cellKey = `${hintData.row}-${hintData.col}`;
        const newHintInfo = {
          row: hintData.row,
          col: hintData.col,
          value: correctValue,
          strategy: hintData.strategy || "Basic Strategy",
          explanation: hintData.explanation || `Try placing ${correctValue} here`,
        };
        setHighlightedCell(cellKey);
        setHintInfo(newHintInfo);
        saveHintToStorage(newHintInfo, cellKey);
        const newHintsCount = hintsUsed + 1;
        setHintsUsed(newHintsCount);
        saveHintsUsedToStorage(newHintsCount);
      }
    } catch (error) {
      console.error("Hint failed:", error);
      alert("No hints available for this puzzle.");
    }
  };

  const handleHintAccept = async () => {
    if (!hintInfo) return;
    const wasInNoteMode = isNoteMode;
    if (wasInNoteMode) {
      setIsNoteMode(false);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const { row, col, value } = hintInfo;
    setNotes((prev) => {
      const newNotes = prev.map((r) => r.map((c) => [...c]));
      newNotes[row][col] = [];
      saveNotesToStorage(newNotes);
      return newNotes;
    });
    clearRelatedNotes(row, col, value);
    try {
      const gameData = await gameAPI.makeMove(gameId, row, col, value);
      setBoard(gameData.currentBoard);
      setMistakes(gameData.mistakes || 0);
      setSolution(gameData.solution);
      saveGameState(gameData.gameId, difficulty, time, isTimerRunning, gameData.currentBoard, puzzle);
      localStorage.setItem("sudokuBoard", JSON.stringify(gameData.currentBoard));
      if (gameData.completed || gameData.mistakes >= 3) {
        setIsCompleted(true);
        setIsTimerRunning(false);
      }
    } catch (error) {
      console.error("Hint placement failed:", error);
    }
    if (wasInNoteMode) setIsNoteMode(true);
    setHighlightedCell(null);
    setHintInfo(null);
    saveHintToStorage(null, null);
  };

  const handleHintDismiss = () => {
    setHighlightedCell(null);
    setHintInfo(null);
    saveHintToStorage(null, null);
  };

  const handleNewGame = () => {
    clearGameState();
    localStorage.removeItem("sudokuNotes");
    localStorage.removeItem("sudokuHint");
    localStorage.removeItem("sudokuHintsUsed");
    loadGame(difficulty);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    clearGameState();
    localStorage.removeItem("sudokuNotes");
    localStorage.removeItem("sudokuHint");
    localStorage.removeItem("sudokuHintsUsed");
    loadGame(newDifficulty);
  };

  const handleTimerToggle = () => {
    if (loading || !gameId) return;
    setIsTimerRunning(!isTimerRunning);
  };

  const loadExistingGame = async (gameId, difficulty) => {
    try {
      const gameData = await gameAPI.getGame(gameId);
      setGameId(gameData.gameId);
      setBoard(gameData.currentBoard);
      setPuzzle(gameData.puzzle);
      setMistakes(gameData.mistakes);
      setSolution(gameData.solution);
      setIsCompleted(false);
      const savedState = loadGameState();
      if (savedState.time) setTime(savedState.time);
      if (savedState.timerRunning) setIsTimerRunning(true);
      const savedBoard = localStorage.getItem("sudokuBoard");
      if (savedBoard) setBoard(JSON.parse(savedBoard));
      const savedNotes = localStorage.getItem("sudokuNotes");
      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (e) {
          console.error("Failed to parse saved notes:", e);
          setNotes(getEmptyNotes());
        }
      } else {
        setNotes(getEmptyNotes());
      }
      setHintsUsed(loadHintsUsedFromStorage());
      const { hint, highlighted } = loadHintFromStorage();
      if (hint && highlighted) {
        const [hintRow, hintCol] = highlighted.split("-").map(Number);
        const currentValue = gameData.currentBoard[hintRow][hintCol];
        if (currentValue === null || currentValue === 0) {
          setHintInfo(hint);
          setHighlightedCell(highlighted);
        } else {
          saveHintToStorage(null, null);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to load existing game:", error);
      loadGame(difficulty || "MEDIUM");
    }
  };

  const isError = useCallback(
    (row, col) => {
      const value = board[row]?.[col];
      const correct = solution[row]?.[col];
      return value !== null && value !== undefined && value !== correct;
    },
    [board, solution],
  );

  const toggleNoteMode = () => {
    setIsNoteMode((prev) => !prev);
  };

  useEffect(() => {
    const savedGameId = localStorage.getItem("sudokuGameId");
    const savedDifficulty = localStorage.getItem("sudokuDifficulty") || "MEDIUM";
    if (savedGameId) {
      loadExistingGame(savedGameId, savedDifficulty);
      setDifficulty(savedDifficulty);
    } else {
      loadGame("MEDIUM");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isTimerRunning]);

  useEffect(() => {
    if (gameId) localStorage.setItem("sudokuTime", time.toString());
  }, [time, gameId]);

  useEffect(() => {
    if (gameId) localStorage.setItem("sudokuTimerRunning", isTimerRunning.toString());
  }, [isTimerRunning, gameId]);

  useEffect(() => {
    const errors = new Set();
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = board[row]?.[col];
        const correct = solution[row]?.[col];
        if (value !== null && value !== undefined && value !== correct) {
          errors.add(`${row}-${col}`);
        }
      }
    }
    setErrorCells(errors);
  }, [board, solution]);

  return {
    selected,
    setSelected,
    difficulty,
    mistakes,
    time,
    isTimerRunning,
    hasGameStarted,
    gameId,
    board,
    puzzle,
    loading,
    error,
    solution,
    isCompleted,
    notes,
    isNoteMode,
    hintInfo,
    highlightedCell,
    errorCells,
    hintsUsed,
    maxHints: MAX_HINTS,
    loadGame,
    handleInput,
    handleNewGame,
    handleDifficultyChange,
    handleTimerToggle,
    handleUndo,
    handleHintRequest,
    handleHintAccept,
    handleHintDismiss,
    isError,
    toggleNoteMode,
    setHintInfo,
    setHighlightedCell,
  };
};

export default useSudokuGame;
