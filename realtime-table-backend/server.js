const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");

const { createTable, populateInitialData } = require("./components/database");
const { getRows, getRowCount, retryFailedRows, cancelProcessingRows } = require("./components/graphqlResolvers");
const { startWebSocketServer } = require("./components/websocketHandler");

const app = express();
const PORT = 4000;

app.use(cors());

// Initialize database and populate initial data
createTable();
populateInitialData();

// GraphQL schema
const schema = buildSchema(`
  type Row {
    id: Int
    name: String
    status: String
  }

  type Query {
    getRows(offset: Int, limit: Int, sortKey: String, sortDirection: String): [Row]
    getRowCount: Int
  }

  type Mutation {
    retryFailedRows: [Row]
    cancelProcessingRows: [Row]
  }
`);

// GraphQL resolvers
const root = {
  getRows,
  getRowCount,
  retryFailedRows,
  cancelProcessingRows,
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

// Start WebSocket server
startWebSocketServer(server);
