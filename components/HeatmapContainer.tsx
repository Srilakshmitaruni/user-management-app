"use client";

import HeatmapGrid from "./heatmap/HeatmapGrid";


export default function HeatmapContainer() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Daily Activity Heatmap
      </h2>

      <HeatmapGrid />
    </div>
  );
}

