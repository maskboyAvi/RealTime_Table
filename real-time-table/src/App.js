import React, { useState } from 'react';
import './App.css';
import Table from './components/Table';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="App">
      <h1>Real-Time Table</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ margin: '10px', padding: '5px', width: '200px' }}
      />

      {/* Pass the searchQuery as prop to Table component */}
      <Table searchQuery={searchQuery} />
    </div>
  );
}

export default App;
