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
  const [finalLoading, setFinalLoading] = useState(false); // ⬅️ New loading state

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
        handleGeneratePlan(); // Last question answered
      }
    }, 400);
  };

  const handleGeneratePlan = async () => {
    setFinalLoading(true); // Start loading screen
    try {
      const plan = await generateHealthPlan(objective, questions, answers);
      navigate("/planner-results", { state: { plan, objective } });
    } catch (err) {
      alert("Something went wrong while generating the plan.");
      console.error(err);
    } finally {
      setFinalLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  // Show loading screen while plan is being generated
  if (finalLoading) {
    return (
      <div className="follow-up-questions-page">
        <h1 className="follow-up-heading">Generating Your Personalized Plan...</h1>
        <p className="loading-message">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="follow-up-questions-page">
      <h1 className="follow-up-heading">Health Planning Questions</h1>
      {loading ? (
        <p className="loading-message">Generating questions for: {objective}</p>
      ) : currentQuestion ? (
        <div className="question-card">
          <h2 className="question-text">{`${currentIndex + 1}. ${currentQuestion.question}`}</h2>
          <div className="options-list">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-button ${
                  answers[currentIndex] === opt ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Failed to load questions.</p>
      )}

      <button className="back-button" onClick={() => navigate("/health-planner")}>
        Back
      </button>
    </div>
  );
}

export default HealthPlannerQuestionsPage;
