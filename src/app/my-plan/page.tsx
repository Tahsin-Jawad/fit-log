'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Workout } from '@/types';

export default function MyPlan() {
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadLocalStorageData = () => {
      const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
      const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
      setPlanWorkouts(plan);
      setSavedWorkouts(saved);
    };

    loadLocalStorageData();
    window.addEventListener('storage', loadLocalStorageData);
    
    const handleCustomStorage = () => loadLocalStorageData();
    window.addEventListener('fitlog_storage_updated', handleCustomStorage as EventListener);

    return () => {
      window.removeEventListener('storage', loadLocalStorageData);
      window.removeEventListener('fitlog_storage_updated', handleCustomStorage as EventListener);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeFromPlan = (id: string) => {
    const updated = planWorkouts.filter((item) => item.id !== id);
    setPlanWorkouts(updated);
    localStorage.setItem('fitlog_plan', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('fitlog_storage_updated'));
    showToast('Removed from today\'s plan');
  };

  const removeFromSaved = (id: string) => {
    const updated = savedWorkouts.filter((item) => item.id !== id);
    setSavedWorkouts(updated);
    localStorage.setItem('fitlog_saved', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('fitlog_storage_updated'));
    showToast('Removed from saved');
  };

  const moveToPlan = (workout: Workout) => {
    if (planWorkouts.length >= 5) {
      showToast('Cap of five lifts reached for today!');
      return;
    }
    if (!planWorkouts.some((item) => item.id === workout.id)) {
      const updatedPlan = [...planWorkouts, workout];
      setPlanWorkouts(updatedPlan);
      localStorage.setItem('fitlog_plan', JSON.stringify(updatedPlan));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('fitlog_storage_updated'));
      showToast('Moved to today\'s plan');
    } else {
      showToast('Already in today\'s plan');
    }
  };

  // Robust calculation handling all variations of calories/duration property names
  const totalCalories = planWorkouts.reduce((acc, curr: any) => {
    const calValue = curr.calories || curr.calorie || curr.kcal || 0;
    const parsed = parseInt(String(calValue).replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  const totalDuration = planWorkouts.reduce((acc, curr: any) => {
    const durValue = curr.duration || curr.time || 0;
    const parsed = parseInt(String(durValue).replace(/[^0-9]/g, ''), 10);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#ccff00] text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50 text-sm transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
              My Workout Hub
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your daily training schedule and saved routines.
            </p>
          </div>

          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'plan'
                  ? 'bg-[#ccff00] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Today's Plan ({planWorkouts.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'saved'
                  ? 'bg-[#ccff00] text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Saved For Later ({savedWorkouts.length})
            </button>
          </div>
        </div>

        {activeTab === 'plan' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <span className="text-xs text-zinc-400 font-semibold uppercase">Total Estimated Calories</span>
                <div className="text-3xl font-extrabold text-white mt-2">{totalCalories} kcal</div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <span className="text-xs text-zinc-400 font-semibold uppercase">Total Estimated Duration</span>
                <div className="text-3xl font-extrabold text-white mt-2">{totalDuration} min</div>
              </div>
            </div>

            {planWorkouts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-4">No workouts added to today's plan yet.</p>
                <Link
                  href="/"
                  className="inline-block bg-[#ccff00] text-black font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#b3e600] transition-colors"
                >
                  Browse Workouts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {planWorkouts.map((workout: any) => (
                  <div
                    key={workout.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        <img
                          src={workout.image}
                          alt={workout.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold uppercase">{workout.title}</h3>
                        <p className="text-zinc-400 text-xs mt-0.5">
                          {workout.sets} Sets • {workout.reps} Reps • {workout.duration} min • {workout.calories || workout.calorie || 0} kcal
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <Link
                        href={`/workouts/${workout.id}`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeFromPlan(workout.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg text-xs transition-colors border border-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedWorkouts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <p className="text-zinc-400 text-sm mb-4">No saved workouts found.</p>
                <Link
                  href="/"
                  className="inline-block bg-[#ccff00] text-black font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#b3e600] transition-colors"
                >
                  Browse Workouts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedWorkouts.map((workout: any) => (
                  <div
                    key={workout.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        <img
                          src={workout.image}
                          alt={workout.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold uppercase">{workout.title}</h3>
                        <p className="text-zinc-400 text-xs mt-0.5">
                          {workout.equipment} • {workout.difficulty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={() => moveToPlan(workout)}
                        className="px-4 py-2 bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold rounded-lg text-xs transition-colors"
                      >
                        Add to Plan
                      </button>
                      <Link
                        href={`/workouts/${workout.id}`}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg text-xs transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => removeFromSaved(workout.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-lg text-xs transition-colors border border-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}