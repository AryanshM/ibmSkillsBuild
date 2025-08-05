import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateFollowUpQuestions } from "../llm/FollowUpQuestions";
import { detectDisease } from "../llm/detectDiseases";

function FollowUpQuestionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false); // ✅ New
  const symptoms = location.state?.symptoms || [];

  useEffect(() => {
    if (symptoms.length === 0) {
      navigate("/disease-detector");
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const questions = await generateFollowUpQuestions(symptoms);
        setFollowUpQuestions(questions);
        setSelectedAnswers(new Array(questions.length).fill(null));
      } catch (error) {
        console.error("Error fetching follow-up questions:", error);
        setFollowUpQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [symptoms, navigate]);

  const handleOptionSelect = (option) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = option;
    setSelectedAnswers(updatedAnswers);

    setTimeout(() => {
      if (currentIndex < followUpQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleDetectDisease(); // Call when last one is answered
      }
    }, 400);
  };

  const handleDetectDisease = async () => {
    setIsDetecting(true); // ✅ Show loading screen
    try {
      const diagnosis = await detectDisease(
        symptoms,
        followUpQuestions,
        selectedAnswers
      );
      navigate("/diagnosis", {
        state: { diagnosis, symptoms, answers: selectedAnswers },
      });
    } catch (err) {
      console.error("Error detecting disease:", err);
      alert("Something went wrong while detecting the disease.");
      setIsDetecting(false);
    }
  };

  const currentQuestion = followUpQuestions[currentIndex];

  if (loading) {
    return (
      <div className="follow-up-questions-page">
        <p className="loading-message">Generating questions based on your symptoms...</p>
      </div>
    );
  }

  if (isDetecting) {
    return (
      <div className="follow-up-questions-page">
        <p className="loading-message">Analyzing your responses...</p>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="follow-up-questions-page">
      <h1 className="follow-up-heading">Follow-up Questions</h1>

      {currentQuestion ? (
        <div className="question-card">
          <h2 className="question-text">{`${currentIndex + 1}. ${currentQuestion.question}`}</h2>
          <div className="options-list">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-button ${
                  selectedAnswers[currentIndex] === option ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Failed to load follow-up questions.</p>
      )}

      <br />
      <button className="back-button" onClick={() => navigate("/disease-detector")}>
        Go Back to Symptoms
      </button>
    </div>
  );
}

export default FollowUpQuestionsPage;
