import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, Utensils, Home, Loader2, AlertCircle } from 'lucide-react';
import { analyzeFoodItem } from '../llm/food'; // ✅ import correct function

function KnowYourFoodPage() {
  const [food, setFood] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ renamed this to avoid recursion
  const handleAnalyzeFood = async () => {
    if (!food.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ✅ call Gemini-based analyzer function
      const data = await analyzeFoodItem(food);

      if (data.error) setError(data.message);
      else setResult(data);
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while analyzing the food.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-accent-primary/20 rounded-full p-4">
              <Apple className="w-12 h-12 text-accent-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Know Your Food
          </h1>
          <p className="text-xl text-text-secondary">
            Type any food and let AI analyze its nutrition & health impact 🍽️
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <input
            type="text"
            placeholder="Enter a food item (e.g., Avocado, Pizza, Banana)..."
            className="input w-full mb-4 p-3 rounded-xl text-lg border-2 border-accent-primary/30 focus:border-accent-primary outline-none bg-secondary text-text-primary"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
          <button
            onClick={handleAnalyzeFood} // ✅ fixed
            disabled={loading}
            className="btn w-full text-lg flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Utensils className="w-5 h-5" /> Analyze Food
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="card-lg border-2 border-danger/40 bg-danger/10 text-center p-6">
              <AlertCircle className="w-8 h-8 text-danger mx-auto mb-2" />
              <p className="text-danger font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="card-lg border-2 border-accent-primary/20 bg-secondary/40 p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-4 text-accent-primary text-center">
                🍽️ {result.food_name}
              </h2>

              <p className="text-lg text-text-secondary text-center mb-6">
                {result.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="border border-accent-primary/10 rounded-xl p-4">
                  <h3 className="font-bold text-accent-primary mb-2">
                    Nutrition Breakdown
                  </h3>
                  <ul className="space-y-1">
                    {Object.entries(result.nutrition || {}).map(([key, val]) => (
                      <li key={key} className="flex justify-between">
                        <span className="capitalize">{key}</span>
                        <span>{val}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-accent-secondary/10 rounded-xl p-4">
                  <h3 className="font-bold text-accent-secondary mb-2">
                    AI Recommendation
                  </h3>
                  <p className="text-text-secondary">{result.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="btn flex items-center justify-center gap-2 text-lg inline-flex"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="disclaimer mx-4 mt-16 mb-8 text-sm text-text-secondary text-center">
        <strong>Note:</strong> This is an AI-generated nutritional analysis and not a substitute
        for professional dietary advice.
      </div>
    </div>
  );
}

export default KnowYourFoodPage;
