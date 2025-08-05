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
  const [isDetecting, setIsDetecting] = useState(false);
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
        handleDetectDisease();
      }
    }, 400);
  };

  const handleDetectDisease = async () => {
    setIsDetecting(true);
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
      alert("Something went wrong while detecting the disease. Please try again.");
      setIsDetecting(false);
    }
  };

  const currentQuestion = followUpQuestions[currentIndex];

  if (loading || isDetecting) {
    return (
      <div className="min-h-screen bg-primary text-text-primary font-sans flex flex-col items-center justify-center">
        <div className="spinner w-16 h-16 border-4 border-t-accent border-secondary rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-text-secondary">
          {loading ? "Generating questions..." : "Analyzing responses..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-12">Follow-up Questions</h1>
        {currentQuestion ? (
          <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-3xl mx-auto animate-slide-in">
            <h2 className="text-3xl font-bold mb-8">{`${currentIndex + 1}. ${currentQuestion.question}`}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`btn text-lg w-full ${selectedAnswers[currentIndex] === option ? "bg-opacity-80" : ""}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-500">Failed to load follow-up questions. Please try again.</p>
        )}
        <div className="mt-8">
          <button
            className="btn"
            onClick={() => navigate("/disease-detector")}
          >
            Back to Symptoms
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowUpQuestionsPage;