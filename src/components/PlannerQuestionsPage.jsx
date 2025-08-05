import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generatePlannerQuestions } from "../llm/generatePlannerQuestions";
import { generateHealthPlan } from "../llm/generateHealthPlan";

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

  const currentQuestion = questions[currentIndex];

  if (loading || finalLoading) {
    return (
      <div className="min-h-screen bg-primary text-text-primary font-sans flex flex-col items-center justify-center">
        <div className="spinner w-16 h-16 border-4 border-t-accent border-secondary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-text-secondary">
          {loading ? `Generating questions for: ${objective}` : "Generating your personalized plan..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-12">Health Planning Questions</h1>
        {currentQuestion ? (
          <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-3xl mx-auto animate-slide-in">
            <h2 className="text-3xl font-bold mb-8">{`${currentIndex + 1}. ${currentQuestion.question}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`btn text-lg w-full ${answers[currentIndex] === opt ? "bg-opacity-80" : ""}`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-500">Failed to load questions. Please try again.</p>
        )}
        <button
          className="btn mt-12"
          onClick={() => navigate("/health-planner")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default HealthPlannerQuestionsPage;