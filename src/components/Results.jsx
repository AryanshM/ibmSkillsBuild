// src/components/Results.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import analyzeResponses from '../llm/screening';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Results = ({ questions: propQuestions, answers: propAnswers }) => {
  const [interpretation, setInterpretation] = useState({
    title: 'Response Analysis',
    diagnosis: '',
    text: 'Loading analysis...',
    treatment_required: 'no' // Initialize treatment_required
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const questions = useMemo(() => propQuestions, [propQuestions]);
  const answers = useMemo(() => propAnswers, [propAnswers]);

  const formatResponse = useCallback((questions, answers) => {
    const formattedResponses = questions.map((question, index) => {
      const answerText = question.answerOptions.find((answer, i) => i === answers[index])?.answerText || 'Not answered';
      return `Question: ${question.questionText}\nAnswer: ${answerText}`;
    }).join('\n\n');
    return formattedResponses;
  }, []);

  const getInterpretation = async () => {
    setLoading(true);
    try {
      const responseAnalysis = await analyzeResponses(formatResponse(questions, answers));
      console.log(responseAnalysis);
      setInterpretation({
        title: 'Response Analysis',
        diagnosis: responseAnalysis.diagnosis,
        text: responseAnalysis.recommendation,
        treatment_required: responseAnalysis.treatment_required || 'no' // Default to 'no' if not present
      });
    } catch (error) {
      console.error("Error getting interpretation:", error);
      setInterpretation({
        title: 'Response Analysis',
        diagnosis: 'Error',
        text: 'Failed to load analysis.',
        treatment_required: 'no'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInterpretation();
  }, [questions, answers, formatResponse]);

  const handleVisitDoctor = () => {
    // Implement the logic to redirect or navigate to a doctor's appointment booking page
    window.location.href = "https://www.example.com/book-appointment"; // Replace with your actual URL
  };

  return (
    <div className="results-card">
      <div className="results-grid-container">
        <div className="left-side">
          <Link to="/" className="restart-button">
            Go Home
          </Link>
          <div className="resources">
            <h4>Please find help here (India):</h4>
            <ul>
              <li><a href="https://vandrevalafoundation.com/" target="_blank" rel="noopener noreferrer">Vandrevala Foundation:</a> 24x7 Helpline</li>
              <li><a href="https://www.icallhelpline.org/" target="_blank" rel="noopener noreferrer">iCALL Psychosocial Helpline:</a> Available Mon-Sat</li>
              <li><a href="https://www.thelivelovelaughfoundation.org/helpline" target="_blank" rel="noopener noreferrer">The Live Love Laugh Foundation:</a> Resources & Helplines</li>
            </ul>
          </div>
          
        </div>
        <div className="right-side">
          <div className="results-interpretation">
            <h3>{interpretation.title}</h3>
            <h4>Diagnosis:</h4>
            {loading ? (
              <Skeleton count={3} />
            ) : (
              <p>{interpretation.diagnosis}</p>
            )}
            <h4>Recommendation:</h4>
            {loading ? (
              <Skeleton count={5} />
            ) : (
              <p>{interpretation.text}</p>
            )}
          </div>
          {interpretation.treatment_required === 'yes' && (
            <button className="visit-doctor-button" onClick={handleVisitDoctor}>
              Visit Doctor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;





