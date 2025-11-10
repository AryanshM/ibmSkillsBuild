import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Flame, Home, AlertCircle } from 'lucide-react';

function ExercisesPage() {
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map icons + color schemes dynamically
  const levelStyles = {
    beginner: {
      icon: Dumbbell,
      color: 'bg-accent-primary',
      borderColor: 'border-accent-primary/20',
      hoverBorder: 'hover:border-accent-primary',
      textColor: 'text-accent-primary'
    },
    intermediate: {
      icon: TrendingUp,
      color: 'bg-accent-secondary',
      borderColor: 'border-accent-secondary/20',
      hoverBorder: 'hover:border-accent-secondary',
      textColor: 'text-accent-secondary'
    },
    hard: {
      icon: Flame,
      color: 'bg-accent-tertiary',
      borderColor: 'border-accent-tertiary/20',
      hoverBorder: 'hover:border-accent-tertiary',
      textColor: 'text-accent-tertiary'
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/data/exercises.json');
      if (!res.ok) throw new Error('Failed to load categories');
      const json = await res.json();

      const categories = json.categories.map((c) => ({
        ...c,
        ...levelStyles[c.name] // attach icon/color
      }));

      setDifficultyLevels(categories);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch exercise categories.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Dumbbell className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Loading Exercise Library
          </h1>
          <p className="text-text-secondary">Fetching your fitness categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="card-lg border-2 border-danger/30 bg-danger/5 p-8">
            <AlertCircle className="w-16 h-16 text-danger mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Unable to Load Exercises
            </h1>
            <p className="text-lg text-text-secondary mb-8">{error}</p>
            <Link to="/" className="btn text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-accent-primary/20 rounded-full p-4">
              <Dumbbell className="w-12 h-12 text-accent-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-accent font-bold text-accent-primary mb-4">
            Exercise Library
          </h1>
          <p className="text-xl text-text-secondary">
            Choose your difficulty level and discover exercises tailored to your fitness journey
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {difficultyLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Link
                key={level.id}
                to={`/exercises/${level.name}`}
                className={`card-lg border-2 ${level.borderColor} ${level.hoverBorder} hover:-translate-y-2 transition-all duration-300 animate-fade-in`}
              >
                <div
                  className={`${level.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-accent font-bold text-text-primary mb-4 text-center">
                  {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                </h2>
                <p className="text-text-secondary text-center mb-6">{level.description}</p>
                <div className="text-center">
                  <span className="inline-block btn-outline text-sm">View Exercises</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Exercise Guidelines */}
        <div className="max-w-4xl mx-auto">
          <div className="card-lg border-2 border-accent-primary/20 mb-12">
            <h3 className="text-2xl font-accent font-bold text-text-primary mb-6">
              Exercise Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-accent-primary mb-3">Before You Start</h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Consult a healthcare provider if you have medical conditions.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Always warm up before exercising.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Stay hydrated throughout your workout.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Stop if you experience pain or dizziness.</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-accent-secondary mb-3">Best Practices</h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Focus on form over speed or intensity.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Allow proper rest between workouts.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Gradually increase intensity as you progress.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Cool down and stretch after each session.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Home Button */}
          <div className="text-center">
            <Link to="/" className="btn flex items-center justify-center gap-2 text-lg inline-flex">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="disclaimer mx-4 mt-16 mb-8 text-sm text-text-secondary text-center">
        <strong>Fitness Disclaimer:</strong> These exercises are for informational purposes only.
        Always consult a qualified healthcare provider before starting any new exercise program.
      </div>
    </div>
  );
}

export default ExercisesPage;
