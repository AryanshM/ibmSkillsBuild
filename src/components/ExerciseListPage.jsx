import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dumbbell, Clock, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function ExerciseListPage() {
  const { difficulty } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, [difficulty]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: category, error: categoryError } = await supabase
        .from('exercise_categories')
        .select('id, name, description')
        .eq('name', difficulty)
        .maybeSingle();

      if (categoryError) throw categoryError;

      if (!category) {
        setError('Category not found');
        setLoading(false);
        return;
      }

      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: true });

      if (exercisesError) throw exercisesError;

      setExercises(exercisesData || []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyInfo = () => {
    const info = {
      beginner: {
        title: 'Beginner Exercises',
        color: 'text-accent-primary',
        bgColor: 'bg-accent-primary',
        borderColor: 'border-accent-primary/20',
      },
      intermediate: {
        title: 'Intermediate Exercises',
        color: 'text-accent-secondary',
        bgColor: 'bg-accent-secondary',
        borderColor: 'border-accent-secondary/20',
      },
      hard: {
        title: 'Advanced Exercises',
        color: 'text-accent-tertiary',
        bgColor: 'bg-accent-tertiary',
        borderColor: 'border-accent-tertiary/20',
      },
    };
    return info[difficulty] || info.beginner;
  };

  const diffInfo = getDifficultyInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center animate-pulse">
          <Dumbbell className="w-16 h-16 text-accent-primary mx-auto mb-4" />
          <h1 className="text-4xl font-accent font-bold text-text-primary mb-2">
            Loading Exercises
          </h1>
          <p className="text-text-secondary">Preparing your workout library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="card-lg text-center border-2 border-danger/30 bg-danger/5">
              <AlertCircle className="w-16 h-16 text-danger mx-auto mb-6" />
              <h1 className="text-4xl font-accent font-bold text-text-primary mb-4">
                Unable to Load Exercises
              </h1>
              <p className="text-lg text-text-secondary mb-8">{error}</p>
              <button className="btn" onClick={() => navigate('/exercises')}>
                Back to Exercises
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
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/exercises')}
            className="btn-outline mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Levels
          </button>

          <div className="text-center mb-16 animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className={`${diffInfo.bgColor}/20 rounded-full p-4`}>
                <Dumbbell className={`w-12 h-12 ${diffInfo.color}`} />
              </div>
            </div>
            <h1 className={`text-5xl font-accent font-bold ${diffInfo.color} mb-4`}>
              {diffInfo.title}
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              {exercises.length} exercises designed for your fitness level
            </p>
          </div>

          {exercises.length === 0 ? (
            <div className="card-lg text-center border-2 border-accent-primary/20">
              <p className="text-lg text-text-secondary">
                No exercises available yet for this difficulty level.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`card border-2 ${diffInfo.borderColor} hover:shadow-card-hover transition-all duration-300 cursor-pointer`}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-primary flex-1">
                      {exercise.title}
                    </h3>
                    <div className={`${diffInfo.bgColor}/20 rounded-lg p-2`}>
                      <Dumbbell className={`w-5 h-5 ${diffInfo.color}`} />
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm mb-4">
                    {exercise.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent-primary" />
                      <span className="text-text-secondary">
                        {exercise.duration_minutes} min
                      </span>
                    </div>
                    {exercise.benefits && exercise.benefits.length > 0 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-text-secondary">
                          {exercise.benefits.length} benefits
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-accent-primary/10">
                    <span className="text-xs text-accent-primary font-semibold uppercase tracking-wide">
                      Click to view details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedExercise && (
        <div
          className="modal-overlay flex items-center justify-center z-50 animate-fade-in p-4"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="modal-content w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-6 right-6 text-text-secondary hover:text-text-primary text-2xl font-bold transition"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className={`${diffInfo.bgColor} rounded-xl p-3 text-white`}>
                  <Dumbbell className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-4xl font-accent font-bold text-text-primary">
                    {selectedExercise.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-accent-primary" />
                    <span className="text-text-secondary">
                      {selectedExercise.duration_minutes} minutes
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-text-secondary mb-6">
                {selectedExercise.description}
              </p>
            </div>

            <div className="space-y-8">
              {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-accent-primary mb-4">
                    Instructions
                  </h3>
                  <div className="space-y-3">
                    {selectedExercise.instructions.map((instruction, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-accent-primary font-bold text-sm">
                            {idx + 1}
                          </span>
                        </div>
                        <p className="text-text-secondary pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-success mb-4">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedExercise.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="bg-success/10 rounded-lg p-4 flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-text-secondary text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedExercise.equipment_needed && selectedExercise.equipment_needed.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-accent-secondary mb-4">
                    Equipment Needed
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedExercise.equipment_needed.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary-alt/50 text-text-primary px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-accent-primary/20">
              <button
                onClick={() => setSelectedExercise(null)}
                className="btn w-full text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer mx-4 mt-16 mb-8">
        <strong>Safety First:</strong> These exercises are for informational purposes only.
        Always consult with a qualified healthcare provider or fitness professional before starting any new exercise program.
        If you experience pain, dizziness, or discomfort, stop immediately and seek medical advice.
      </div>
    </div>
  );
}

export default ExerciseListPage;
