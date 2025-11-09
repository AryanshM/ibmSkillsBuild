import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import analyzeResponses from '../llm/screening';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Brain, Heart, TrendingUp, ExternalLink } from 'lucide-react';

const Results = ({ questions: propQuestions, answers: propAnswers }) => {
  const [interpretation, setInterpretation] = useState({
    title: 'Mental Wellness Analysis',
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
        title: 'Mental Wellness Analysis',
        diagnosis: responseAnalysis.diagnosis || 'N/A',
        text: responseAnalysis.recommendation || 'No specific recommendations provided.',
        treatment_required: responseAnalysis.treatment_required || 'no'
      });
    } catch (error) {
      console.error("Error getting interpretation:", error);
      setInterpretation({
        title: 'Mental Wellness Analysis',
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
        title: 'Mental Wellness Analysis',
        diagnosis: 'No Data',
        text: 'No quiz data available to analyze.',
        treatment_required: 'no'
      });
    }
  }, [questions, answers, formatResponse]);

  const totalScore = answers.reduce((total, current) => total + current, 0);
  const maxScore = questions.length * 3;
  const scorePercentage = (totalScore / maxScore) * 100;

  const handleVisitDoctor = () => {
    window.open("https://www.example.com/find-doctor", "_blank");
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-accent-secondary/20 rounded-full p-4">
              <Brain className="w-12 h-12 text-accent-secondary" />
            </div>
          </div>
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Your Mental Wellness Assessment
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Score & Resources */}
          <div className="space-y-8">
            {/* Score Card */}
            <div className="card-lg border-2 border-accent-secondary/20">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">Your Wellness Score</p>
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-secondary-alt/30"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${(scorePercentage / 100) * 276.4} 276.4`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                        <stop offset="0%" style={{ stopColor: '#6B9CB0', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8B9E8F', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent-secondary">{Math.round(scorePercentage)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Score</p>
                  <p className="text-3xl font-bold text-text-primary">{totalScore}/{maxScore}</p>
                </div>
              </div>
              <div className="bg-secondary-alt/30 rounded-lg p-4 text-sm text-text-secondary">
                <p>This score reflects your responses to the mental wellness assessment. It's one indicator of your emotional well-being.</p>
              </div>
            </div>

            {/* Helpful Resources */}
            <div className="card-lg">
              <h3 className="text-xl font-bold text-accent-secondary mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Support Resources
              </h3>
              <div className="space-y-3">
                <ResourceLink
                  title="Vandrevala Foundation"
                  url="https://vandrevalafoundation.com/"
                  description="Mental health support and counseling"
                />
                <ResourceLink
                  title="iCALL Helpline"
                  url="https://www.icallhelpline.org/"
                  description="Psychosocial helpline services"
                />
                <ResourceLink
                  title="The Live Love Laugh Foundation"
                  url="https://www.thelivelovelaughfoundation.org/helpline"
                  description="Mental wellness resources and support"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Analysis */}
          <div className="card-lg border-2 border-accent-secondary/20">
            <h3 className="text-2xl font-accent font-bold text-text-primary mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent-secondary" />
              {interpretation.title}
            </h3>

            <div className="mb-8">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-2">Assessment Result</p>
              {loading ? (
                <Skeleton count={2} baseColor="#E8EFF7" highlightColor="#D8E5D8" height={20} />
              ) : (
                <p className="text-2xl font-bold text-accent-secondary mb-2">{interpretation.diagnosis}</p>
              )}
            </div>

            <div className="mb-8 pb-8 border-b border-accent-primary/20">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Personalized Recommendations</p>
              {loading ? (
                <Skeleton count={5} baseColor="#E8EFF7" highlightColor="#D8E5D8" height={18} />
              ) : (
                <div className="bg-secondary-alt/30 rounded-lg p-4">
                  <p className="text-text-secondary leading-relaxed">{interpretation.text}</p>
                </div>
              )}
            </div>

            {interpretation.treatment_required === 'yes' && !loading && (
              <button
                className="btn w-full flex items-center justify-center gap-2 text-lg"
                onClick={handleVisitDoctor}
              >
                <Heart className="w-5 h-5" />
                Consult a Professional
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1 btn text-center text-lg">
            Return Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 btn-secondary text-lg"
          >
            Retake Assessment
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Important Notice:</strong> This assessment is for self-awareness and informational purposes only. 
        It is not a professional mental health diagnosis. If you're experiencing mental health concerns, 
        please reach out to a qualified mental health professional or call a helpline for support.
      </div>
    </div>
  );
};

function ResourceLink({ title, url, description }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg bg-secondary-alt/30 hover:bg-secondary-alt/50 transition-all border border-accent-secondary/20 hover:border-accent-secondary/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-text-primary group-hover:text-accent-secondary transition-colors">{title}</p>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}

export default Results;
