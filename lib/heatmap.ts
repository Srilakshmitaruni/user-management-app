import dayjs from "dayjs";

export function generateYearDays() {
  const startOfYear = dayjs().startOf("year");
  const days = [];

  for (let i = 0; i < 365; i++) {
    days.push(startOfYear.add(i, "day"));
  }

  return days;
}
