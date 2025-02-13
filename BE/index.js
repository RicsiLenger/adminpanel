import express from "express";
import maridb from "mariadb";
import cors from "cors";
import { logToDatabase } from "./logger.js";

const app = express();

const db = maridb.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb",
  connectionLimit: 5,
});

app.use(cors());
app.use(express.json());

app.get("/partners", async (req, res) => {
  let conn;
  try {
    const q = "SELECT * FROM partners";

    conn = await db.getConnection();
    const data = await conn.query(q);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    conn.release();
  }
});

app.get("/users", async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();

    let query = `
      SELECT u.*, IFNULL(GROUP_CONCAT(p.name SEPARATOR ', '), 'N/A') AS partnerName,
      IFNULL(GROUP_CONCAT(p.id SEPARATOR ', '), 'N/A') AS partnerId
      FROM users u
      LEFT JOIN connect c ON u.id = c.user_id
      LEFT JOIN partners p ON c.partner_id = p.id
    `;
    let params;
    if (req.query.partnerId) {
      const partnerIds = req.query.partnerId;
      const PartnerId = partnerIds.map((id) => parseInt(id));
      query += ` WHERE c.partner_id IN (?)`;
      params = [PartnerId];
    }

    query += ` GROUP BY u.id;`;

    const users = await conn.query(query, params);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.get("/log", async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    const q = `
    SELECT 
      log.logtype_id, 
      log.date, 
      logtype.logtype_name
    FROM log
    INNER JOIN logtype ON log.logtype_id = logtype.id
    `;
    const logs = await conn.query(q);

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.get("/partners/:id/users", async (req, res) => {
  const partnerId = req.params.id;
  let conn;
  try {
    conn = await db.getConnection();

    const getUsersQuery =
      "SELECT u.id, u.name, u.email, u.created_at, u.status FROM users u JOIN connect c ON u.id = c.user_id WHERE c.partner_id = ?";
    const users = await conn.query(getUsersQuery, [partnerId]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.delete("/partners/:id/remove-users", async (req, res) => {
  const partnerId = req.params.id;

  if (!partnerId) {
    return res.status(400).json({ error: "Missing partner ID" });
  }

  let conn;
  try {
    conn = await db.getConnection();

    const getPartnerNameQuery = "SELECT name FROM partners WHERE id = ?";
    const partnerNameResult = await conn.query(getPartnerNameQuery, [
      partnerId,
    ]);
    const partnerName =
      partnerNameResult.length > 0
        ? partnerNameResult[0].name
        : "Unknown Partner";

    const removeConnection = `DELETE FROM connect WHERE partner_id = ?`;
    const deletePartner = `UPDATE partners SET status = 0 WHERE id = ?`;

    await conn.query(removeConnection, [partnerId]);
    await conn.query(deletePartner, [partnerId]);

    logToDatabase("Partner Deleted With Users");
    res.status(200).json({ message: "Partner and it connections deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post("/partners", async (req, res) => {
  let conn;
  try {
    const { name, location, phone, description } = req.body;
    const q =
      "INSERT INTO partners (name, location, phone, description) VALUES (?, ?, ?, ?)";
    conn = await db.getConnection();
    const createPartnerResult = await conn.query(q, [
      name,
      location,
      phone,
      description,
    ]);
    const newPartnerId = createPartnerResult.insertId.toString();

    const result = {
      affectedRows: createPartnerResult.affectedRows,
      message: "Partner Added",
      id: newPartnerId,
    };

    await logToDatabase(`${result.message}`);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post("/users", async (req, res) => {
  let conn;
  try {
    const {
      name,
      email,
      username,
      password,
      status,
      phone,
      address,
      partnerId,
    } = req.body;

    conn = await db.getConnection();
    await conn.query(
      "INSERT INTO users (name, email, username, password, status, phone, address) VALUES (?, ?, ?, ?, 1, ?, ?)",
      [name, email, username, password, status, phone, address]
    );

    const lastInsertId = (await conn.query("SELECT LAST_INSERT_ID() as id"))[0]
      .id;

    if (partnerId) {
      await conn.query(
        "INSERT INTO connect (user_id, partner_id) VALUES (?, ?)",
        [lastInsertId, partnerId]
      );
    }

    logToDatabase("User Added");
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post("/partners/:id/add-users", async (req, res) => {
  const selectedPartnerId = req.params.id;
  const userIds = req.body.userIds;
  let conn;
  try {
    conn = await db.getConnection();

    const getPartnerNameQuery = "SELECT name FROM partners WHERE id = ?";
    const partnerNameResult = await conn.query(getPartnerNameQuery, [
      selectedPartnerId,
    ]);
    const partnerName =
      partnerNameResult.length > 0
        ? partnerNameResult[0].name
        : "Unknown Partner";

    const getUserNamesQuery = "SELECT name FROM users WHERE id IN (?)";
    const userNamesResult = await conn.query(getUserNamesQuery, [userIds]);
    const userNames = userNamesResult.map((user) => user.name);

    for (const userId of userIds) {
      await conn.query(
        "INSERT INTO connect (partner_id, user_id) VALUES (?, ?)",
        [selectedPartnerId, userId]
      );
    }

    logToDatabase("Partner Deleted and assigned it users to a new partner");
    res
      .status(200)
      .json({ message: "Felhasználók sikeresen hozzárendelve a partnerhez" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.delete("/partners/:id", async (req, res) => {
  let conn;
  try {
    const partnerId = BigInt(req.params.id);
    conn = await db.getConnection();

    const getPartnerNameQuery = "SELECT name FROM partners WHERE id = ?";
    const partnerNameResult = await conn.query(getPartnerNameQuery, [
      partnerId,
    ]);
    const partnerName =
      partnerNameResult.length > 0
        ? partnerNameResult[0].name
        : "Unknown Partner";

    const getUsersQuery = "SELECT user_id FROM connect WHERE partner_id = ?";
    const usersResult = await conn.query(getUsersQuery, [partnerId]);
    const userIds = usersResult.map((user) => user.user_id);

    let deletedUsersCount = 0;

    if (userIds.length > 0) {
      const updateUserQuery = "UPDATE users SET status = 0 WHERE id IN (?)";
      const updateUserResult = await conn.query(updateUserQuery, [userIds]);
      deletedUsersCount = updateUserResult.affectedRows;
    }

    const deleteConnectionQuery = "DELETE FROM connect WHERE partner_id = ?";
    await conn.query(deleteConnectionQuery, [partnerId]);

    const updatePartnerQuery = "UPDATE partners SET status = 0 WHERE id = ?";
    const partnerDeletionResult = await conn.query(updatePartnerQuery, [
      partnerId,
    ]);

    const result = {
      affectedRows: partnerDeletionResult.affectedRows,
      deletedUsersCount: deletedUsersCount,
      message: "Partner and it users Deleted",
    };

    logToDatabase(`${result.message}`);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.delete("/users/:id", async (req, res) => {
  let conn;
  try {
    const userId = BigInt(req.params.id);
    conn = await db.getConnection();

    const getUserNameQuery = "SELECT name FROM users WHERE id = (?)";
    const userNameResult = await conn.query(getUserNameQuery, [userId]);
    const userName = userNameResult.map((user) => user.name);

    const q = "UPDATE users SET status = 0 WHERE id = ?";
    const data = await conn.query(q, [userId]);

    const deleteConnectionQuery = "DELETE FROM connect WHERE user_id = ?";
    const deleteResult = await conn.query(deleteConnectionQuery, [userId]);

    const result = {
      affectedRows: data.affectedRows,
      deleteResult: deleteResult.affectedRows,
      message: "User Deleted",
    };

    logToDatabase(`${result.message}`);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.put("/partners/:id", async (req, res) => {
  let conn;
  try {
    const partnerId = req.params.id;
    const { name, location, phone, description, status } = req.body;
    const q =
      "UPDATE partners SET name=?, location=?, phone=?, description=?, status=? WHERE id=?";

    conn = await db.getConnection();
    const data = await conn.query(q, [
      name,
      location,
      phone,
      description,
      status,
      partnerId,
    ]);

    const result = {
      affectedRows: data.affectedRows,
      message: "Partner Updated",
    };

    logToDatabase(`${result.message}`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.put("/partner/update-status", async (req, res) => {
  let conn;

  try {
    conn = await db.getConnection();

    const updateQuery = "UPDATE partners SET status = 1 WHERE status = 0";
    const result = await conn.query(updateQuery);

    const affectedRows = result.affectedRows;
    if (affectedRows > 0) {
      console.log("All inactive partners updated successfully");
      logToDatabase("Partner's status changed");
    } else {
      console.log("No inactive partner found");
    }

    res.json({ message: "Update successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.put("/user/update-status", async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();

    const updateQuery = "UPDATE users SET status = 1 WHERE status = 0";
    const result = await conn.query(updateQuery);

    const affectedRows = result.affectedRows;
    if (affectedRows > 0) {
      console.log("All inactive users updated successfully");
      logToDatabase("User's status changed");
    } else {
      console.log("No inactive user found");
    }

    res.json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.put("/users/:id", async (req, res) => {
  let conn;
  try {
    const userId = BigInt(req.params.id);
    const { name, email, username, phone, status, address } = req.body;

    const userData = await getUserData(userId);
    if (
      name === userData.name &&
      email === userData.email &&
      username === userData.username &&
      phone === userData.phone &&
      status === userData.status &&
      address === userData.address
    ) {
      res.json({ message: "No changes detected" });
      return;
    }

    const q =
      "UPDATE users SET name=?, email=?, username=?, phone=?, status=?, address=? WHERE id=?";
    conn = await db.getConnection();
    const data = await conn.query(q, [
      name,
      email,
      username,
      phone,
      status,
      address,
      userId,
    ]);

    const result = {
      affectedRows: data.affectedRows,
      message: "User Updated",
    };

    logToDatabase(`${result.message}`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

async function getUserData(userId) {
  let conn;
  try {
    conn = await db.getConnection();
    const q = "SELECT * FROM users WHERE id = ?";
    const userData = await conn.query(q, [userId]);

    if (!userData || userData.length === 0) {
      throw new Error("User not found");
    }
    return userData[0];
  } catch (err) {
    console.error(err);
    throw new Error("Failed to get user data");
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

app.put("/users/:id/partner", async (req, res) => {
  let conn;
  try {
    const userId = BigInt(req.params.id);
    const { partnerId } = req.body;
    let q;
    let params;

    const getUserNameQuery = "SELECT name FROM users WHERE id = ?";
    const userNameResult = await db.query(getUserNameQuery, [userId]);
    const userName = userNameResult.map((user) => user.name);

    const checkExistingConnectionQuery =
      "SELECT partner_id FROM connect WHERE user_id = ?";
    const existingConnectionResult = await db.query(
      checkExistingConnectionQuery,
      [userId]
    );

    if (existingConnectionResult.length === 0) {
      if(partnerId === "N/A"){
        return
      } else {
      q = "INSERT INTO connect (user_id, partner_id) VALUES (?, ?)";
      params = [userId, partnerId];
      }
    } else {
      q = "UPDATE connect SET partner_id = ? WHERE user_id = ?";
      params = [partnerId, userId];
    }

    conn = await db.getConnection();
    const data = await conn.query(q, params);

    const result = {
      affectedRows: data.affectedRows,
      message: "User partner updated",
    };

    logToDatabase(`${result.message}`);

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) {
      conn.release();
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const q = "SELECT * FROM users WHERE username = ? AND password = ?";
    const conn = await db.getConnection();
    const data = await conn.query(q, [username, password]);
    conn.release();

    if (data.length > 0) {
      res.json({ success: true, message: "Sikeres bejelentkezés" });

      const user = data[0];
      logToDatabase("User Logged In");
    } else {
      res
        .status(401)
        .json({ success: false, message: "Hibás felhasználónév vagy jelszó" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => console.log("Connected to the backend!"));
