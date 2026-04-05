import React, { useState } from "react";
import Grid from "./components/Grid/Grid";
import GamePanel from "./components/GamePanel/GamePanel";
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import HintModal from "./components/HintModal/HintModal";
import useSudokuGame from "./hooks/useSudokuGame";
import VictoryModal from "./components/VictoryModal/VictoryModal";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import { Dropdown } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [currentView, setCurrentView] = useState("game");
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView("game");
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentView("game");
  };

  const handleLogout = () => {
    setUser(null);
  };

  const {
    selected,
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
    maxHints,
    hintInfo,
    highlightedCell,
    setSelected,
    toggleNoteMode,
    handleInput,
    handleNewGame,
    handleDifficultyChange,
    handleTimerToggle,
    handleUndo,
    handleHintRequest,
    isError,
    handleHintAccept,
    handleHintDismiss,
    isProcessing,
  } = useSudokuGame("MEDIUM");

  if (currentView === "login") {
    return (
      <LoginPage
        onBack={() => setCurrentView("game")}
        onRegisterClick={() => setCurrentView("register")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === "register") {
    return (
      <RegisterPage
        onBack={() => setCurrentView("game")}
        onLoginClick={() => setCurrentView("login")}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  return (
    <div className="container">
      {loading && (
        <div className="loading-container">
          <div className="loading-bar">
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-dot"></span>
            <span className="loading-label">Loading Game</span>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <VictoryModal
        show={isCompleted}
        timeElapsed={time}
        difficulty={difficulty}
        mistakes={mistakes}
        hintsUsed={hintsUsed}
        onNewGame={handleNewGame}
      />

      <header className="header">
        <div className="header-top">
          <h1 className="heading">Sudoku</h1>
          <div className="auth-container">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="user-dropdown-toggle"
                id="dropdown-basic"
                disabled={isProcessing}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown-menu">
                {user && user.userType === "REGISTERED" ? (
                  <>
                    <Dropdown.ItemText
                      style={{ fontWeight: 600, color: "#325aaf" }}
                    >
                      Welcome, {user.username}!
                    </Dropdown.ItemText>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item onClick={() => setCurrentView("login")}>
                      Login
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setCurrentView("register")}>
                      Register
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <DifficultySelector
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
          disabled={isProcessing}
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
            isProcessing={isProcessing}
          />
        </div>
        <div style={{ position: "relative" }}>
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
            onHintRequest={handleHintRequest}
            hintsUsed={hintsUsed}
            maxHints={maxHints}
            isProcessing={isProcessing}
          />
          <HintModal
            show={!!hintInfo}
            hintInfo={hintInfo}
            onHintAccept={handleHintAccept}
            onHintDismiss={handleHintDismiss}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
