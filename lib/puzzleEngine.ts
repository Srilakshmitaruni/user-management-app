import { generateDailySeed } from "./seedGenerator";
import { createRNG } from "./deterministicRNG";
import { generateSequencePuzzle } from "./puzzleGenerator";
import { generatePatternPuzzle } from "./patternGenerator";
import { generateDeductionPuzzle } from "./deductionGenerator";

export type PuzzleType = "sequence" | "pattern" | "deduction";

export interface UnifiedPuzzle {
  type: PuzzleType;
  data: any;
}

export async function generateDailyPuzzle(): Promise<UnifiedPuzzle> {
  const seed = await generateDailySeed();
  const rng = createRNG(seed);

  const puzzleTypeIndex = Math.floor(rng() * 3);

  if (puzzleTypeIndex === 0) {
    const puzzle = await generateSequencePuzzle();
    return { type: "sequence", data: puzzle };
  } else if (puzzleTypeIndex === 1) {
    const puzzle = await generatePatternPuzzle();
    return { type: "pattern", data: puzzle };
  } else {
    const puzzle = await generateDeductionPuzzle();
    return { type: "deduction", data: puzzle };
  }
}
