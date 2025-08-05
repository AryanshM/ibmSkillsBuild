import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function HealthPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, objective } = location.state || { plan: {}, objective: "" };

  if (!plan || !objective) {
    return (
      <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-accent mb-4">Something went wrong.</h1>
          <p className="text-lg text-text-secondary mb-8">Could not load your health plan.</p>
          <button
            className="btn"
            onClick={() => navigate("/health-planner")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderSection = (title, options) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-accent mb-6 border-b-2 border-secondary pb-3">{title}</h2>
      <ul className="space-y-4">
        {options && options.length > 0 ? (
          options.map((item, index) => (
            <li key={index} className="bg-secondary p-6 rounded-lg shadow-card text-lg text-text-secondary">
              {item}
            </li>
          ))
        ) : (
          <li className="text-text-secondary">No specific recommendations for this section.</li>
        )}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans">
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-accent mb-4">Your Personalized Health Plan</h1>
          <p className="text-xl text-text-secondary">
            Objective: <strong>{objective}</strong>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderSection("Diet Recommendations", plan.diet)}
          {renderSection("Sleep Schedule Options", plan.sleep)}
          {renderSection("Exercise Suggestions", plan.exercise)}
        </div>

        <div className="text-center mt-16">
          <button
            className="btn"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthPlanPage;