import { generateDailySeed } from "./seedGenerator";
import { createRNG } from "./deterministicRNG";

export interface SequencePuzzle {
  sequence: number[];
  correctAnswer: number;
  rule: string;
}

export async function generateSequencePuzzle(): Promise<SequencePuzzle> {
  const seed = await generateDailySeed();
  const rng = createRNG(seed);

  const patternType = Math.floor(rng() * 3);

  let sequence: number[] = [];
  let correctAnswer = 0;
  let rule = "";

  switch (patternType) {
    case 0: {
      // Arithmetic progression
      const start = Math.floor(rng() * 20) + 1;
      const diff = Math.floor(rng() * 10) + 1;

      sequence = Array.from({ length: 5 }, (_, i) => start + i * diff);
      correctAnswer = start + 5 * diff;
      rule = `Add ${diff} each time`;
      break;
    }

    case 1: {
      // Geometric progression
      const start = Math.floor(rng() * 5) + 1;
      const ratio = Math.floor(rng() * 3) + 2;

      sequence = Array.from({ length: 5 }, (_, i) =>
        start * Math.pow(ratio, i)
      );
      correctAnswer = start * Math.pow(ratio, 5);
      rule = `Multiply by ${ratio}`;
      break;
    }

    case 2: {
      // Alternating pattern
      const a = Math.floor(rng() * 10) + 1;
      const b = Math.floor(rng() * 10) + 5;

      sequence = [a, b, a + 1, b + 1, a + 2];
      correctAnswer = b + 2;
      rule = "Alternating increasing pattern";
      break;
    }

    default:
      throw new Error("Unknown pattern type");
  }

  return { sequence, correctAnswer, rule };
}
