export interface ScoreResult {
  finalScore: number;
  timeTaken: number;
  penalty: number;
  streakBonus: number;
  timeBonus: number;
}

export function calculateScore(
  startTime: number,
  endTime: number,
  streak: number,
  wrongAttempts: number
): ScoreResult {
  const baseScore = 100;

  const timeTaken = Math.floor((endTime - startTime) / 1000);

  const timeBonus = Math.max(50 - timeTaken, 0);

  const streakBonus = streak * 10;

  const penalty = wrongAttempts * 20;

  const finalScore =
    baseScore + timeBonus + streakBonus - penalty;

  return {
    finalScore,
    timeTaken,
    penalty,
    streakBonus,
    timeBonus
  };
}
