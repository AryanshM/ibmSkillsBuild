import React from 'react';
import { Outlet } from 'react-router-dom';
import './styles.css';

function App() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
}

export default App;
