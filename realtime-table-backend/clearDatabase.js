const sqlite3 = require("sqlite3").verbose();

// Path to your SQLite database file
const dbPath = "./tableData.db";

// Connect to the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Function to clear the database
db.serialize(() => {
  db.run("DELETE FROM rows", (err) => {
    if (err) {
      console.error("Error clearing rows table:", err.message);
    } else {
      console.log("Successfully cleared all rows from the 'rows' table.");
    }
  });

  db.run("DELETE FROM sqlite_sequence WHERE name='rows'", (err) => {
    if (err) {
      console.error("Error resetting row IDs:", err.message);
    } else {
      console.log("Successfully reset the row ID counter.");
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err.message);
  } else {
    console.log("Database connection closed.");
  }
});
