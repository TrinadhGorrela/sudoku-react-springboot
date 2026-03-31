export const calculateScore = (
  difficulty,
  timeElapsed, 
  mistakes,
  hintsUsed = 0
) => {
  const basePoints = {
    EASY: 1000,
    MEDIUM: 2000,
    HARD: 3500,
    EXPERT: 5000,
    MASTER: 7000,
    EXTREME: 10000,
  };

  const base = basePoints[difficulty.toUpperCase()] || 2000;
  const timeInSeconds = timeElapsed;
  const timeBonus = calculateTimeBonus(difficulty, timeInSeconds);
  const mistakePenalty = mistakes * 100;
  const hintPenalty = hintsUsed * 150;
  const perfectBonus = mistakes === 0 && hintsUsed === 0 ? 500 : 0;

  const totalScore = Math.max(
    0,
    base + timeBonus - mistakePenalty - hintPenalty + perfectBonus
  );

  const grade = calculateGrade(totalScore, base);
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

const calculateTimeBonus = (difficulty, timeInSeconds) => {
  const targetTimes = {
    EASY: 180, 
    MEDIUM: 300, 
    HARD: 480, 
    EXPERT: 600,
    MASTER: 900,
    EXTREME: 1200, 
  };

  const target = targetTimes[difficulty.toUpperCase()] || 300;

  if (timeInSeconds <= target) {
    const percentFaster = ((target - timeInSeconds) / target) * 100;
    return 500 + percentFaster * 10;
  } else {
    const percentSlower = ((timeInSeconds - target) / target) * 100;
    return Math.max(0, 500 - percentSlower * 5);
  }
};

const calculateGrade = (score, baseScore) => {
  const percentage = (score / (baseScore + 1000)) * 100;

  if (percentage >= 90) return "S";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const calculateStars = (mistakes, hintsUsed) => {
  if (mistakes === 0 && hintsUsed === 0) return 3; 
  if (mistakes <= 2 && hintsUsed <= 1) return 2; 
  return 1;
};

export const getRankName = (score) => {
  if (score >= 10000) return "Grandmaster";
  if (score >= 8000) return "Master";
  if (score >= 6000) return "Expert";
  if (score >= 4000) return "Advanced";
  if (score >= 2000) return "Intermediate";
  return "Beginner";
};

export const getGradeColor = (grade) => {
  const colors = {
    S: "#FFD700", 
    A: "#00C853",
    C: "#FF9800",
    D: "#F44336",
    F: "#9E9E9E",
  };
  return colors[grade] || "#9E9E9E";
};