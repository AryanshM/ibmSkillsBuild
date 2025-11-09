import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, ArrowRight, Lightbulb } from "lucide-react";

function HealthPlannerPage() {
  const [objective, setObjective] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();

  const suggestedGoals = [
    "Lose weight",
    "Build muscle",
    "Improve sleep",
    "Reduce stress",
    "Increase energy",
    "Better nutrition",
    "Regular exercise",
    "Mental clarity",
  ];

  const handleSubmit = () => {
    const goal = objective.trim() || selectedGoal;
    if (!goal) {
      alert("Please enter or select your health objective.");
      return;
    }
    navigate("/planner-questions", { state: { objective: goal } });
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-accent-primary/20 rounded-full p-4">
              <BarChart3 className="w-12 h-12 text-accent-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Personalized Lifestyle Plan
          </h1>
          <p className="text-xl text-text-secondary">
            Tell us your health goal and let our AI create a customized plan for your success.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Input Section */}
          <div className="card-lg border-2 border-accent-primary/20 mb-12 animate-slide-in">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              What's your health goal?
            </h2>
            <p className="text-text-secondary mb-8">
              Be specific and realistic. Examples: "Lose 5kg", "Build muscle", "Improve sleep quality"
            </p>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Enter your specific goal..."
                className="w-full bg-secondary text-text-primary placeholder-text-secondary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all mb-3"
                value={objective}
                onChange={(e) => {
                  setObjective(e.target.value);
                  setSelectedGoal(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <p className="text-sm text-text-secondary">
                {objective ? `You entered: "${objective}"` : "Or choose from suggestions below"}
              </p>
            </div>

            {/* Suggested Goals Grid */}
            <div className="mb-10">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Or Choose a Common Goal
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {suggestedGoals.map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedGoal(goal);
                      setObjective("");
                    }}
                    className={`p-4 rounded-lg font-semibold transition-all duration-300 border-2 text-center ${
                      selectedGoal === goal
                        ? 'bg-gradient-sage text-white border-accent-primary shadow-card'
                        : 'bg-secondary-alt/30 text-text-primary border-accent-primary/20 hover:border-accent-primary/50 hover:shadow-soft'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className="btn w-full flex items-center justify-center gap-2 text-lg py-4"
              onClick={handleSubmit}
            >
              Create My Plan
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-accent-primary/20 rounded-lg p-2 flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="font-bold text-text-primary">AI-Powered</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Get personalized recommendations tailored to your unique needs and lifestyle.
              </p>
            </div>

            <div className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-accent-secondary/20 rounded-lg p-2 flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-accent-secondary" />
                </div>
                <h3 className="font-bold text-text-primary">Comprehensive</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Covers diet, exercise, sleep, and lifestyle optimization in one unified plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthPlannerPage;
