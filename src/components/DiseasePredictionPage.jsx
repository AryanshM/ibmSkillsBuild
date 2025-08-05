import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function DiseasePredictionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnosis, symptoms, answers } = location.state || { diagnosis: null, symptoms: [], answers: [] };

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-accent mb-12">Error</h1>
          <p className="text-xl text-red-500 mb-8">Could not retrieve diagnosis. Please try again.</p>
          <button
            className="btn"
            onClick={() => navigate("/disease-detector")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-12">Predicted Condition</h1>
        <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">{diagnosis.diagnosis}</h2>
          <p className="text-lg text-text-secondary">{diagnosis.explanation}</p>
        </div>
        <button
          className="btn mt-12"
          onClick={() => navigate("/")}
        >
          Back to Start
        </button>
      </div>
    </div>
  );
}

export default DiseasePredictionPage;