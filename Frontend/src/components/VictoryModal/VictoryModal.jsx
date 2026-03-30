import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Confetti from "react-confetti";
import {
  calculateScore,
  getRankName,
  getGradeColor,
} from "../../utils/ScoreCalculator";
import { formatTime } from "../../utils/sudokuHelpers";
import styles from "./VictoryModal.module.css";

const VictoryModal = ({
  show,
  timeElapsed,
  difficulty,
  mistakes,
  hintsUsed = 0,
  onNewGame,
}) => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const scoreData = calculateScore(difficulty, timeElapsed, mistakes, hintsUsed);
  const timeStr = formatTime(timeElapsed);
  const rankName = getRankName(scoreData.score);

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", detectSize);
    return () => window.removeEventListener("resize", detectSize);
  }, []);

  return (
    <>
      {show && mistakes < 3 && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={true}
          numberOfPieces={300}
        />
      )}
      <Modal
        show={show}
        onHide={onNewGame}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
        className={styles.victoryModal}
      >
        <Modal.Header
          className={
            mistakes >= 3
              ? "bg-danger text-white border-0"
              : `${styles.bgGradientSuccess} text-white border-0`
          }
        >
          <Modal.Title className="w-100 text-center">
            <div className={styles.victoryHeader}>
              <h2 className="display-4 fw-bold mb-2">
                {mistakes >= 3 ? "Game Over!" : "Victory!"}
              </h2>
              {mistakes < 3 && (
                <div
                  className={styles.gradeBadge}
                  style={{ backgroundColor: getGradeColor(scoreData.grade) }}
                >
                  Grade: {scoreData.grade}
                </div>
              )}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-3">
          <div className="text-center mb-4">
            <div className={`${styles.starsDisplay} mb-3`}>
              {[...Array(3)].map((_, index) => (
                <span
                  key={index}
                  className={`${styles.star} ${index < scoreData.stars ? styles.filled : styles.empty}`}
                >
                  ★
                </span>
              ))}
            </div>
            <h4 className="text-muted">
              {scoreData.stars === 3
                ? "Perfect Score!"
                : scoreData.stars === 2
                  ? "Excellent!"
                  : "Well Done!"}
            </h4>
          </div>

          {mistakes < 3 ? (
            <div className={`${styles.scoreContainer} mb-4`}>
              <div className={styles.totalScore}>
                <div className={styles.scoreLabel}>Total Score</div>
                <div className={styles.scoreValue}>{scoreData.score.toLocaleString()}</div>
                <div className={styles.rankName}>{rankName}</div>
              </div>
            </div>
          ) : (
            <div className="text-center mb-4 text-danger mt-3">
              <h5>You reached 3 mistakes. Better luck next time!</h5>
            </div>
          )}

          <div className={`${styles.statsGrid} mb-4`}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏱</div>
              <div className={styles.statLabel}>Time</div>
              <div className={styles.statValue}>{timeStr}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✕</div>
              <div className={styles.statLabel}>Mistakes</div>
              <div className={styles.statValue}>{mistakes}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>?</div>
              <div className={styles.statLabel}>Hints</div>
              <div className={styles.statValue}>{hintsUsed}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>◎</div>
              <div className={styles.statLabel}>Difficulty</div>
              <div className={styles.statValue}>{difficulty}</div>
            </div>
          </div>

          <button
            className={`${styles.playAgainBtn} w-100 rounded-pill fw-bold py-2 shadow mt-2`}
            onClick={onNewGame}
          >
            Play Again
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VictoryModal;
