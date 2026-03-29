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
    .map(() =>
      Array(9)
        .fill(null)
        .map(() => []),
    );
};

// ⭐ NEW: Maximum hints allowed per game
const MAX_HINTS = 3;

const useSudokuGame = (initialDifficulty = "MEDIUM") => {
  // ============ STATE VARIABLES ============
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

  // ============ HELPER FUNCTIONS ============

  // Save notes to localStorage
  const saveNotesToStorage = (notesData) => {
    try {
      localStorage.setItem("sudokuNotes", JSON.stringify(notesData));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  };

  // Save hint state to localStorage
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

  // Load hint state from localStorage
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

  // ⭐ NEW: Save hints used count to localStorage
  const saveHintsUsedToStorage = (count) => {
    try {
      localStorage.setItem("sudokuHintsUsed", count.toString());
    } catch (error) {
      console.error("Failed to save hints used to localStorage:", error);
    }
  };

  // ⭐ NEW: Load hints used count from localStorage
  const loadHintsUsedFromStorage = () => {
    try {
      const savedHints = localStorage.getItem("sudokuHintsUsed");
      return savedHints ? parseInt(savedHints, 10) : 0;
    } catch (error) {
      console.error("Failed to load hints used from localStorage:", error);
      return 0;
    }
  };

  // ⭐ NEW: Generate notes for a specific cell based on solution
  const generateNotesForCell = (
    rowIdx,
    colIdx,
    currentBoard,
    solutionBoard,
  ) => {
    // If cell already has a value, no notes needed
    if (
      currentBoard[rowIdx][colIdx] !== null &&
      currentBoard[rowIdx][colIdx] !== 0
    ) {
      return [];
    }

    const possibleNumbers = [];

    // Check which numbers are valid for this cell
    for (let num = 1; num <= 9; num++) {
      let isValid = true;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (currentBoard[rowIdx][c] === num) {
          isValid = false;
          break;
        }
      }

      if (!isValid) continue;

      // Check column
      for (let r = 0; r < 9; r++) {
        if (currentBoard[r][colIdx] === num) {
          isValid = false;
          break;
        }
      }

      if (!isValid) continue;

      // Check 3x3 box
      const boxRow = Math.floor(rowIdx / 3) * 3;
      const boxCol = Math.floor(colIdx / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (currentBoard[r][c] === num) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }

      if (isValid) {
        possibleNumbers.push(num);
      }
    }

    return possibleNumbers;
  };

  // Clear notes in related cells when a number is placed
  const clearRelatedNotes = (rowIdx, colIdx, value) => {
    setNotes((prevNotes) => {
      const newNotes = prevNotes.map((row) => row.map((cell) => [...cell]));

      // Clear the specific value from all related cells
      for (let i = 0; i < 9; i++) {
        // Same row
        if (newNotes[rowIdx][i].includes(value)) {
          newNotes[rowIdx][i] = newNotes[rowIdx][i].filter((n) => n !== value);
        }
        // Same column
        if (newNotes[i][colIdx].includes(value)) {
          newNotes[i][colIdx] = newNotes[i][colIdx].filter((n) => n !== value);
        }
      }

      // Same 3x3 box
      const boxRow = Math.floor(rowIdx / 3) * 3;
      const boxCol = Math.floor(colIdx / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (newNotes[r][c].includes(value)) {
            newNotes[r][c] = newNotes[r][c].filter((n) => n !== value);
          }
        }
      }

      // Save to localStorage
      saveNotesToStorage(newNotes);
      return newNotes;
    });
  };

  // ============ GAME FUNCTIONS ============

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
      saveHintsUsedToStorage(0); // ⭐ Reset hints count
      setIsTimerRunning(true);
      setHasGameStarted(true);
      setSelected(null);
      setIsCompleted(false);
      setSolution(gameData.solution);

      // Reset notes for new game
      const emptyNotes = getEmptyNotes();
      setNotes(emptyNotes);
      saveNotesToStorage(emptyNotes);

      setIsNoteMode(false);
      setHintInfo(null);
      setHighlightedCell(null);
      saveHintToStorage(null, null);

      saveGameState(
        gameData.gameId,
        difficulty,
        0,
        false,
        gameData.currentBoard,
        gameData.puzzle,
      );
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

    // NOTE MODE - Add/remove notes
    if (isNoteMode) {
      if (value !== null && board[rIdx][cIdx] === null) {
        setNotes((prevNotes) => {
          const newNotes = prevNotes.map((row) => row.map((cell) => [...cell]));
          const currentCellNotes = newNotes[rIdx][cIdx];

          if (currentCellNotes.includes(value)) {
            newNotes[rIdx][cIdx] = currentCellNotes.filter((n) => n !== value);
            console.log(`🗑️ Removed note ${value} from cell [${rIdx},${cIdx}]`);
          } else {
            newNotes[rIdx][cIdx] = [...currentCellNotes, value].sort();
            console.log(`✏️ Added note ${value} to cell [${rIdx},${cIdx}]`);
          }

          // Save to localStorage
          saveNotesToStorage(newNotes);
          return newNotes;
        });
      }
      return;
    }

    // NORMAL MODE - Place numbers
    console.log("handleInput called with:", { rIdx, cIdx, value });

    const previousValue = board[rIdx][cIdx];

    // Clear notes when placing a number
    if (value !== null) {
      setNotes((prev) => {
        const newNotes = prev.map((row) => row.map((cell) => [...cell]));
        newNotes[rIdx][cIdx] = [];
        saveNotesToStorage(newNotes);
        return newNotes;
      });

      clearRelatedNotes(rIdx, cIdx, value);
    }

    // Clear hint if placing a number in any cell
    if (value !== null) {
      setHighlightedCell(null);
      setHintInfo(null);
      saveHintToStorage(null, null);
    }

    // Start timer on first input
    if (!hasGameStarted && value !== null) {
      setHasGameStarted(true);
      setIsTimerRunning(true);
    }

    try {
      const gameData = await gameAPI.makeMove(gameId, rIdx, cIdx, value);

      console.log("🔥 BACKEND RESPONSE:", {
        mistakes: gameData.mistakes,
        currentBoard: gameData.currentBoard,
        previousValue,
        currentValue: value,
      });

      // SYNC WITH BACKEND STATE
      setBoard(gameData.currentBoard);
      setMistakes(gameData.mistakes || 0);
      setSolution(gameData.solution);

      saveGameState(
        gameData.gameId,
        difficulty,
        time,
        isTimerRunning,
        gameData.currentBoard,
        puzzle,
      );
      localStorage.setItem(
        "sudokuBoard",
        JSON.stringify(gameData.currentBoard),
      );

      if (gameData.completed || gameData.mistakes >= 3) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        setHighlightedCell(null);
        setHintInfo(null);
        saveHintToStorage(null, null);
      }
    } catch (error) {
      console.error("❌ Backend error:", error);

      try {
        const gameData = await gameAPI.getGame(gameId);
        setBoard(gameData.currentBoard);
        setMistakes(gameData.mistakes || 0);
        setSolution(gameData.solution);
      } catch (fetchError) {
        console.error("❌ Failed to fetch game state:", fetchError);
      }
    }
  };

  const handleUndo = async () => {
    if (!gameId) {
      console.log("No game ID available");
      return;
    }

    try {
      const gameData = await gameAPI.undoMove(gameId);

      setBoard(gameData.currentBoard);
      setMistakes(gameData.mistakes || 0);
      setSolution(gameData.solution);

      localStorage.setItem(
        "sudokuBoard",
        JSON.stringify(gameData.currentBoard),
      );
      saveGameState(
        gameData.gameId,
        difficulty,
        time,
        isTimerRunning,
        gameData.currentBoard,
        puzzle,
      );

      setHighlightedCell(null);
      setHintInfo(null);
      saveHintToStorage(null, null);
    } catch (error) {
      console.error("❌ Undo failed:", error);
    }
  };

  const handleHint = async () => {
    // ⭐ CHECK 1: Game must be running (not paused)
    if (!isTimerRunning) {
      alert("⏸️ Please resume the game to use hints!");
      return;
    }

    // ⭐ CHECK 2: Hint limit check
    if (hintsUsed >= MAX_HINTS) {
      alert(
        `❌ No more hints available! You've used all ${MAX_HINTS} hints for this game.`,
      );
      return;
    }

    if (!gameId) {
      console.log("No game ID available");
      return;
    }

    try {
      const hintData = await gameAPI.getHint(gameId);

      if (
        hintData &&
        hintData.row !== undefined &&
        hintData.col !== undefined
      ) {
        const cellKey = `${hintData.row}-${hintData.col}`;
        const newHintInfo = {
          row: hintData.row,
          col: hintData.col,
          value: hintData.value,
          strategy: hintData.strategy || "Basic Strategy",
          explanation:
            hintData.explanation || `Try placing ${hintData.value} here`,
        };

        setHighlightedCell(cellKey);
        setHintInfo(newHintInfo);

        saveHintToStorage(newHintInfo, cellKey);

        // INCREMENT HINTS USED
        const newHintsCount = hintsUsed + 1;
        setHintsUsed(newHintsCount);
        saveHintsUsedToStorage(newHintsCount);

        console.log(`💡 Hint ${newHintsCount}/${MAX_HINTS} used`);
      }
    } catch (error) {
      console.error("❌ Hint failed:", error);

      // ⭐ FALLBACK: If no hint available from backend, provide notes instead
      const errorMessage = error.message || error.toString();

      if (
        errorMessage.includes("No hint available") ||
        errorMessage.includes("404")
      ) {
        console.log("🔄 No hints from backend, generating notes fallback...");

        // Find an empty cell and generate notes for it
        let foundEmptyCell = false;

        for (let r = 0; r < 9 && !foundEmptyCell; r++) {
          for (let c = 0; c < 9 && !foundEmptyCell; c++) {
            if (board[r][c] === null || board[r][c] === 0) {
              const cellNotes = generateNotesForCell(r, c, board, solution);

              if (cellNotes.length > 0) {
                // Update notes for this cell
                setNotes((prev) => {
                  const newNotes = prev.map((row) =>
                    row.map((cell) => [...cell]),
                  );
                  newNotes[r][c] = cellNotes;
                  saveNotesToStorage(newNotes);
                  return newNotes;
                });

                // Highlight the cell
                const cellKey = `${r}-${c}`;
                setHighlightedCell(cellKey);

                // Create a notes-based hint info
                setHintInfo({
                  row: r,
                  col: c,
                  value: cellNotes[0], // First possible value
                  strategy: "Possible Values",
                  explanation: `This cell can contain: ${cellNotes.join(", ")}. Notes have been added to help you.`,
                  isNotesHint: true, // Flag to indicate this is a notes-based hint
                });

                saveHintToStorage(
                  {
                    row: r,
                    col: c,
                    value: cellNotes[0],
                    strategy: "Possible Values",
                    explanation: `This cell can contain: ${cellNotes.join(", ")}. Notes have been added to help you.`,
                    isNotesHint: true,
                  },
                  cellKey,
                );

                // INCREMENT HINTS USED for notes hint too
                const newHintsCount = hintsUsed + 1;
                setHintsUsed(newHintsCount);
                saveHintsUsedToStorage(newHintsCount);

                foundEmptyCell = true;
                console.log(
                  `📝 Notes hint provided for cell [${r},${c}]: ${cellNotes.join(", ")}`,
                );
                alert(
                  `💡 Hint: Possible values for this cell are ${cellNotes.join(", ")}. Notes have been added!`,
                );
              }
            }
          }
        }

        if (!foundEmptyCell) {
          alert(
            "❌ No hints available - the puzzle might be complete or in an invalid state!",
          );
        }
      } else {
        alert("❌ No hints available for this puzzle.");
      }
    }
  };

  const handleOkHint = async () => {
    if (!hintInfo) return;

    // ⭐ If this is a notes-based hint, just dismiss it (don't auto-fill)
    if (hintInfo.isNotesHint) {
      setHighlightedCell(null);
      setHintInfo(null);
      saveHintToStorage(null, null);
      return;
    }

    const wasInNoteMode = isNoteMode;

    if (wasInNoteMode) {
      setIsNoteMode(false);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const row = hintInfo.row;
    const col = hintInfo.col;
    const value = hintInfo.value;

    // Clear notes in the cell and related cells
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

      saveGameState(
        gameData.gameId,
        difficulty,
        time,
        isTimerRunning,
        gameData.currentBoard,
        puzzle,
      );
      localStorage.setItem(
        "sudokuBoard",
        JSON.stringify(gameData.currentBoard),
      );

      if (gameData.completed || gameData.mistakes >= 3) {
        setIsCompleted(true);
        setIsTimerRunning(false);
      }
    } catch (error) {
      console.error("❌ Hint placement failed:", error);
    }

    if (wasInNoteMode) {
      setIsNoteMode(true);
    }

    setHighlightedCell(null);
    setHintInfo(null);
    saveHintToStorage(null, null);
  };

  const dismissHint = () => {
    setHighlightedCell(null);
    setHintInfo(null);
    saveHintToStorage(null, null);
  };

  const handleNewGame = () => {
    clearGameState();
    localStorage.removeItem("sudokuNotes");
    localStorage.removeItem("sudokuHint");
    localStorage.removeItem("sudokuHintsUsed"); // ⭐ Clear hints count
    loadGame(difficulty);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    clearGameState();
    localStorage.removeItem("sudokuNotes");
    localStorage.removeItem("sudokuHint");
    localStorage.removeItem("sudokuHintsUsed"); // ⭐ Clear hints count
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
      if (savedBoard) {
        setBoard(JSON.parse(savedBoard));
      }

      // LOAD NOTES FROM LOCALSTORAGE
      const savedNotes = localStorage.getItem("sudokuNotes");
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          setNotes(parsedNotes);
          console.log("✅ Loaded notes from localStorage");
        } catch (e) {
          console.error("Failed to parse saved notes:", e);
          setNotes(getEmptyNotes());
        }
      } else {
        setNotes(getEmptyNotes());
      }

      // ⭐ LOAD HINTS USED COUNT
      const savedHintsUsed = loadHintsUsedFromStorage();
      setHintsUsed(savedHintsUsed);
      console.log(`✅ Loaded hints used: ${savedHintsUsed}/${MAX_HINTS}`);

      // LOAD HINT FROM LOCALSTORAGE
      const { hint, highlighted } = loadHintFromStorage();
      if (hint && highlighted) {
        const [hintRow, hintCol] = highlighted.split("-").map(Number);
        const currentValue = gameData.currentBoard[hintRow][hintCol];

        if (currentValue === null || currentValue === 0) {
          setHintInfo(hint);
          setHighlightedCell(highlighted);
          console.log("✅ Loaded hint from localStorage:", hint);
        } else {
          console.log("ℹ️ Hint cell already filled, clearing hint");
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
    setIsNoteMode((prev) => {
      const newState = !prev;
      console.log("📝 Note mode:", newState ? "ON" : "OFF");
      return newState;
    });
  };

  // ============ EFFECTS ============

  useEffect(() => {
    const savedGameId = localStorage.getItem("sudokuGameId");
    const savedDifficulty =
      localStorage.getItem("sudokuDifficulty") || "MEDIUM";

    if (savedGameId) {
      loadExistingGame(savedGameId, savedDifficulty);
      setDifficulty(savedDifficulty);
    } else {
      loadGame("MEDIUM");
    }
  }, []);

  useEffect(() => {
    let interval;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (gameId) {
      localStorage.setItem("sudokuTime", time.toString());
    }
  }, [time, gameId]);

  useEffect(() => {
    if (gameId) {
      localStorage.setItem("sudokuTimerRunning", isTimerRunning.toString());
    }
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
    maxHints: MAX_HINTS, // ⭐ Export max hints for UI display

    loadGame,
    handleInput,
    handleNewGame,
    handleDifficultyChange,
    handleTimerToggle,
    handleUndo,
    handleHint,
    handleOkHint,
    dismissHint,
    isError,
    toggleNoteMode,
    setHintInfo,
    setHighlightedCell,
  };
};

export default useSudokuGame;
