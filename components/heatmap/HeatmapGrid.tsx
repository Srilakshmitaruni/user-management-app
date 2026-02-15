"use client";

import { useEffect, useState } from "react";
import { generateYearDays } from "../../lib/heatmap";
import { getAllActivities } from "../../lib/idb";
import HeatmapCell from "./HeatmapCell";

export default function HeatmapGrid() {
  const [activityMap, setActivityMap] = useState<Record<string, any>>({});

  useEffect(() => {
    async function load() {
      const data = await getAllActivities();
      const map: Record<string, any> = {};

      data.forEach((item: any) => {
        map[item.date] = item;
      });

      setActivityMap(map);
    }

    load();
  }, []);

  const days = generateYearDays();
  console.log("DAYS:", days);
  return (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(7, 20px)",
      gap: "4px",
    }}
  >
    {days.map((day, index) => {
      const key = day.format("YYYY-MM-DD");
      const activity = activityMap[key];
      const level = activity ? activity.difficulty || 1 : 0;

      const colors = [
        "#e5e7eb",  // gray
        "#bbf7d0",
        "#4ade80",
        "#16a34a",
        "#166534",
      ];

      return (
        <div
          key={index}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "3px",
            backgroundColor: colors[level],
          }}
        />
      );
    })}
  </div>
);
}