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

app.get('/login', async (req, res) => {
    try {
        const database = await db;
        let username = req.body.username;
        let pswd = req.body.password;
        let user = await database.get("SELECT * FROM Users WHERE username = ?", [username])
        if (!user) {
            return res.status(404).send("Login Username Not Found. Go Sign Up");
        }
        else if (user.password != pswd) {
            console.log(user)
            return res.status(404).send("Incorrect Password! Try Agian.")
        }
        else {
            return res.status(200).send("Login successfully!");
        }
    }
    catch (error) {
        return res.status(500).send("Internal Server Error: " + error.message);
    }
});

app.post('/signup', async (req, res) => {
    try {
        const database = await db;
        let username = req.body.username;
        let password =req.body.password;
        let contact_info = req.body.contact_info;
        if (!username || username=="" || !password || password=="" || !contact_info || contact_info=="") {
            return res.status(404).send("Invalid Information");
        }
        let username_exist = await database.get("SELECT username FROM Users WHERE username = ?", [username])
        if (username_exist) {
            return res.status(404).send("Username Existed");
        }
        await database.run("INSERT INTO Users (username, password, contact_info) VALUES (?, ?, ?)", [username, password, contact_info]);
         return res.status(200).send("Signup successfully!");
    }
    catch(error) {
        return res.status(500).send("Uncaught Error");
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
