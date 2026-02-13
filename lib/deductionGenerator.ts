import { generateDailySeed } from "./seedGenerator";
import { createRNG } from "./deterministicRNG";

export interface DeductionPuzzle {
  people: string[];
  pets: string[];
  clues: string[];
  question: string;
  correctAnswer: string;
}

export async function generateDeductionPuzzle(): Promise<DeductionPuzzle> {
  const seed = await generateDailySeed();
  const rng = createRNG(seed + 2000);

  const people = ["Alice", "Bob", "Charlie"];
  const pets = ["Cat", "Dog", "Fish"];

  // Deterministic shuffle
  const shuffledPets = [...pets].sort(() => rng() - 0.5);

  const assignments: Record<string, string> = {
    Alice: shuffledPets[0],
    Bob: shuffledPets[1],
    Charlie: shuffledPets[2]
  };

  const clues = [
    `${people[1]} owns the ${assignments[people[1]]}.`,
    `${people[0]} does not own the ${assignments[people[1]]}.`
  ];

  const targetPet = "Cat";
  const correctAnswer =
    Object.keys(assignments).find(
      person => assignments[person] === targetPet
    ) || "";

  return {
    people,
    pets,
    clues,
    question: `Who owns the ${targetPet}?`,
    correctAnswer
  };
}
