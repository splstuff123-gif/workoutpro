'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
}

interface Workout {
  id: string;
  title: string;
  duration_minutes: number;
  calories: number;
  completed_at: string;
}

export default function Home() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newGoal, setNewGoal] = useState({ title: '', target_value: 0, unit: 'reps' });
  const [newWorkout, setNewWorkout] = useState({ title: '', duration_minutes: 0, calories: 0 });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: goalsData } = await supabase.from('goals').select('*').order('created_at', { ascending: false });
    const { data: workoutsData } = await supabase.from('workouts').select('*').order('completed_at', { ascending: false });
    
    if (goalsData) setGoals(goalsData);
    if (workoutsData) setWorkouts(workoutsData);
  }

  async function addGoal() {
    if (!newGoal.title) return;
    
    await supabase.from('goals').insert([{
      ...newGoal,
      current_value: 0
    }]);
    
    setNewGoal({ title: '', target_value: 0, unit: 'reps' });
    loadData();
  }

  async function addWorkout() {
    if (!newWorkout.title) return;
    
    await supabase.from('workouts').insert([newWorkout]);
    
    setNewWorkout({ title: '', duration_minutes: 0, calories: 0 });
    loadData();
  }

  async function updateGoalProgress(id: string, increment: number) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    await supabase.from('goals').update({
      current_value: goal.current_value + increment
    }).eq('id', id);
    
    loadData();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">WorkoutPro</h1>
          <p className="text-gray-600 mt-2">Track your workout progress and achieve your fitness goals</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Goals Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Fitness Goals</h2>
            
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Target"
                  value={newGoal.target_value || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  className="w-24 px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={addGoal}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Goal
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-gray-600">
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateGoalProgress(goal.id, 1)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, -1)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workouts Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Workout Log</h2>
            
            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Workout name"
                value={newWorkout.title}
                onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Duration (min)"
                  value={newWorkout.duration_minutes || ''}
                  onChange={(e) => setNewWorkout({ ...newWorkout, duration_minutes: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={newWorkout.calories || ''}
                  onChange={(e) => setNewWorkout({ ...newWorkout, calories: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={addWorkout}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Log Workout
              </button>
            </div>

            <div className="space-y-3">
              {workouts.slice(0, 10).map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{workout.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>⏱️ {workout.duration_minutes} min</span>
                    <span>🔥 {workout.calories} cal</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(workout.completed_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
