type Props = {
  level: number;
};

const intensityMap: Record<number, string> = {
  0: "bg-gray-200",
  1: "bg-green-200",
  2: "bg-green-400",
  3: "bg-green-600",
  4: "bg-green-800",
};

export default function HeatmapCell({ level }: Props) {
  return (
    <div
      className={`w-4 h-4 rounded-sm ${intensityMap[level] || "bg-gray-200"}`}
    />
  );
}
