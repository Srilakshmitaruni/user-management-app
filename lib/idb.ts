import { openDB } from "idb";

const DB_NAME = "heatmap-db";
const STORE_NAME = "dailyActivity";

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "date" });
      }
    },
  });
}

export async function saveActivity(activity: any) {
  const db = await getDB();
  await db.put(STORE_NAME, activity);
}

export async function getAllActivities() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}
