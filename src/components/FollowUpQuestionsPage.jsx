import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateFollowUpQuestions } from "../llm/FollowUpQuestions";
import { detectDisease } from "../llm/detectDiseases";
import { ArrowRight, AlertCircle } from "lucide-react";

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
      alert("Something went wrong. Please try again.");
      setIsDetecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-accent-secondary border-t-accent-primary rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Generating Questions
          </h1>
          <p className="text-text-secondary">Analyzing your symptoms to create personalized questions...</p>
        </div>
      </div>
    );
  }

  if (isDetecting) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 border-4 border-accent-secondary border-t-accent-primary rounded-full animate-spin"></div>
          </div>
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Analyzing Your Responses
          </h1>
          <p className="text-text-secondary">Our AI is preparing personalized health insights...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = followUpQuestions[currentIndex];
  const progressPercent = ((currentIndex + 1) / followUpQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-text-secondary">
                Question {currentIndex + 1} of {followUpQuestions.length}
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
            <div className="card-lg border-2 border-accent-secondary/20 animate-fade-in">
              <h2 className="text-3xl font-accent font-bold text-text-primary mb-8 leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-6 rounded-xl font-semibold transition-all duration-300 text-center border-2 ${
                      selectedAnswers[currentIndex] === option
                        ? 'bg-gradient-sage text-white border-accent-primary shadow-card'
                        : 'bg-secondary-alt/30 text-text-primary border-accent-primary/20 hover:border-accent-primary/50 hover:shadow-soft'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswers[currentIndex] && (
                <div className="mt-8 pt-8 border-t border-accent-primary/20">
                  <button
                    onClick={() => {
                      if (currentIndex < followUpQuestions.length - 1) {
                        setCurrentIndex((prev) => prev + 1);
                      } else {
                        handleDetectDisease();
                      }
                    }}
                    className="btn w-full flex items-center justify-center gap-2 text-lg"
                  >
                    {currentIndex === followUpQuestions.length - 1 ? 'Get Results' : 'Next Question'}
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
                    We couldn't generate follow-up questions for your symptoms. Please try again.
                  </p>
                  <button
                    className="btn"
                    onClick={() => navigate("/disease-detector")}
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
              onClick={() => navigate("/disease-detector")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUpQuestionsPage;
