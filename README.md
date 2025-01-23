# Real-Time Dynamic Table with Backend Integration

This project is a full-stack implementation of a dynamic real-time table with real-time updates, search, sorting, pagination, and progress tracking, built with React on the frontend and Node.js with GraphQL on the backend.

## Features

### Frontend
1. **Dynamic Table**:
   - Displays 1,000 rows of real-time data.
   - Features:
     - **Search**: Search rows by any column.
     - **Sort**: Sort rows by column values.
     - **Pagination**: Efficiently handle large datasets with pagination.
2. **Real-Time Updates**:
   - Status field updates every 3 seconds:
     - 95% of rows transition from **In Progress** to **Done**.
     - 5% of rows transition to **Failed**.
   - New rows are added to the table every 3 seconds via WebSocket.
3. **Progress Bar**:
   - Displays the percentage of rows marked as "Done" or "Failed."
4. **Customizable UI**:
   - Built with React, with React Aria for enhanced accessibility.

### Backend
1. **Real-Time Data Management**:
   - Backend server generates and updates data in real-time using an in-memory queue.
2. **GraphQL API**:
   - Supports:
     - Retrieving table data.
     - Server-side pagination.
     - Streaming real-time updates via WebSockets.
3. **Data Flow**:
   - Utilizes WebSockets to send real-time updates to the frontend.

### Optional Enhancements
- Highlight failed rows with a different color.
- Filter rows by status (e.g., show only "Failed").
- Retry failed rows or cancel processing rows via API calls.
- Persist row data using a lightweight database like SQLite

---

## Installation and Setup

Follow these steps to run the project:

### 1. Clone the Repository
```bash
git clone https://github.com/maskboyAvi/RealTime_Table.git
cd RealTime_Table
```

### 2. Start the Frontend
```bash
cd ./real-time-table
npm install
npm start
```

### 3. Start the Backend
In a new terminal:
```bash
cd ./realtime-table-backend
npm install --legacy-peer-deps
node ./server.js
```
## Tools and Architecture
- Frontend: React.
- Backend: Node.js, GraphQL, WebSockets.
- Real-Time Updates: WebSockets for bi-directional data flow.
- Performance Optimizations: Designed to ensure smooth interaction and response times under 500ms.