/*
  # Create exercises module tables

  1. New Tables
    - `exercise_categories`
      - `id` (uuid, primary key)
      - `name` (text) - beginner, intermediate, hard
      - `description` (text)
      - `created_at` (timestamptz)
    
    - `exercises`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to exercise_categories)
      - `title` (text)
      - `description` (text)
      - `duration_minutes` (integer)
      - `instructions` (text array)
      - `benefits` (text array)
      - `equipment_needed` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access (exercises are informational content)
    - Restrict write access to authenticated users only

  3. Initial Data
    - Seed exercise categories (beginner, intermediate, hard)
    - Add sample exercises for each difficulty level
*/

-- Create exercise_categories table
CREATE TABLE IF NOT EXISTS exercise_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES exercise_categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes integer DEFAULT 0,
  instructions text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Policies for exercise_categories
CREATE POLICY "Anyone can view exercise categories"
  ON exercise_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert categories"
  ON exercise_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update categories"
  ON exercise_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete categories"
  ON exercise_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for exercises
CREATE POLICY "Anyone can view exercises"
  ON exercises
  FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert exercises"
  ON exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update exercises"
  ON exercises
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete exercises"
  ON exercises
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert exercise categories
INSERT INTO exercise_categories (name, description) VALUES
  ('beginner', 'Perfect for those just starting their fitness journey. Low-impact exercises focusing on form and building foundational strength.'),
  ('intermediate', 'For those with some fitness experience. Moderate intensity exercises that challenge your body and improve overall fitness.'),
  ('hard', 'Advanced exercises for experienced fitness enthusiasts. High-intensity workouts that push your limits and maximize results.')
ON CONFLICT (name) DO NOTHING;

-- Insert sample exercises for BEGINNER
INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Walking Meditation',
  'A gentle practice combining mindful walking with breathing exercises to promote relaxation and body awareness.',
  15,
  ARRAY['Find a quiet space to walk', 'Focus on your breath with each step', 'Notice the sensation of your feet touching the ground', 'Walk slowly and deliberately for 15 minutes', 'End with 2 minutes of standing meditation'],
  ARRAY['Reduces stress and anxiety', 'Improves mindfulness', 'Gentle cardiovascular exercise', 'Enhances body awareness'],
  ARRAY['Comfortable walking shoes', 'Quiet space']
FROM exercise_categories WHERE name = 'beginner'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Chair Yoga',
  'Accessible yoga poses performed while seated, perfect for beginners or those with mobility concerns.',
  20,
  ARRAY['Sit comfortably in a sturdy chair', 'Perform gentle neck rolls and shoulder stretches', 'Practice seated twists and forward bends', 'Focus on deep breathing throughout', 'End with a seated meditation'],
  ARRAY['Increases flexibility', 'Reduces muscle tension', 'Improves posture', 'Accessible for all fitness levels'],
  ARRAY['Sturdy chair', 'Comfortable clothing']
FROM exercise_categories WHERE name = 'beginner'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Basic Stretching Routine',
  'A full-body stretching sequence to improve flexibility and reduce muscle tension.',
  10,
  ARRAY['Warm up with light movement for 2 minutes', 'Stretch neck, shoulders, and arms', 'Perform gentle back and hip stretches', 'Stretch legs including hamstrings and calves', 'Hold each stretch for 20-30 seconds', 'Never bounce or force a stretch'],
  ARRAY['Improves flexibility', 'Reduces muscle soreness', 'Prevents injury', 'Promotes relaxation'],
  ARRAY['Yoga mat or comfortable surface']
FROM exercise_categories WHERE name = 'beginner'
ON CONFLICT DO NOTHING;

-- Insert sample exercises for INTERMEDIATE
INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Bodyweight Circuit',
  'A challenging circuit combining multiple bodyweight exercises to build strength and endurance.',
  30,
  ARRAY['Warm up with 5 minutes of light cardio', 'Perform 3 rounds of: 15 push-ups, 20 squats, 15 lunges per leg, 30-second plank', 'Rest 60 seconds between rounds', 'Cool down with stretching for 5 minutes'],
  ARRAY['Builds full-body strength', 'Improves cardiovascular fitness', 'Burns calories', 'No equipment needed'],
  ARRAY['Exercise mat', 'Water bottle']
FROM exercise_categories WHERE name = 'intermediate'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Vinyasa Flow Yoga',
  'A dynamic yoga practice linking breath with movement through flowing sequences.',
  45,
  ARRAY['Begin with centering and breath work', 'Warm up with sun salutations', 'Flow through standing poses and balance work', 'Include core strengthening sequences', 'Cool down with seated poses', 'End with 5-minute savasana'],
  ARRAY['Increases strength and flexibility', 'Improves balance', 'Reduces stress', 'Enhances mind-body connection'],
  ARRAY['Yoga mat', 'Yoga blocks (optional)', 'Comfortable clothing']
FROM exercise_categories WHERE name = 'intermediate'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'HIIT Cardio Blast',
  'High-intensity interval training combining cardio bursts with active recovery periods.',
  25,
  ARRAY['Warm up for 5 minutes with dynamic stretches', 'Alternate 40 seconds high-intensity (jumping jacks, burpees, high knees) with 20 seconds rest', 'Complete 12 rounds total', 'Cool down with walking and stretching for 5 minutes'],
  ARRAY['Burns maximum calories', 'Boosts metabolism', 'Improves cardiovascular fitness', 'Time-efficient workout'],
  ARRAY['Timer', 'Water bottle', 'Exercise mat']
FROM exercise_categories WHERE name = 'intermediate'
ON CONFLICT DO NOTHING;

-- Insert sample exercises for HARD
INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Advanced HIIT Challenge',
  'Extreme high-intensity training pushing your limits with explosive movements and minimal rest.',
  40,
  ARRAY['Dynamic warm-up for 5 minutes', 'Round 1: 45 sec burpees, 15 sec rest, 45 sec mountain climbers, 15 sec rest (repeat 3x)', 'Round 2: 45 sec jump squats, 15 sec rest, 45 sec push-up to T, 15 sec rest (repeat 3x)', 'Round 3: 45 sec star jumps, 15 sec rest, 45 sec plank jacks, 15 sec rest (repeat 3x)', 'Cool down with 5 minutes stretching'],
  ARRAY['Maximum calorie burn', 'Explosive power development', 'Advanced cardiovascular conditioning', 'Full-body strength'],
  ARRAY['Timer', 'Water bottle', 'Exercise mat', 'Towel']
FROM exercise_categories WHERE name = 'hard'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Power Yoga Flow',
  'An intense, physically demanding yoga practice building serious strength and stamina.',
  60,
  ARRAY['Begin with pranayama breathing', 'Perform 10 rounds of surya namaskar A and B', 'Hold challenging standing sequences (warrior 3, half moon, crow)', 'Advanced arm balances and inversions', 'Core-intensive sequences', 'Deep stretching cooldown', 'Final savasana'],
  ARRAY['Builds exceptional strength', 'Advanced flexibility', 'Mental focus and discipline', 'Full-body transformation'],
  ARRAY['Yoga mat', 'Yoga blocks', 'Water bottle', 'Towel']
FROM exercise_categories WHERE name = 'hard'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (category_id, title, description, duration_minutes, instructions, benefits, equipment_needed)
SELECT 
  id,
  'Endurance Challenge',
  'A grueling endurance workout combining running, strength, and core work.',
  50,
  ARRAY['Run 1 mile at moderate pace', 'Immediately perform 50 push-ups, 50 squats, 50 sit-ups', 'Run another mile', 'Perform 40 push-ups, 40 squats, 40 sit-ups', 'Run final mile', 'Finish with 30 push-ups, 30 squats, 30 sit-ups', 'Cool down with walking and stretching'],
  ARRAY['Extreme endurance building', 'Mental toughness', 'Full-body conditioning', 'Competition preparation'],
  ARRAY['Running shoes', 'Exercise mat', 'Water bottle', 'Timer']
FROM exercise_categories WHERE name = 'hard'
ON CONFLICT DO NOTHING;