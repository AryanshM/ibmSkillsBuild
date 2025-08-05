// src/components/Quiz.js

import React from 'react';

const Quiz = ({ question, onAnswerClick, questionNumber, totalQuestions }) => {
  return (
    <div className="quiz-card">
      <div className="question-count">
        <span>Question {questionNumber}</span>/{totalQuestions}
      </div>
      
      {/* This new container enables the side-by-side layout */}
      <div className="quiz-body">
        <div className="question-section">
          <div className="question-text">{question.questionText}</div>
        </div>
        <div className="answer-section">
          {question.answerOptions.map((option, index) => (
            <button
              key={index}
              className="answer-button"
              onClick={() => onAnswerClick(option.score)}
            >
              {option.answerText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
