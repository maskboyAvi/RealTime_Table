import React from "react";

const RowActions = ({ retryFailedRows, cancelProcessingRows }) => {
  return (
    <div>
      <button onClick={retryFailedRows}>Retry Failed Rows</button>
      <button onClick={cancelProcessingRows}>Cancel Processing Rows</button>
    </div>
  );
};

export default RowActions;