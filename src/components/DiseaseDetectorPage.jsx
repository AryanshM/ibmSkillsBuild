import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      alert('Please add at least one symptom to detect disease.');
    }
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-accent mb-12">What are your symptoms?</h1>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              className="flex-grow bg-secondary text-text-primary placeholder-text-secondary px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter a symptom"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
            />
            <button className="btn" onClick={handleAddSymptom}>
              Add
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {symptoms.map((symptom, index) => (
              <div key={index} className="bg-secondary text-text-primary px-5 py-3 rounded-full flex items-center gap-3 shadow-card">
                {symptom}
                <button
                  className="text-text-secondary hover:text-red-500 transition-colors duration-200"
                  onClick={() => handleRemoveSymptom(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button className="btn text-xl w-full" onClick={handleDetectDisease}>
            Detect Disease
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetectorPage;