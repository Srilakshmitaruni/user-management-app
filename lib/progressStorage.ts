import { openDB } from "idb";

export interface Progress {
  date: string;
  solved: boolean;
  streak: number;
  hintsUsed?: number; // ✅ Added hint tracking
}

const DB_NAME = "logic-looper-db";
const STORE_NAME = "progress";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "date" });
      }
    }
  });
}

export async function saveProgress(data: Progress) {
  const db = await getDB();
  await db.put(STORE_NAME, data);
}

export async function getProgress(date: string): Promise<Progress | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, date);
}

export async function getAllProgress(): Promise<Progress[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}
