import dayjs from "dayjs";

export function calculateStreak(activityMap: any) {
  let streak = 0;
  let current = dayjs();

  while (activityMap[current.format("YYYY-MM-DD")]?.solved) {
    streak++;
    current = current.subtract(1, "day");
  }

  return streak;
}
