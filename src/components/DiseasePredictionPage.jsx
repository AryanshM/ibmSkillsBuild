// src/pages/DiseasePredictionPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DiseasePredictionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnosis, symptoms, answers } = location.state || {};

  if (!diagnosis) {
    return (
      <div className="diagnosis-page">
        <p className="error-text">Something went wrong. Please try again.</p>
        <button className="primary-button" onClick={() => navigate("/disease-detector")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="diagnosis-page">
      <h1 className="diagnosis-heading">Predicted Condition</h1>
      <div className="diagnosis-box">
        <h2 className="diagnosis-name">{diagnosis.diagnosis}</h2>
        <p className="diagnosis-details">{diagnosis.explanation}</p>
      </div>
      <button className="primary-button" onClick={() => navigate("/")}>
        Back to Start
      </button>
    </div>
  );
}

export default DiseasePredictionPage;
