import React from "react";
import styles from "./DifficultySelector.module.css";

const DifficultySelector = ({ difficulty, setDifficulty }) => {
  const difficulties = [
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
    { label: "Expert", value: "EXPERT" },
    { label: "Master", value: "MASTER" },
    { label: "Extreme", value: "EXTREME" },
  ];

  return (
    <div className={styles.container}>
      <span>Difficulty: </span>
      {difficulties.map((diff) => (
        <button
          key={diff.value}
          onClick={() => setDifficulty(diff.value)}
          className={styles.buttons}
          style={{
            backgroundColor: difficulty === diff.value ? "#4a6fa5" : "#f0f0f0",
            color: difficulty === diff.value ? "white" : "black",
          }}
        >
          {diff.label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
