import React, { useState, useEffect } from "react";
import "./styles.css";

const Table = ({ searchQuery }) => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [progressDone, setProgressDone] = useState(0);
  const [progressFailed, setProgressFailed] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [socket, setSocket] = useState(null);
  const [goToPage, setGoToPage] = useState("");

  // Fetch rows for the current page from the backend
  const fetchRows = async (page = 1, sortKey = null, sortDirection = null) => {
    const offset = (page - 1) * rowsPerPage;

    const query = `
      query GetRows($offset: Int, $limit: Int, $sortKey: String, $sortDirection: String) {
        getRows(offset: $offset, limit: $limit, sortKey: $sortKey, sortDirection: $sortDirection) {
          id
          name
          status
        }
      }
    `;

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { offset, limit: rowsPerPage, sortKey, sortDirection },
      }),
    });

    const result = await response.json();
    if (result.data && result.data.getRows) {
      setRows(result.data.getRows);
    }
  };

  // Fetch total row count from the backend
  const fetchTotalRowCount = async () => {
    const query = `
      query {
        getRowCount
      }
    `;

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.data && result.data.getRowCount) {
      setTotalRowCount(result.data.getRowCount);
    }
  };

  const retryFailedRows = async () => {
    const mutation = `
      mutation {
        retryFailedRows {
          id
          name
          status
        }
      }
    `;

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.data && result.data.retryFailedRows) {
      setRows(result.data.retryFailedRows); // Update the table with new data
    }
  };

  const cancelProcessingRows = async () => {
    const mutation = `
      mutation {
        cancelProcessingRows {
          id
          name
          status
        }
      }
    `;

    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    if (result.data && result.data.cancelProcessingRows) {
      setRows(result.data.cancelProcessingRows); // Update the table with new data
    }
  };
  // Initial data fetch and WebSocket setup
  useEffect(() => {
    fetchRows(currentPage, sortConfig.key, sortConfig.direction);
    fetchTotalRowCount();

    const ws = new WebSocket("ws://localhost:4000");
    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "update") {
        fetchRows(currentPage, sortConfig.key, sortConfig.direction);
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [currentPage, sortConfig]);

  // Calculate progress bars
  useEffect(() => {
    const doneCount = rows.filter((row) => row.status === "Done").length;
    const failedCount = rows.filter((row) => row.status === "Failed").length;
    const totalRows = rows.length;

    setProgressDone((doneCount / totalRows) * 100 || 0);
    setProgressFailed((failedCount / totalRows) * 100 || 0);
  }, [rows]);

  // Filter rows based on search query
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredRows(filtered);
  }, [searchQuery, rows]);

  // Sort rows based on column
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle "Go To Page" input and button
  const handleGoToPage = () => {
    const page = parseInt(goToPage, 10);
    if (
      !isNaN(page) &&
      page > 0 &&
      page <= Math.ceil(totalRowCount / rowsPerPage)
    ) {
      setCurrentPage(page);
    }
    setGoToPage("");
  };

  // Pagination controls
  const totalPages = Math.ceil(totalRowCount / rowsPerPage);

  return (
    <div>
      <div className="progress-container">
        <h2>Progress</h2>
        <p>Done: {Math.round(progressDone)}%</p>
        <progress className="done" value={progressDone} max="100"></progress>
      </div>

      <div className="progress-container">
        <p>Failed: {Math.round(progressFailed)}%</p>
        <progress
          className="failed"
          value={progressFailed}
          max="100"
        ></progress>
      </div>
      <div>
        <button onClick={retryFailedRows}>Retry Failed Rows</button>
        <button onClick={cancelProcessingRows}>Cancel Processing Rows</button>

      </div>
      <div className="table-container">
        <h2>Rows</h2>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                ID{" "}
                {sortConfig.key === "id" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("status")}
                style={{ cursor: "pointer" }}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr 
              key={row.id}
              style={{
                backgroundColor:
                row.status === "Failed"
                  ? "#f8d7da"
                  : row.status === "Done"
                  ? "#d4edda"
                  : "white",
              }}
              >
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <input
          type="number"
          placeholder="Go to page"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
        />
        <button onClick={handleGoToPage}>Go</button>
      </div>
    </div>
  );
};

export default Table;
