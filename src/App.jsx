// src/App.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import './styles.css';


function App() {
  return (
    <div className="app-container">
      <Outlet />
      <br />
      <br />
      <div className="disclaimer">
        <strong>Important Disclaimer:</strong> This quiz is not a diagnostic tool. It is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing mental health concerns, please consult a qualified healthcare provider.
      </div>
    </div>
  );
}

export default App;