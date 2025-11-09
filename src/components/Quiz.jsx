import React from 'react';
import { ArrowRight } from 'lucide-react';

const Quiz = ({ question, onAnswerClick, questionNumber, totalQuestions }) => {
  const progressPercent = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-text-secondary">
              Question {questionNumber} of {totalQuestions}
            </p>
            <p className="text-sm font-semibold text-accent-primary">
              {Math.round(progressPercent)}%
            </p>
          </div>
          <div className="w-full bg-secondary-alt/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-accent-secondary to-accent-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card-lg border-2 border-accent-secondary/20 animate-fade-in">
          <div className="mb-12">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Mental Wellness Assessment</p>
            <h2 className="text-4xl font-accent font-bold text-text-primary leading-tight">
              {question.questionText}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.answerOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerClick(option.score)}
                className="group p-6 rounded-xl text-center font-semibold transition-all duration-300 border-2 bg-secondary-alt/30 text-text-primary border-accent-secondary/20 hover:border-accent-secondary hover:shadow-card hover:-translate-y-1"
              >
                <span className="text-lg">{option.answerText}</span>
                <div className="text-xs text-text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Impact: {option.score}/3
                </div>
              </button>
            ))}
          </div>

          {/* Helpful tip */}
          <div className="mt-10 pt-8 border-t border-accent-primary/20">
            <p className="text-sm text-text-secondary italic text-center">
              There are no wrong answers. Your honest responses help us provide better insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
