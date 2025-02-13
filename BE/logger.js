import maridb from "mariadb";

const db = maridb.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "mydb",
  connectionLimit: 5,
});

export const logToDatabase = async (logType) => {
  try {
    
    const conn = await db.getConnection();

    await conn.query(
      `INSERT INTO log (logtype_id) VALUES ((SELECT id FROM logtype WHERE logtype_name = ?))`,
      [logType]
    );
    
    conn.release();

    console.log(`Logging ${logType} to database`);
  } catch (error) {
    console.error("Error logging to database:", error);
  }
};

