import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HealthPlannerPage() {
  const [objective, setObjective] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!objective.trim()) {
      alert("Please enter your health objective.");
      return;
    }
    navigate("/planner-questions", { state: { objective } });
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-4">What's your health goal?</h1>
        <p className="text-lg text-text-secondary mb-8">
          e.g., "Lose 5kg", "Build muscle", "Improve sleep", "Reduce stress"
        </p>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter your goal..."
            className="w-full bg-secondary text-text-primary placeholder-text-secondary px-5 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mb-6"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button className="btn text-xl w-full" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthPlannerPage;