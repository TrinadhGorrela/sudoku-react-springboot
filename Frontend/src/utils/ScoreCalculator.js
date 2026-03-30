/**
 * Calculate Sudoku score based on multiple factors
 * Returns: { score, breakdown, grade, stars }
 */
export const calculateScore = (
  difficulty,
  timeElapsed, 
  mistakes,
  hintsUsed = 0
) => {
  // Base points by difficulty
  const basePoints = {
    EASY: 1000,
    MEDIUM: 2000,
    HARD: 3500,
    EXPERT: 5000,
    MASTER: 7000,
    EXTREME: 10000,
  };

  const base = basePoints[difficulty.toUpperCase()] || 2000;

  // Time bonus (faster = more points)
  const timeInSeconds = timeElapsed;
  const timeBonus = calculateTimeBonus(difficulty, timeInSeconds);

  // Mistake penalty (-100 per mistake)
  const mistakePenalty = mistakes * 100;

  // Hint penalty (-150 per hint)
  const hintPenalty = hintsUsed * 150;

  // Perfect game bonus (no mistakes, no hints)
  const perfectBonus = mistakes === 0 && hintsUsed === 0 ? 500 : 0;

  // Calculate final score
  const totalScore = Math.max(
    0,
    base + timeBonus - mistakePenalty - hintPenalty + perfectBonus
  );

  // Calculate grade
  const grade = calculateGrade(totalScore, base);

  // Calculate stars (1-3)
  const stars = calculateStars(mistakes, hintsUsed);

  return {
    score: Math.round(totalScore),
    breakdown: {
      basePoints: base,
      timeBonus: Math.round(timeBonus),
      mistakePenalty: -mistakePenalty,
      hintPenalty: -hintPenalty,
      perfectBonus: perfectBonus,
    },
    grade,
    stars,
    metrics: {
      time: timeInSeconds,
      mistakes,
      hintsUsed,
    },
  };
};

/**
 * Calculate time bonus based on difficulty and time taken
 */
const calculateTimeBonus = (difficulty, timeInSeconds) => {
  // Target times (in seconds) for each difficulty
  const targetTimes = {
    EASY: 180, // 3 minutes
    MEDIUM: 300, // 5 minutes
    HARD: 480, // 8 minutes
    EXPERT: 600, // 10 minutes
    MASTER: 900, // 15 minutes
    EXTREME: 1200, // 20 minutes
  };

  const target = targetTimes[difficulty.toUpperCase()] || 300;

  // Bonus formula: more bonus for beating target time
  if (timeInSeconds <= target) {
    // Beat target time - big bonus
    const percentFaster = ((target - timeInSeconds) / target) * 100;
    return 500 + percentFaster * 10;
  } else {
    // Over target time - reduced bonus
    const percentSlower = ((timeInSeconds - target) / target) * 100;
    return Math.max(0, 500 - percentSlower * 5);
  }
};

/**
 * Calculate grade based on score percentage
 */
const calculateGrade = (score, baseScore) => {
  const percentage = (score / (baseScore + 1000)) * 100; // +1000 for possible bonuses

  if (percentage >= 90) return "S";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

/**
 * Calculate stars (1-3) based on performance
 */
const calculateStars = (mistakes, hintsUsed) => {
  if (mistakes === 0 && hintsUsed === 0) return 3; // Perfect
  if (mistakes <= 2 && hintsUsed <= 1) return 2; // Great
  return 1; // Good
};

/**
 * Get rank name based on score
 */
export const getRankName = (score) => {
  if (score >= 10000) return "Grandmaster";
  if (score >= 8000) return "Master";
  if (score >= 6000) return "Expert";
  if (score >= 4000) return "Advanced";
  if (score >= 2000) return "Intermediate";
  return "Beginner";
};

/**
 * Get color for grade
 */
export const getGradeColor = (grade) => {
  const colors = {
    S: "#FFD700", // Gold
    A: "#00C853", // Green
    B: "#2196F3", // Blue
    C: "#FF9800", // Orange
    D: "#F44336", // Red
    F: "#9E9E9E", // Gray
  };
  return colors[grade] || "#9E9E9E";
};