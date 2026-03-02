-- Run this in your Supabase SQL editor

CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  unit TEXT,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER,
  calories INTEGER,
  notes TEXT,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (add auth later)
CREATE POLICY "Allow all on goals" ON goals FOR ALL USING (true);
CREATE POLICY "Allow all on workouts" ON workouts FOR ALL USING (true);
