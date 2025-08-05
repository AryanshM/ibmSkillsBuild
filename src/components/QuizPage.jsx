// src/components/QuizPage.jsx
import React, { useState } from 'react';
import { questions } from '../questions';
import Quiz from './Quiz';
import Results from './Results';

function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerOptionClick = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
  };

  const totalScore = answers.reduce((total, current) => total + current, 0);
  const maxScore = questions.length * 3;

  return (
    <div className="quiz-page">
      {showResults ? (
        <Results
          score={totalScore}
          totalScore={maxScore}
          onRestart={handleRestart}
          questions={questions}
          answers={answers}
        />
      ) : (
        <Quiz
          question={questions[currentQuestionIndex]}
          onAnswerClick={handleAnswerOptionClick}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}
    </div>
  );
}

export default QuizPage;