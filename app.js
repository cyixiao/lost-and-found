const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./lost_and_found.db');





app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM Users WHERE username = ? AND password = ?";
    db.get(query, [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ success: true, message: "Login successful", user: row });
        } else {
            res.json({ success: false, message: "Username or password incorrect" });
        }
    });
});

app.get('/items', (req, res) => {
    db.all("SELECT * FROM Items WHERE status = 1", (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(rows);
    });
});

app.post('/items', (req, res) => {
    const { type, location, finder_id } = req.body;
    const query = "INSERT INTO Items (type, location, status, finder_id, found_date) VALUES (?, ?, 1, ?, datetime('now'))";
    db.run(query, [type, location, finder_id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ success: true, item_id: this.lastID });
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


