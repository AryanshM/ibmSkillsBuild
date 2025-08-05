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
    <div className="health-planner-page">
      <h1 className="planner-heading">What's your health goal?</h1>
      <p className="planner-subtext">
        Example: "Lose 5kg", "Build muscle", "Improve sleep", "Reduce stress", etc.
      </p>

      <input
        type="text"
        placeholder="Enter your goal..."
        className="planner-input"
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />

      <button className="planner-submit-button" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}

export default HealthPlannerPage;
