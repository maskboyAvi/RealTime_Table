const { db } = require("./database");

const getRows = ({ offset = 0, limit = 100, sortKey, sortDirection }) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM rows";
    if (sortKey) {
      query += ` ORDER BY ${sortKey} ${sortDirection === "ascending" ? "ASC" : "DESC"}`;
    }
    query += " LIMIT ? OFFSET ?";
    db.all(query, [limit, offset], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getRowCount = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM rows", (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
};

const retryFailedRows = () => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE rows SET status = 'In Progress' WHERE status = 'Failed'", function (err) {
      if (err) reject(err);
      else {
        db.all("SELECT * FROM rows WHERE status = 'In Progress'", (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }
    });
  });
};

const cancelProcessingRows = () => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE rows SET status = 'Cancelled' WHERE status = 'In Progress'", function (err) {
      if (err) reject(err);
      else {
        db.all("SELECT * FROM rows WHERE status IN ('Cancelled', 'In Progress')", (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }
    });
  });
};

module.exports = { getRows, getRowCount, retryFailedRows, cancelProcessingRows };