import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { db } from "./db.mjs";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/public", express.static("public"));

app.use(
  session({
    secret: "lost_found_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.send("Logged out successfully");
});

// 创建新item
app.post("/item", async (req, res) => {
  const { type, location, found_date, description, finder_id } = req.body;
  try {
    const database = await db;
    await database.run(
      "INSERT INTO Items (type, location, found_date, description, finder_id, status, claimer_id) VALUES (?, ?, ?, ?, ?, 0, NULL)",
      [type, location, found_date, description, finder_id]
    );
    res.status(201).send("Item added successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 获取所有items
app.get("/items", async (req, res) => {
  try {
    const database = await db;
    const items = await database.all("SELECT * FROM Items WHERE status = 0");
    res.json(items);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 获取所有某种类的items
app.get("/items/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const database = await db;
    const items = await database.all(
      "SELECT * FROM Items WHERE type = ? AND status = 0",
      [type]
    );
    res.json(items);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 某用户提交找到的所有items
app.get("/items/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const database = await db;
    const items = await database.all(
      "SELECT * FROM Items WHERE finder_id = ? AND (status = 0 OR status = 1)",
      [user_id]
    );
    res.json(items);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 某用户提交找回的所有items
app.get("/items/claim/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const claims = await db.all(
      "SELECT * FROM Items JOIN Claims ON Items.item_id = Claims.item_id WHERE Claims.claimer_id = ? AND Claims.status = 0",
      [user_id]
    );
    res.json(claims);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 删除特定item，
app.post("/item/delete/:item_id", async (req, res) => {
  const { item_id } = req.params;
  try {
    const database = await db;
    await database.run("UPDATE Items SET status = 2 WHERE item_id = ?", [
      item_id,
    ]);
    res.send("Item marked as returned");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 登录，返回改用户id
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.get("SELECT * FROM Users WHERE username = ?", [
      username,
    ]);
    if (!user) {
      return res.status(404).send("Login Username Not Found. Go Sign Up");
    } else if (user.password !== password) {
      return res.status(401).send("Incorrect Password! Try Again.");
    } else {
      req.session.userId = user.user_id;
      return res
        .status(200)
        .json({ message: "Login successfully!", userId: user.user_id });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 创建新用户
app.post("/signup", async (req, res) => {
  try {
    const database = await db;
    let username = req.body.username;
    let password = req.body.password;
    let contact_info = req.body.contact_info;
    if (
      !username ||
      username == "" ||
      !password ||
      password == "" ||
      !contact_info ||
      contact_info == ""
    ) {
      return res.status(404).send("Invalid Information");
    }
    let username_exist = await database.get(
      "SELECT username FROM Users WHERE username = ?",
      [username]
    );
    if (username_exist) {
      return res.status(404).send("Username Existed");
    }
    await database.run(
      "INSERT INTO Users (username, password, contact_info) VALUES (?, ?, ?)",
      [username, password, contact_info]
    );
    return res.status(200).send("Signup successfully!");
  } catch (error) {
    return res.status(500).send("Uncaught Error");
  }
});

// 某用户提交对某物品的claim
app.post("/claim", async (req, res) => {
  const { item_id, claimer_id } = req.body;
  if (!item_id || !claimer_id) {
    return res
      .status(400)
      .send(
        "Missing required information: item_id and claimer_id are both required."
      );
  }
  try {
    const user = await db.get(
      "SELECT contact_info FROM Users WHERE user_id = ?",
      [claimer_id]
    );
    if (!user) {
      return res.status(404).send("User not found. Invalid claimer_id.");
    }
    await db.run(
      "INSERT INTO Claims (item_id, claimer_id, contact_info, status) VALUES (?, ?, ?, 0)",
      [item_id, claimer_id, user.contact_info]
    );
    await db.run(
      "UPDATE Items SET status = 1, claimer_id = ? WHERE item_id = ?",
      [claimer_id, item_id]
    );
    res.status(201).send("Claim submitted successfully.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 物归原主，删除向光item，claim
app.post("/claim/end/:item_id", async (req, res) => {
  const { item_id } = req.params;
  if (!item_id) {
    return res.status(400).send("Item ID is required.");
  }
  try {
    const claim = await db.get(
      "SELECT claim_id FROM Claims WHERE item_id = ? AND status = 0",
      [item_id]
    );
    if (!claim) {
      return res.status(404).send("No active claim found for this item.");
    }
    await db.run("UPDATE Claims SET status = 1 WHERE claim_id = ?", [
      claim.claim_id,
    ]);
    await db.run("UPDATE Items SET status = 2 WHERE item_id = ?", [item_id]);
    res.send("Claim ended and item status updated successfully.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 不是失主，删除claim，item状态改回未认领
app.post("/claim/return/:item_id", async (req, res) => {
  const { item_id } = req.params;
  if (!item_id) {
    return res.status(400).send("Item ID is required.");
  }
  try {
    const claim = await db.get(
      "SELECT claim_id FROM Claims WHERE item_id = ? AND status = 0",
      [item_id]
    );
    if (!claim) {
      return res.status(404).send("No active claim found for this item.");
    }
    await db.run("UPDATE Claims SET status = 1 WHERE claim_id = ?", [
      claim.claim_id,
    ]);
    await db.run(
      "UPDATE Items SET status = 0, claimer_id = NULL WHERE item_id = ?",
      [item_id]
    );
    res.send(
      "Claim ended, item status reset, and claimer removed successfully."
    );
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

// 获取某物品claim失主的联系方式
app.get("/claim/info/:item_id", async (req, res) => {
  const { item_id } = req.params;
  if (!item_id) {
    return res.status(400).send("Item ID is required.");
  }
  try {
    const claimInfo = await db.get(
      `
            SELECT u.username, u.contact_info
            FROM Users u
            JOIN Claims c ON u.user_id = c.claimer_id
            WHERE c.item_id = ? AND c.status = 0`,
      [item_id]
    );
    if (!claimInfo) {
      return res
        .status(404)
        .send("No active claim found for this item or claimer does not exist.");
    }
    res.json({
      username: claimInfo.username,
      contact_info: claimInfo.contact_info,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
