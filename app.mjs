import express from 'express';
import bodyParser from 'body-parser';
import { db } from './db.mjs';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.post('/item', async (req, res) => {
    const { type, location, found_date, description, finder_id } = req.body;
    try {
        const database = await db;
        await database.run("INSERT INTO Items (type, location, found_date, description, finder_id, status, claimer_id) VALUES (?, ?, ?, ?, ?, 0, NULL)", [type, location, found_date, description, finder_id]);
        res.status(201).send("Item added successfully");
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.get('/items', async (req, res) => {
    try {
        const database = await db;
        const items = await database.all("SELECT * FROM Items WHERE status = 0");
        res.json(items);
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.get('/items/:type', async (req, res) => {
    const { type } = req.params;
    try {
        const database = await db;
        const items = await database.all("SELECT * FROM Items WHERE type = ? AND status = 0", [type]);
        res.json(items);
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.get('/items/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const database = await db;
        const items = await database.all("SELECT * FROM Items WHERE finder_id = ? AND (status = 0 OR status = 1)", [user_id]);
        res.json(items);
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.post('/item/delete/:item_id', async (req, res) => {
    const { item_id } = req.params;
    try {
        const database = await db;
        await database.run("UPDATE Items SET status = 2 WHERE item_id = ?", [item_id]);
        res.send("Item marked as returned");
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


