import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import analyzeResponses from '../llm/screening';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Results = ({ questions: propQuestions, answers: propAnswers }) => {
  const [interpretation, setInterpretation] = useState({
    title: 'Response Analysis',
    diagnosis: '',
    text: 'Loading analysis...',
    treatment_required: 'no'
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const questions = useMemo(() => propQuestions, [propQuestions]);
  const answers = useMemo(() => propAnswers, [propAnswers]);

  const formatResponse = useCallback((questions, answers) => {
    return questions.map((question, index) => {
      const answerOption = question.answerOptions.find((_, i) => i === answers[index]);
      const answerText = answerOption ? answerOption.answerText : 'Not answered';
      return `Question: ${question.questionText}\nAnswer: ${answerText}`;
    }).join('\n\n');
  }, []);

  const getInterpretation = async () => {
    setLoading(true);
    try {
      const formattedResponses = formatResponse(questions, answers);
      const responseAnalysis = await analyzeResponses(formattedResponses);
      setInterpretation({
        title: 'Response Analysis',
        diagnosis: responseAnalysis.diagnosis || 'N/A',
        text: responseAnalysis.recommendation || 'No specific recommendations provided.',
        treatment_required: responseAnalysis.treatment_required || 'no'
      });
    } catch (error) {
      console.error("Error getting interpretation:", error);
      setInterpretation({
        title: 'Response Analysis',
        diagnosis: 'Error',
        text: 'Failed to load analysis. Please try again later.',
        treatment_required: 'no'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questions && answers && questions.length > 0 && answers.length > 0) {
      getInterpretation();
    } else {
      setLoading(false);
      setInterpretation({
        title: 'Response Analysis',
        diagnosis: 'No Data',
        text: 'No quiz data available to analyze.',
        treatment_required: 'no'
      });
    }
  }, [questions, answers, formatResponse]);

  const handleVisitDoctor = () => {
    window.open("https://www.example.com/find-doctor", "_blank");
  };

  return (
    <div className="bg-secondary p-12 rounded-4xl shadow-card max-w-4xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="text-left">
          <Link to="/" className="btn mb-8">
            Go Home
          </Link>
          <div className="mt-8">
            <h4 className="text-xl font-semibold text-text-secondary mb-4">Helpful Resources:</h4>
            <ul className="space-y-2">
              <li><a href="https://vandrevalafoundation.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Vandrevala Foundation</a></li>
              <li><a href="https://www.icallhelpline.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">iCALL Psychosocial Helpline</a></li>
              <li><a href="https://www.thelivelovelaughfoundation.org/helpline" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">The Live Love Laugh Foundation</a></li>
            </ul>
          </div>
        </div>
        <div className="text-left">
          <div className="bg-primary p-8 rounded-2xl shadow-inner">
            <h3 className="text-3xl font-bold text-accent mb-4">{interpretation.title}</h3>
            <h4 className="text-xl font-semibold mb-3">Diagnosis:</h4>
            {loading ? (
              <Skeleton count={3} baseColor="#2c2c2e" highlightColor="#1c1c1e" height={20} />
            ) : (
              <p className="text-lg text-text-secondary mb-5">{interpretation.diagnosis}</p>
            )}
            <h4 className="text-xl font-semibold mb-3">Recommendation:</h4>
            {loading ? (
              <Skeleton count={5} baseColor="#2c2c2e" highlightColor="#1c1c1e" height={18} />
            ) : (
              <p className="text-lg text-text-secondary">{interpretation.text}</p>
            )}
          </div>
          {interpretation.treatment_required === 'yes' && (
            <button
              className="btn mt-8 w-full text-lg"
              onClick={handleVisitDoctor}
            >
              Visit Doctor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
