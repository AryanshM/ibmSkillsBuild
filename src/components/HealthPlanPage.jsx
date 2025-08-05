import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PlannerResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, objective } = location.state || {};

  if (!plan || !objective) {
    return (
      <div className="health-plan-page">
        <h2>Something went wrong.</h2>
        <button onClick={() => navigate("/health-planner")}>Go Back</button>
      </div>
    );
  }

  const renderSection = (title, options) => (
    <div className="plan-section">
      <h2>{title}</h2>
      <ul>
        {options.map((item, index) => (
          <li key={index} className="plan-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="health-plan-page">
      <h1 className="plan-title">Your Personalized Health Plan</h1>
      <p className="plan-subtitle">Objective: <strong>{objective}</strong></p>

      {renderSection("Diet Recommendations", plan.diet)}
      {renderSection("Sleep Schedule Options", plan.sleep)}
      {renderSection("Exercise Suggestions", plan.exercise)}

      <button className="back-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}

export default PlannerResultsPage;
