import React from 'react';

const Quiz = ({ question, onAnswerClick, questionNumber, totalQuestions }) => {
  return (
    <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-3xl mx-auto animate-slide-in">
      <div className="text-lg text-text-secondary mb-8 text-center">
        <span>Question {questionNumber}</span>/{totalQuestions}
      </div>
      <div className="text-4xl font-bold text-center mb-12">{question.questionText}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {question.answerOptions.map((option, index) => (
          <button
            key={index}
            className="btn text-lg w-full"
            onClick={() => onAnswerClick(option.score)}
          >
            {option.answerText}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;