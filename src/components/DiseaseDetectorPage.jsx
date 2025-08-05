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
    <div className="disease-detector-page">
      <h1 className="disease-detector-heading">What are your symptoms?</h1>
      <div className="symptom-input-section">
        <input
          type="text"
          className="symptom-input-box"
          placeholder="Enter Symptom 1"
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddSymptom();
            }
          }}
        />
        <button className="add-symptom-button" onClick={handleAddSymptom}>
          Add Symptom
        </button>
      </div>

      <div className="symptoms-display-area">
        {symptoms.map((symptom, index) => (
          <div key={index} className="symptom-box">
            {symptom}
            <button className="remove-symptom-button" onClick={() => handleRemoveSymptom(index)}>
              &times;
            </button>
          </div>
        ))}
      </div>
        <br />
        <br />

      <button className="detect-disease-button" onClick={handleDetectDisease}>
        Detect Disease
      </button>
    </div>
  );
}

export default DiseaseDetectorPage;
