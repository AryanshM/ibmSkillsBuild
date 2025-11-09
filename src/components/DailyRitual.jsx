import React, { useState, useEffect } from 'react';
import { Leaf, Droplets, Wind } from 'lucide-react';

const dailyRituals = [
  {
    id: 1,
    type: 'quote',
    title: 'Daily Affirmation',
    content: 'You are capable of achieving great things. Take one step at a time.',
    icon: Leaf,
  },
  {
    id: 2,
    type: 'breathing',
    title: 'Breathing Exercise',
    content: 'Take 5 deep breaths: Inhale for 4 counts, hold for 4, exhale for 4.',
    duration: '2 min',
    icon: Wind,
  },
  {
    id: 3,
    type: 'hydration',
    title: 'Hydration Reminder',
    content: 'Drink a glass of water to start your day fresh and energized.',
    icon: Droplets,
  },
  {
    id: 4,
    type: 'quote',
    title: 'Mindfulness Moment',
    content: 'Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
    icon: Leaf,
  },
  {
    id: 5,
    type: 'breathing',
    title: 'Evening Ritual',
    content: 'Practice gratitude: Name 3 things you\'re grateful for today.',
    icon: Wind,
  },
];

function DailyRitual() {
  const [currentRitual, setCurrentRitual] = useState(null);
  const [breatingActive, setBreathingActive] = useState(false);
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    const randomRitual = dailyRituals[Math.floor(Math.random() * dailyRituals.length)];
    setCurrentRitual(randomRitual);
  }, []);

  const handleBreathingExercise = () => {
    setBreathingActive(!breatingActive);
    if (!breatingActive) {
      setBreathCount(0);
    }
  };

  useEffect(() => {
    if (!breatingActive) return;

    const interval = setInterval(() => {
      setBreathCount((prev) => (prev + 1) % 12);
    }, 1000);

    return () => clearInterval(interval);
  }, [breatingActive]);

  if (!currentRitual) return null;

  const Icon = currentRitual.icon;

  return (
    <div className="bg-gradient-soft rounded-2xl shadow-card p-8 border border-accent-primary/10">
      <div className="flex items-start gap-4 mb-4">
        <Icon className="wellness-icon mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-accent-primary mb-2">{currentRitual.title}</h3>
          <p className="text-text-secondary text-sm">{currentRitual.duration && `${currentRitual.duration}`}</p>
        </div>
      </div>

      {currentRitual.type === 'breathing' && breatingActive ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className={`w-24 h-24 rounded-full border-4 border-accent-secondary flex items-center justify-center transition-all duration-1000 ${
            breathCount % 3 === 0 ? 'animate-breathe' : ''
          }`} style={{
            backgroundColor: breathCount % 3 === 0 ? 'rgba(107, 156, 176, 0.1)' : 'rgba(139, 158, 143, 0.1)',
          }}>
            <span className="text-2xl font-bold text-accent-secondary">
              {breathCount % 3 === 0 ? 'In' : breathCount % 3 === 1 ? 'Hold' : 'Out'}
            </span>
          </div>
          <p className="mt-4 text-text-secondary">{Math.ceil((12 - breathCount) / 3)} cycles remaining</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-6">{currentRitual.content}</p>
          {currentRitual.type === 'breathing' && (
            <button
              onClick={handleBreathingExercise}
              className="btn-secondary w-full text-center"
            >
              Start Breathing Exercise
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default DailyRitual;
