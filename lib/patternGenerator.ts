import { generateDailySeed } from "./seedGenerator";
import { createRNG } from "./deterministicRNG";

export interface PatternPuzzle {
  grid: string[];
  correctAnswer: string;
  rule: string;
}

export async function generatePatternPuzzle(): Promise<PatternPuzzle> {
  const seed = await generateDailySeed();
  const rng = createRNG(seed + 1000); // offset so different from sequence

  const shapes = ["▲", "■", "●"];
  const baseIndex = Math.floor(rng() * shapes.length);
  const nextIndex = (baseIndex + 1) % shapes.length;

  const grid = [
    shapes[baseIndex],
    shapes[nextIndex],
    shapes[baseIndex],
    shapes[nextIndex],
    shapes[baseIndex],
    "?"
  ];

  const correctAnswer = shapes[nextIndex];

  return {
    grid,
    correctAnswer,
    rule: "Alternating shape pattern"
  };
}
