import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Flame, Home } from 'lucide-react';

function ExercisesPage() {
  const difficultyLevels = [
    {
      id: 'beginner',
      name: 'Beginner',
      description: 'Perfect for those just starting their fitness journey. Low-impact exercises focusing on form and building foundational strength.',
      icon: Dumbbell,
      color: 'bg-accent-primary',
      borderColor: 'border-accent-primary/20',
      hoverBorder: 'hover:border-accent-primary',
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'For those with some fitness experience. Moderate intensity exercises that challenge your body and improve overall fitness.',
      icon: TrendingUp,
      color: 'bg-accent-secondary',
      borderColor: 'border-accent-secondary/20',
      hoverBorder: 'hover:border-accent-secondary',
    },
    {
      id: 'hard',
      name: 'Advanced',
      description: 'Advanced exercises for experienced fitness enthusiasts. High-intensity workouts that push your limits and maximize results.',
      icon: Flame,
      color: 'bg-accent-tertiary',
      borderColor: 'border-accent-tertiary/20',
      hoverBorder: 'hover:border-accent-tertiary',
    },
  ];

  return (
    <div className="min-h-screen bg-primary text-text-primary font-sans py-16">
      <div className="container mx-auto px-4">
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

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {difficultyLevels.map((level) => {
            const Icon = level.icon;
            return (
              <Link
                key={level.id}
                to={`/exercises/${level.id}`}
                className={`card-lg border-2 ${level.borderColor} ${level.hoverBorder} hover:-translate-y-2 transition-all duration-300 animate-fade-in`}
              >
                <div className={`${level.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 mx-auto`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-accent font-bold text-text-primary mb-4 text-center">
                  {level.name}
                </h2>
                <p className="text-text-secondary text-center mb-6">
                  {level.description}
                </p>
                <div className="text-center">
                  <span className="inline-block btn-outline text-sm">
                    View Exercises
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

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
                    <span>Consult with a healthcare provider if you have any medical conditions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Always warm up before exercising</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Stay hydrated throughout your workout</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-primary">•</span>
                    <span>Listen to your body and stop if you feel pain</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-accent-secondary mb-3">Best Practices</h4>
                <ul className="space-y-2 text-text-secondary text-sm">
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Focus on proper form over speed or intensity</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Allow adequate rest between workout sessions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Gradually increase intensity as you progress</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-secondary">•</span>
                    <span>Cool down and stretch after each session</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="btn flex items-center justify-center gap-2 text-lg inline-flex">
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Fitness Disclaimer:</strong> These exercises are for informational purposes only.
        Always consult with a qualified healthcare provider or fitness professional before starting any new exercise program.
        If you experience pain, dizziness, or discomfort, stop immediately and seek medical advice.
      </div>
    </div>
  );
}

export default ExercisesPage;
