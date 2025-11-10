import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-primary text-text-primary flex flex-col">
      {/* You can add a Navbar or global header here */}
      <Outlet /> {/* 👈 This renders the current route (Auth, HomePage, etc.) */}
    </div>
  );
}

export default App;
