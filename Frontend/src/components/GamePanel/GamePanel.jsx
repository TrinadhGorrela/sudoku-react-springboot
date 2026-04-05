import React from "react";
import styles from "./GamePanel.module.css";
import classNames from "classnames";
import { formatTime } from "../../utils/sudokuHelpers";
import { GRID_SIZE, MAX_HINTS, MAX_MISTAKES } from "../../constants/gameConstants";

const GamePanel = ({
  mistakes = 0,
  time = 0,
  isTimerRunning = false,
  selected,
  handleInput,
  onTimerToggle,
  onUndo,
  onPencil,
  isNoteMode,
  onHintRequest,
  hintsUsed = 0,
  maxHints = MAX_HINTS,
  isProcessing = false,
}) => {
  const handleNumberClick = (number) => {
    if (selected) {
      const [row, col] = selected;
      handleInput(row, col, number);
    }
  };

  const hintsRemaining = maxHints - hintsUsed;
  const hintsDisabled = !isTimerRunning || hintsUsed >= maxHints || isProcessing;

  return (
    <div className={styles.gamePanel}>
      <div className={styles.headerRow}>
        <div className={styles.statGroup}>
          <span className={styles.statLabel}>Mistakes</span>
          <span className={styles.mistakesValue}>
            {mistakes}/{MAX_MISTAKES}
          </span>
        </div>
        <div className={styles.timeContainer}>
          <span className={styles.statLabel}>Time</span>
          <div className={styles.timerDisplay}>
            <span className={styles.timeValue}>{formatTime(time)}</span>
            <button onClick={onTimerToggle} className={styles.timerToggleBtn} disabled={isProcessing}>
              {isTimerRunning ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.toolsRow}>
        <button className={classNames(styles.toolBtn, { [styles.disabled]: isProcessing })} onClick={onUndo} title="Undo" disabled={isProcessing}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
          </svg>
        </button>
        <button
          className={classNames(styles.toolBtn, { [styles.active]: isNoteMode, [styles.disabled]: isProcessing })}
          onClick={onPencil}
          title={isNoteMode ? "Note Mode (ON)" : "Note Mode (OFF)"}
          disabled={isProcessing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
          </svg>
        </button>
        <div className={styles.hintBtnContainer}>
          <button
            className={classNames(styles.toolBtn, { [styles.disabled]: hintsDisabled })}
            onClick={onHintRequest}
            title={
              !isTimerRunning
                ? "Resume game to use hints"
                : hintsUsed >= maxHints
                  ? "No more hints available"
                  : `Get Hint (${hintsRemaining} remaining)`
            }
            disabled={hintsDisabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1" />
            </svg>
          </button>
          <span className={classNames(styles.hintCounter, {
            [styles.hintsLow]: hintsRemaining === 1,
            [styles.hintsNone]: hintsRemaining === 0,
          })}>
            {hintsRemaining}
          </span>
        </div>
      </div>

      <div className={styles.numpadGrid}>
        {Array.from({ length: GRID_SIZE }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={classNames(styles.numBtn, { [styles.disabled]: isProcessing })}
            disabled={isProcessing}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamePanel;