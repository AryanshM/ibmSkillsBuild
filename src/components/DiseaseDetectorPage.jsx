import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Plus } from 'lucide-react';

function DiseaseDetectorPage() {
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();

  const handleAddSymptom = () => {
    if (symptomInput.trim() !== '') {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleDetectDisease = () => {
    if (symptoms.length > 0) {
      navigate('/follow-up-questions', { state: { symptoms } });
    } else {
      alert('Please add at least one symptom to continue.');
    }
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-accent-tertiary/20 rounded-full p-4">
              <Heart className="w-12 h-12 text-accent-tertiary" />
            </div>
          </div>
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Health Assessment
          </h1>
          <p className="text-xl text-text-secondary">
            Share your symptoms and let our AI provide personalized health insights. This assessment is for informational purposes only and not a substitute for professional medical advice.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Input Section */}
          <div className="card-lg border-2 border-accent-secondary/20 mb-12 animate-slide-in">
            <h2 className="text-2xl font-bold text-text-primary mb-6">What symptoms are you experiencing?</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-grow bg-secondary text-text-primary placeholder-text-secondary px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-secondary transition-all"
                  placeholder="e.g., fever, headache, cough..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                />
                <button 
                  className="btn flex items-center gap-2 px-6"
                  onClick={handleAddSymptom}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              <p className="text-sm text-text-secondary">Press Enter or click Add to include a symptom</p>
            </div>

            {/* Symptoms Display */}
            {symptoms.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-text-secondary mb-4">Your symptoms ({symptoms.length}):</p>
                <div className="flex flex-wrap gap-3">
                  {symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="bg-gradient-sage text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all animate-fade-in"
                    >
                      <span className="font-semibold">{symptom}</span>
                      <button
                        className="text-white/70 hover:text-white transition-colors ml-1"
                        onClick={() => handleRemoveSymptom(index)}
                        aria-label={`Remove ${symptom}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className={`flex-1 btn text-lg font-semibold ${symptoms.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleDetectDisease}
                disabled={symptoms.length === 0}
              >
                Continue Assessment
              </button>
              <button
                className="flex-1 btn-outline text-lg font-semibold"
                onClick={() => navigate("/")}
              >
                Back Home
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="card border-l-4 border-accent-secondary">
            <h3 className="font-bold text-accent-secondary mb-3">How This Works</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">1.</span>
                <span>List all symptoms you're experiencing</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">2.</span>
                <span>Answer follow-up questions for better accuracy</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">3.</span>
                <span>Receive AI-powered health insights</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">4.</span>
                <span>Consult a healthcare professional if needed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetectorPage;
