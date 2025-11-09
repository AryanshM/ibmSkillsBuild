import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Apple, Zap, Moon, Home, AlertCircle } from "lucide-react";

function HealthPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, objective } = location.state || { plan: {}, objective: "" };

  if (!plan || !objective) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card-lg text-center border-2 border-danger/30 bg-danger/5">
              <AlertCircle className="w-16 h-16 text-danger mx-auto mb-6" />
              <h1 className="text-4xl font-accent font-bold text-text-primary mb-4">
                Unable to Load Plan
              </h1>
              <p className="text-lg text-text-secondary mb-8">
                We couldn't retrieve your personalized health plan. Please start over.
              </p>
              <button
                className="btn"
                onClick={() => navigate("/health-planner")}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-accent font-bold text-accent-primary mb-4">
              Your Personal Wellness Plan
            </h1>
            <p className="text-2xl text-accent-primary font-semibold mb-2">{objective}</p>
            <p className="text-lg text-text-secondary">
              Personalized recommendations designed just for you
            </p>
          </div>

          {/* Introduction Card */}
          <div className="card-lg border-2 border-accent-primary/20 mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Getting Started</h2>
            <p className="text-text-secondary mb-6">
              This plan has been customized based on your responses. Remember, consistency is key to success. 
              Start with one small change and gradually build healthy habits. If needed, consult with a healthcare 
              professional before making major changes to your lifestyle.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-secondary-alt/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-accent-primary">3</p>
                <p className="text-sm text-text-secondary mt-1">Categories</p>
              </div>
              <div className="bg-secondary-alt/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-accent-secondary">
                  {[plan.diet?.length || 0, plan.sleep?.length || 0, plan.exercise?.length || 0]
                    .reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-sm text-text-secondary mt-1">Tips</p>
              </div>
              <div className="bg-secondary-alt/30 rounded-lg p-4">
                <p className="text-3xl font-bold text-accent-tertiary">∞</p>
                <p className="text-sm text-text-secondary mt-1">Duration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {plan.diet && plan.diet.length > 0 && (
            <PlanSection
              title="Nutrition & Diet"
              icon={Apple}
              items={plan.diet}
              color="text-accent-tertiary"
              bgColor="bg-accent-tertiary/10"
              borderColor="border-accent-tertiary/20"
            />
          )}

          {plan.exercise && plan.exercise.length > 0 && (
            <PlanSection
              title="Exercise & Movement"
              icon={Zap}
              items={plan.exercise}
              color="text-accent-secondary"
              bgColor="bg-accent-secondary/10"
              borderColor="border-accent-secondary/20"
            />
          )}

          {plan.sleep && plan.sleep.length > 0 && (
            <PlanSection
              title="Sleep & Rest"
              icon={Moon}
              items={plan.sleep}
              color="text-accent-primary"
              bgColor="bg-accent-primary/10"
              borderColor="border-accent-primary/20"
            />
          )}
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card border-l-4 border-accent-secondary">
            <h3 className="text-xl font-bold text-accent-secondary mb-4">Success Tips</h3>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary flex-shrink-0">→</span>
                <span>Start small and build gradually</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary flex-shrink-0">→</span>
                <span>Track your progress and celebrate wins</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary flex-shrink-0">→</span>
                <span>Be consistent with your new habits</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary flex-shrink-0">→</span>
                <span>Adjust based on how you feel</span>
              </li>
            </ul>
          </div>

          <div className="card border-l-4 border-accent-primary">
            <h3 className="text-xl font-bold text-accent-primary mb-4">When to Seek Help</h3>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary flex-shrink-0">✓</span>
                <span>Persistent pain or discomfort</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary flex-shrink-0">✓</span>
                <span>No progress after 4 weeks</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary flex-shrink-0">✓</span>
                <span>New or worsening symptoms</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary flex-shrink-0">✓</span>
                <span>Mental health concerns</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-16 flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 btn flex items-center justify-center gap-2 text-lg"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            className="flex-1 btn-secondary text-lg"
            onClick={() => navigate("/health-planner")}
          >
            Create New Plan
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Health Disclaimer:</strong> This plan is for informational purposes and is not a substitute for 
        professional medical advice. Always consult with a qualified healthcare provider before making significant 
        lifestyle changes. If you have existing health conditions or are taking medications, discuss this plan with your doctor.
      </div>
    </div>
  );
}

function PlanSection({ title, icon: Icon, items, color, bgColor, borderColor }) {
  return (
    <div className={`card-lg border-2 ${borderColor}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`${bgColor} rounded-lg p-3`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h2 className="text-3xl font-accent font-bold text-text-primary">{title}</h2>
      </div>

      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={index}
              className={`${bgColor} border border-transparent hover:border-2 ${borderColor} rounded-lg p-6 transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className={`${color} font-bold text-lg flex-shrink-0 mt-0.5`}>
                  {index + 1}
                </div>
                <p className="text-text-secondary leading-relaxed">{item}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary italic">No recommendations for this category.</p>
        )}
      </div>
    </div>
  );
}

export default HealthPlanPage;
