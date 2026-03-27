import React, { useEffect } from "react";
import Grid from "./components/Grid/Grid";
import GamePanel from "./components/GamePanel/GamePanel";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import HintModal from "./components/HintModal/HintModal";
import useSudokuGame from "./hooks/useSudokuGame";
import VictoryModal from "./components/VictoryModal/VictoryModal";
import { formatTime } from "./utils/sudokuHelpers";
import { initializeApp } from "./services/api";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  const {
    selected,
    setSelected,
    difficulty,
    mistakes,
    time,
    isTimerRunning,
    board,
    puzzle,
    loading,
    error,
    isCompleted,
    notes,
    isNoteMode,
    hintsUsed,
    toggleNoteMode,
    handleInput,
    handleNewGame,
    handleDifficultyChange,
    handleTimerToggle,
    handleUndo,
    handleHint,
    isError,
    hintInfo,
    highlightedCell,
    setHighlightedCell,
    setHintInfo,
    handleOkHint,
    dismissHint,
  } = useSudokuGame("MEDIUM");

  return (
    <div className="container">
      {loading && (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
          <p> Loading Game...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <VictoryModal
        show={isCompleted}
        timeElapsed={time}
        difficulty={difficulty}
        mistakes={mistakes}
        hintsUsed={hintInfo}
        onNewGame={() => console.log("New game clicked!")}
        isAnonymous={true}
      />

      <header className="header">
        <h1 className="heading">Sudoku</h1>
        <DifficultySelector
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
        />
      </header>

      <main className="main">
        <div>
          <Grid
            board={board}
            puzzle={puzzle}
            notes={notes}
            selected={selected}
            setSelected={setSelected}
            handleInput={handleInput}
            isError={isError}
            onTimerToggle={handleTimerToggle}
            isTimerRunning={isTimerRunning}
            highlightedCell={highlightedCell}
            hintInfo={hintInfo}
          />
        </div>
        <div style={{ position: "relative" }}>
          {" "}
          {/* Add relative positioning */}
          <GamePanel
            mistakes={mistakes}
            time={time}
            isTimerRunning={isTimerRunning}
            selected={selected}
            handleInput={handleInput}
            onNewGame={handleNewGame}
            onTimerToggle={handleTimerToggle}
            onUndo={handleUndo}
            onPencil={toggleNoteMode}
            isNoteMode={isNoteMode}
            onHint={handleHint}
          />
          {/* HintModal will popup inside GamePanel container */}
          <HintModal
            show={!!hintInfo}
            hintInfo={hintInfo}
            onOkHint={handleOkHint}
            onDismissHint={dismissHint}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
