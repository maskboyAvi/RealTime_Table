const { WebSocketServer } = require("ws");
const { db } = require("./database");

const startWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    const interval = setInterval(() => {
      db.serialize(() => {
        db.run(`
          UPDATE rows
          SET status = CASE
            WHEN RANDOM() % 20 = 0 THEN 'Failed'
            ELSE 'Done'
          END
          WHERE status = 'In Progress'
        `);

        db.get("SELECT MAX(id) as maxId FROM rows", (err, row) => {
          if (err) {
            console.error("Error querying max ID:", err.message);
            return;
          }
          const newId = (row.maxId || 0) + 1;
          const newRowName = `Row ${newId}`;

          db.run(
            "INSERT INTO rows (name, status) VALUES (?, ?)",
            [newRowName, "In Progress"],
            function (err) {
              if (err) {
                console.error("Error inserting row:", err.message);
              } else {
                const newRow = {
                  id: this.lastID,
                  name: newRowName,
                  status: "In Progress",
                };
                ws.send(JSON.stringify({ type: "update", newRow }));
              }
            }
          );
        });
      });
    }, 3000);

    ws.on("close", () => clearInterval(interval));
  });
};

module.exports = { startWebSocketServer };