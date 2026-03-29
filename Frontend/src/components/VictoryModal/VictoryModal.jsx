import React, { useEffect, useState } from "react";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";
import Confetti from "react-confetti";
import {
  calculateScore,
  formatTime,
  getRankName,
  getGradeColor,
} from "../../utils/ScoreCalculator";
import styles from "./VictoryModal.module.css"; // Imported as module

const VictoryModal = ({
  show,
  timeElapsed, // milliseconds
  difficulty,
  mistakes,
  hintsUsed = 0,
  onNewGame,
  isAnonymous = true,
}) => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate score
  const scoreData = calculateScore(
    difficulty,
    timeElapsed,
    mistakes,
    hintsUsed,
  );
  const timeStr = formatTime(timeElapsed);
  const rankName = getRankName(scoreData.score);

  useEffect(() => {
    const detectSize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", detectSize);
    return () => window.removeEventListener("resize", detectSize);
  }, []);

  // Load leaderboard when modal opens
  useEffect(() => {
    if (show) {
      loadLeaderboard();
    }
  }, [show, difficulty]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // MOCK DATA
      setLeaderboard([
        {
          rank: 1,
          displayName: "ProPlayer",
          score: 9500,
          time: "03:45",
          mistakes: 0,
          stars: 3,
        },
        {
          rank: 2,
          displayName: "SpeedRunner",
          score: 8200,
          time: "04:12",
          mistakes: 1,
          stars: 3,
        },
        {
          rank: 3,
          displayName: "MasterMind",
          score: 7800,
          time: "05:30",
          mistakes: 2,
          stars: 2,
        },
        {
          rank: 15,
          displayName: "You",
          score: scoreData.score,
          time: timeStr,
          mistakes: mistakes,
          stars: scoreData.stars,
          isCurrentUser: true,
        },
      ]);
      setUserRank(15);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

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
          className={mistakes >= 3 ? "bg-danger text-white border-0" : `${styles.bgGradientSuccess} text-white border-0`}
        >
          <Modal.Title className="w-100 text-center">
            <div className={styles.victoryHeader}>
              <h2 className="display-4 fw-bold mb-2">
                {mistakes >= 3 ? "💀 Game Over! 💀" : "🎉 Victory! 🎉"}
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
          <Tabs defaultActiveKey="summary" className="mb-3">
            {/* ========== SUMMARY TAB ========== */}
            <Tab eventKey="summary" title="📊 Summary">
              {/* Stars */}
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

              {/* Score Display */}
              {mistakes < 3 ? (
                <div className={`${styles.scoreContainer} mb-4`}>
                  <div className={styles.totalScore}>
                    <div className={styles.scoreLabel}>Total Score</div>
                    <div className={styles.scoreValue}>
                      {scoreData.score.toLocaleString()}
                    </div>
                    <div className={styles.rankName}>{rankName}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4 text-danger mt-3">
                  <h5>You reached 3 mistakes. Better luck next time!</h5>
                </div>
              )}

              {/* Stats Grid */}
              <div className={`${styles.statsGrid} mb-4`}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>⏱️</div>
                  <div className={styles.statLabel}>Time</div>
                  <div className={styles.statValue}>{timeStr}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>❌</div>
                  <div className={styles.statLabel}>Mistakes</div>
                  <div className={styles.statValue}>{mistakes}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>💡</div>
                  <div className={styles.statLabel}>Hints</div>
                  <div className={styles.statValue}>{hintsUsed}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🎯</div>
                  <div className={styles.statLabel}>Difficulty</div>
                  <div className={styles.statValue}>{difficulty}</div>
                </div>
              </div>

              {/* Anonymous User Prompt */}
              {isAnonymous && (
                <div className="text-center mt-3 text-muted" style={{ fontSize: '0.85rem' }}>
                  <a href="#" className="text-decoration-none fw-bold text-primary">Sign in</a> to save your scores to the global leaderboard!
                </div>
              )}
            </Tab>

            {/* ========== LEADERBOARD TAB ========== */}
            <Tab eventKey="leaderboard" title="🏆 Leaderboard">
              <div className={styles.leaderboardContainer}>
                <div className={`${styles.leaderboardHeader} mb-3`}>
                  <h5>Top Players - {difficulty}</h5>
                  {userRank && (
                    <div className={styles.userRankBadge}>
                      Your Rank: #{userRank}
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.leaderboardTable}>
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Player</th>
                          <th>Score</th>
                          <th>Time</th>
                          <th>Mistakes</th>
                          <th>Stars</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((entry, index) => (
                          <tr
                            key={index}
                            className={
                              entry.isCurrentUser ? styles.currentUser : ""
                            }
                          >
                            <td>
                              <span className={styles.rankBadge}>
                                {entry.rank <= 3 ? (
                                  <span
                                    className={`${styles.medal} medal-${entry.rank}`}
                                  >
                                    {entry.rank === 1
                                      ? "🥇"
                                      : entry.rank === 2
                                        ? "🥈"
                                        : "🥉"}
                                  </span>
                                ) : (
                                  `#${entry.rank}`
                                )}
                              </span>
                            </td>
                            <td>
                              <strong>{entry.displayName}</strong>
                              {entry.isCurrentUser && (
                                <span className="badge bg-primary ms-2">
                                  You
                                </span>
                              )}
                            </td>
                            <td>{entry.score.toLocaleString()}</td>
                            <td>{entry.time}</td>
                            <td>{entry.mistakes}</td>
                            <td>
                              {[...Array(entry.stars)].map((_, i) => (
                                <span key={i} className={styles.starSmall}>
                                  ⭐
                                </span>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>

          {/* Footer Button */}
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
