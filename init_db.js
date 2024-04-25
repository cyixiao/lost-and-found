const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./lost_and_found.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        contact_info TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Items (
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

    db.run(`CREATE TABLE IF NOT EXISTS Claims (
        claim_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        claimer_id INTEGER NOT NULL,
        contact_info TEXT NOT NULL,
        status INTEGER NOT NULL,
        FOREIGN KEY (item_id) REFERENCES Items(item_id),
        FOREIGN KEY (claimer_id) REFERENCES Users(user_id)
    )`, () => {
        console.log('Database and tables created!');
        db.close();
    });
});
