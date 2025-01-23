import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  goToPage,
  setGoToPage,
  handleGoToPage,
}) => {
  return (
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
  );
};

export default Pagination;
