import styles from "./Grid.module.css";
import classNames from "classnames";
import { GRID_SIZE } from "../../constants/gameConstants";

const DIGITS = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
const boxStride = GRID_SIZE / 3;

const Grid = ({
  board,
  puzzle,
  notes,
  selected,
  setSelected,
  handleInput,
  isError,
  isTimerRunning,
  onTimerToggle,
  highlightedCell,
  hintInfo,
  isProcessing = false,
}) => {
  const isHighlighted = (row, col) => {
    return highlightedCell === `${row}-${col}`;
  };

  const isHintCell = (row, col) => {
    return hintInfo && hintInfo.row === row && hintInfo.col === col;
  };

  return (
    <div
      className={classNames(styles.container, {
        [styles.paused]: !isTimerRunning,
      })}
    >
      <table className={styles.table}>
        <tbody>
          {board.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => {
                const isPrefilled = puzzle[rIdx][cIdx] != null;
                const isSelected =
                  selected && rIdx === selected[0] && cIdx === selected[1];
                const isSameRow = selected && rIdx === selected[0];
                const isSameCol = selected && cIdx === selected[1];
                const isSameBox =
                  selected &&
                  Math.floor(rIdx / boxStride) === Math.floor(selected[0] / boxStride) &&
                  Math.floor(cIdx / boxStride) === Math.floor(selected[1] / boxStride);

                const isRelated =
                  (isSameRow || isSameCol || isSameBox) && !isSelected;

                const hasError = isError(rIdx, cIdx);
                const currentCellNotes = notes?.[rIdx]?.[cIdx] || [];

                const isHighlightedCell =
                  isHintCell(rIdx, cIdx) || isHighlighted(rIdx, cIdx);
                const isHintHighlighted = isHintCell(rIdx, cIdx);

                return (
                  <td
                    key={cIdx}
                    className={classNames(styles.cell, {
                      [styles.hintCell]: isHintHighlighted,
                      [styles.highlighted]: isHighlightedCell,
                    })}
                  >
                    <div className={styles.cellContent}>
                      {!cell && currentCellNotes.length > 0 && (
                        <div className={styles.notesGrid}>
                          {DIGITS.map((num) => (
                            <div key={num} className={styles.noteNumber}>
                              {currentCellNotes.includes(num) ? num : ""}
                            </div>
                          ))}
                        </div>
                      )}

                      <input
                        id={`cell-${rIdx}-${cIdx}`}
                        className={classNames(styles.input, {
                          [styles.selectedCell]: isSelected,
                          [styles.relatedCell]: isRelated,
                          [styles.userValue]:
                            !isPrefilled && !hasError && cell !== null,
                          [styles.prefilled]: isPrefilled,
                          [styles.error]: hasError,
                          [styles.empty]: cell === null,
                          [styles.hasValue]: cell !== null,
                          [styles.hintHighlighted]: isHintHighlighted,
                        })}
                        type="text"
                        maxLength={1}
                        value={cell === null ? "" : cell}
                        readOnly={isPrefilled || isProcessing}
                        onFocus={() => setSelected([rIdx, cIdx])}
                        onClick={() => setSelected([rIdx, cIdx])}
                        onKeyDown={(e) => {
                          if (e.key >= "1" && e.key <= String(GRID_SIZE)) {
                            handleInput(rIdx, cIdx, parseInt(e.key));
                          } else if (
                            e.key === "Backspace" ||
                            e.key === "Delete"
                          ) {
                            handleInput(rIdx, cIdx, null);
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            const newR = Math.max(0, rIdx - 1);
                            setSelected([newR, cIdx]);
                            document.getElementById(`cell-${newR}-${cIdx}`)?.focus();
                          } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            const newR = Math.min(GRID_SIZE - 1, rIdx + 1);
                            setSelected([newR, cIdx]);
                            document.getElementById(`cell-${newR}-${cIdx}`)?.focus();
                          } else if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            const newC = Math.max(0, cIdx - 1);
                            setSelected([rIdx, newC]);
                            document.getElementById(`cell-${rIdx}-${newC}`)?.focus();
                          } else if (e.key === "ArrowRight") {
                            e.preventDefault();
                            const newC = Math.min(GRID_SIZE - 1, cIdx + 1);
                            setSelected([rIdx, newC]);
                            document.getElementById(`cell-${rIdx}-${newC}`)?.focus();
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || new RegExp(`^[1-${GRID_SIZE}]$`).test(value)) {
                            handleInput(
                              rIdx,
                              cIdx,
                              value === "" ? null : parseInt(value),
                            );
                          }
                        }}
                      />

                      {isHintHighlighted}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {!isTimerRunning && (
        <div className={styles.overlay}>
          <button onClick={onTimerToggle} className={styles.playButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="#2a5298"
              className="bi bi-play-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Grid;
