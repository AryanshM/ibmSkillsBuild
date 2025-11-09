import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generatePlannerQuestions } from "../llm/generatePlannerQuestions";
import { generateHealthPlan } from "../llm/generateHealthPlan";
import { ArrowRight, AlertCircle } from "lucide-react";

function HealthPlannerQuestionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const objective = location.state?.objective;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finalLoading, setFinalLoading] = useState(false);

  useEffect(() => {
    if (!objective) {
      navigate("/health-planner");
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const q = await generatePlannerQuestions(objective);
        setQuestions(q);
        setAnswers(new Array(q.length).fill(""));
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [objective, navigate]);

  const handleOptionSelect = (option) => {
    const updated = [...answers];
    updated[currentIndex] = option;
    setAnswers(updated);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleGeneratePlan();
      }
    }, 400);
  };

  const handleGeneratePlan = async () => {
    setFinalLoading(true);
    try {
      const plan = await generateHealthPlan(objective, questions, answers);
      navigate("/planner-results", { state: { plan, objective } });
    } catch (err) {
      alert("Something went wrong while generating the plan. Please try again.");
      console.error(err);
      setFinalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-accent-secondary rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Generating Questions
          </h1>
          <p className="text-text-secondary">Creating a personalized questionnaire for: <strong>{objective}</strong></p>
        </div>
      </div>
    );
  }

  if (finalLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-accent-primary border-t-accent-secondary rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Creating Your Plan
          </h1>
          <p className="text-text-secondary">Our AI is preparing your personalized lifestyle plan...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Goal Display */}
          <div className="mb-8 p-4 bg-accent-primary/10 rounded-lg border border-accent-primary/20">
            <p className="text-sm text-text-secondary">Goal</p>
            <p className="text-xl font-bold text-accent-primary">{objective}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-text-secondary">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p className="text-sm font-semibold text-accent-primary">
                {Math.round(progressPercent)}%
              </p>
            </div>
            <div className="w-full bg-secondary-alt/30 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent-primary to-accent-secondary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          {currentQuestion ? (
            <div className="card-lg border-2 border-accent-primary/20 animate-fade-in">
              <h2 className="text-3xl font-accent font-bold text-text-primary mb-8 leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-6 rounded-xl font-semibold transition-all duration-300 text-center border-2 ${
                      answers[currentIndex] === opt
                        ? 'bg-gradient-sage text-white border-accent-primary shadow-card'
                        : 'bg-secondary-alt/30 text-text-primary border-accent-primary/20 hover:border-accent-primary/50 hover:shadow-soft'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {answers[currentIndex] && (
                <div className="mt-8 pt-8 border-t border-accent-primary/20">
                  <button
                    onClick={() => {
                      if (currentIndex < questions.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                      } else {
                        handleGeneratePlan();
                      }
                    }}
                    className="btn w-full flex items-center justify-center gap-2 text-lg"
                  >
                    {currentIndex === questions.length - 1 ? 'Generate My Plan' : 'Next Question'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card-lg border-2 border-danger/30 bg-danger/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-danger mb-2">Unable to Load Questions</h3>
                  <p className="text-text-secondary mb-6">
                    We couldn't generate personalized questions for your goal. Please try again.
                  </p>
                  <button
                    className="btn"
                    onClick={() => navigate("/health-planner")}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex gap-4">
            <button
              className="btn-outline flex-1"
              onClick={() => navigate("/health-planner")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthPlannerQuestionsPage;
