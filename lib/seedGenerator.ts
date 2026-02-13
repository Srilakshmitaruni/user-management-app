export async function generateDailySeed(): Promise<number> {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const encoder = new TextEncoder();
  const data = encoder.encode(dateString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert first 8 bytes into a number
  const seed = hashArray
    .slice(0, 8)
    .reduce((acc, val) => (acc << 8) + val, 0);

  return Math.abs(seed);
}
