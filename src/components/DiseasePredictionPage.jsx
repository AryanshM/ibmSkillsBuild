import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, AlertCircle, Home } from "lucide-react";

function DiseasePredictionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnosis, symptoms, answers } = location.state || { diagnosis: null, symptoms: [], answers: [] };

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card-lg text-center border-2 border-danger/30 bg-danger/5">
              <AlertCircle className="w-16 h-16 text-danger mx-auto mb-6" />
              <h1 className="text-4xl font-accent font-bold text-text-primary mb-4">
                Unable to Load Results
              </h1>
              <p className="text-lg text-text-secondary mb-8">
                We couldn't retrieve your health assessment. Please try again from the beginning.
              </p>
              <button
                className="btn"
                onClick={() => navigate("/disease-detector")}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Your Health Assessment Results
          </h1>
          <p className="text-xl text-text-secondary">
            Based on your symptoms and responses
          </p>
        </div>

        {/* Results Card */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="card-lg border-2 border-accent-tertiary/20 animate-slide-in">
            <div className="mb-8 pb-8 border-b border-accent-primary/20">
              <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Possible Condition</p>
              <h2 className="text-4xl font-accent font-bold text-accent-tertiary mb-4">
                {diagnosis.diagnosis}
              </h2>
              <div className="bg-accent-tertiary/10 rounded-xl p-6">
                <p className="text-lg text-text-secondary leading-relaxed">
                  {diagnosis.explanation}
                </p>
              </div>
            </div>

            {/* Symptoms Summary */}
            {symptoms.length > 0 && (
              <div className="mb-8 pb-8 border-b border-accent-primary/20">
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">Your Reported Symptoms</p>
                <div className="flex flex-wrap gap-3">
                  {symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-secondary-alt/50 text-text-primary px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-text-primary mb-2">Important Disclaimer</h3>
                  <p className="text-text-secondary text-sm">
                    This assessment is for informational purposes only and is not a medical diagnosis. 
                    Please consult a qualified healthcare professional for accurate diagnosis and treatment. 
                    If experiencing severe symptoms, seek immediate medical attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card border-l-4 border-accent-primary">
            <h3 className="text-xl font-bold text-accent-primary mb-4">Next Steps</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary">•</span>
                <span>Document your symptoms and when they started</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary">•</span>
                <span>Schedule an appointment with a healthcare provider</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary">•</span>
                <span>Bring this assessment to your doctor</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-primary">•</span>
                <span>Get professional medical evaluation</span>
              </li>
            </ul>
          </div>

          <div className="card border-l-4 border-accent-secondary">
            <h3 className="text-xl font-bold text-accent-secondary mb-4">Self-Care Tips</h3>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">•</span>
                <span>Get adequate rest and hydration</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">•</span>
                <span>Practice stress management techniques</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">•</span>
                <span>Monitor your symptoms daily</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-accent-secondary">•</span>
                <span>Maintain a balanced, nutritious diet</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 btn flex items-center justify-center gap-2 text-lg"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            className="flex-1 btn-secondary flex items-center justify-center gap-2 text-lg"
            onClick={() => navigate("/disease-detector")}
          >
            New Assessment
          </button>
        </div>
      </div>

      {/* Disclaimer Footer */}
      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Medical Disclaimer:</strong> This health assessment tool is for informational purposes only. 
        It is not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified healthcare 
        professional before making any medical decisions. If you believe you have a serious medical condition, 
        please seek immediate professional medical attention.
      </div>
    </div>
  );
}

export default DiseasePredictionPage;
