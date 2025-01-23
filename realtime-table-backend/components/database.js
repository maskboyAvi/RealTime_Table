const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./tableData.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

const createTable = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS rows (
        id INTEGER PRIMARY KEY,
        name TEXT,
        status TEXT
      )
    `);
  });
};

const populateInitialData = () => {
  db.get("SELECT COUNT(*) as count FROM rows", (err, row) => {
    if (err) {
      console.error("Error querying database:", err.message);
    } else if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO rows (name, status) VALUES (?, ?)");
      for (let i = 0; i < 1000; i++) {
        stmt.run(`Row ${i + 1}`, "In Progress");
      }
      stmt.finalize();
      console.log("Populated initial data.");
    }
  });
};

module.exports = { db, createTable, populateInitialData };