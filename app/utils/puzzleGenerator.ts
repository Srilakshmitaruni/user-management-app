
export function generateSequencePuzzle(seed: string) {
  const base = parseInt(seed.slice(0, 4), 16) % 10 + 1;
  const step = (parseInt(seed.slice(4, 8), 16) % 5) + 1;

  const sequence = [
    base,
    base + step,
    base + step * 2,
    base + step * 3,
  ];

  const answer = base + step * 4;

  return { sequence, answer };
}
