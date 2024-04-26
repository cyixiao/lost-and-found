import { Database } from "sqlite-async";

async function setupDatabase() {
  const db = await Database.open("lost_and_found.sqlite");

  await db.run(`CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        contact_info TEXT NOT NULL
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS Items (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        status INTEGER NOT NULL,
        finder_id INTEGER,
        claimer_id INTEGER,
        found_date DATETIME,
        description TEXT,
        FOREIGN KEY (finder_id) REFERENCES Users(user_id),
        FOREIGN KEY (claimer_id) REFERENCES Users(user_id)
    )`);

  await db.run(`CREATE TABLE IF NOT EXISTS Claims (
        claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        claimer_id INTEGER NOT NULL,
        contact_info TEXT NOT NULL,
        status INTEGER NOT NULL,
        FOREIGN KEY (item_id) REFERENCES Items(item_id),
        FOREIGN KEY (claimer_id) REFERENCES Users(user_id)
    )`);

  db.close();
}

setupDatabase();

export let db = await Database.open("lost_and_found.sqlite");
