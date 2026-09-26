'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [todayPlan, setTodayPlan] = useState<any[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [doneWorkouts, setDoneWorkouts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading state as requested
    const timer = setTimeout(() => {
      loadLocalStorageData();
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const loadLocalStorageData = () => {
    try {
      const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
      const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
      const done = JSON.parse(localStorage.getItem('fitlog_done') || '[]');
      setTodayPlan(Array.isArray(plan) ? plan : []);
      setSavedWorkouts(Array.isArray(saved) ? saved : []);
      setDoneWorkouts(Array.isArray(done) ? done : []);
    } catch (e) {
      setTodayPlan([]);
      setSavedWorkouts([]);
      setDoneWorkouts([]);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRemoveFromPlan = (id: string, title: string) => {
    const updated = todayPlan.filter((item: any) => item.id !== id);
    setTodayPlan(updated);
    localStorage.setItem('fitlog_plan', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('fitlog_storage_updated'));
    showToast(`Removed "${title}" from today's plan`);
  };

  const handleMarkAsDone = (id: string, title: string) => {
    let updatedDone = [...doneWorkouts];
    if (!updatedDone.includes(id)) {
      updatedDone.push(id);
      setDoneWorkouts(updatedDone);
      localStorage.setItem('fitlog_done', JSON.stringify(updatedDone));
      showToast(`Completed "${title}"! Great job.`);
    } else {
      updatedDone = updatedDone.filter((item) => item !== id);
      setDoneWorkouts(updatedDone);
      localStorage.setItem('fitlog_done', JSON.stringify(updatedDone));
      showToast(`Marked "${title}" as incomplete.`);
    }
  };

  const handleRemoveSaved = (id: string, title: string) => {
    const updated = savedWorkouts.filter((item: any) => item.id !== id);
    setSavedWorkouts(updated);
    localStorage.setItem('fitlog_saved', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('fitlog_storage_updated'));
    showToast(`Removed "${title}" from saved`);
  };

  // Calculations for Today's Plan
  const totalExercises = todayPlan.length;

  const totalCalories = todayPlan.reduce((acc, curr) => {
    const cal = curr.caloriesBurned || curr.calories || curr.calorie || curr.kcal || (curr.duration ? curr.duration * 8 : 120);
    return acc + (typeof cal === 'number' ? cal : parseInt(String(cal).replace(/[^0-9]/g, ''), 10) || 120);
  }, 0);

  const totalDuration = todayPlan.reduce((acc, curr) => {
    const dur = curr.duration || curr.time || 15;
    return acc + (typeof dur === 'number' ? dur : parseInt(String(dur).replace(/[^0-9]/g, ''), 10) || 15);
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#ccff00] text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50 text-sm transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            MY PLAN
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'plan'
                ? 'bg-[#ccff00] text-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Today's Plan ({todayPlan.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'saved'
                ? 'bg-[#ccff00] text-black'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Saved ({savedWorkouts.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ccff00]"></div>
            <span className="ml-3 text-zinc-400 text-sm">Loading workouts…</span>
          </div>
        ) : activeTab === 'plan' ? (
          <div>
            {/* Metrics Summary Row (3 Stat Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Exercises
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                  {totalExercises}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Minutes
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                  {totalDuration}
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Calories
                </span>
                <div className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                  {totalCalories}
                </div>
              </div>
            </div>

            {/* Plan List / Empty State */}
            {todayPlan.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-white mb-2">NOTHING HERE YET</h3>
                <p className="text-zinc-400 text-sm mb-6">Browse the library and add a lift to get today moving.</p>
                <Link
                  href="/"
                  className="inline-block bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  Go to workouts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {todayPlan.map((workout: any) => {
                  const isDone = doneWorkouts.includes(String(workout.id));
                  const dur = workout.duration || 15;
                  const cal = workout.caloriesBurned || workout.calories || (dur * 8);
                  const rating = Number(workout.rating) || 4.5;
                  const title = workout.name || workout.title;
                  const equipment = workout.equipment || 'Standard Equipment';

                  return (
                    <div
                      key={workout.id}
                      className={`bg-zinc-900 border rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
                        isDone ? 'border-emerald-500/50 bg-zinc-900/80' : 'border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                          <img
                            src={workout.image}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className={`text-base font-bold uppercase tracking-wide ${isDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                            {title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">
                            {equipment}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                            <span className="flex items-center gap-1">⏱️ {dur} min</span>
                            <span className="flex items-center gap-1 text-zinc-300">🔥 {cal} kcal</span>
                            <span className="flex items-center gap-1 text-zinc-300">⭐ {rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                        <Link
                          href={`/workouts/${workout.id}`}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                        >
                          View Details
                        </Link>
                        
                        {/* Mark as Done Button */}
                        <button
                          onClick={() => handleMarkAsDone(String(workout.id), title)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                            isDone
                              ? 'bg-emerald-500 text-black'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          <span>✓</span>
                          <span>{isDone ? 'Completed' : 'Mark as Done'}</span>
                        </button>

                        {/* Remove (X) Button */}
                        <button
                          onClick={() => handleRemoveFromPlan(String(workout.id), title)}
                          className="bg-zinc-800 hover:bg-red-900/40 text-red-400 border border-red-500/20 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {savedWorkouts.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">
                <h3 className="text-xl font-extrabold uppercase tracking-wide text-white mb-2">NOTHING HERE YET</h3>
                <p className="text-zinc-400 text-sm mb-6">Browse the library and save a lift for later.</p>
                <Link
                  href="/"
                  className="inline-block bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
                >
                  Go to workouts
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedWorkouts.map((workout: any) => {
                  const dur = workout.duration || 15;
                  const cal = workout.caloriesBurned || workout.calories || (dur * 8);
                  const rating = Number(workout.rating) || 4.5;
                  const title = workout.name || workout.title;
                  const equipment = workout.equipment || 'Standard Equipment';

                  return (
                    <div
                      key={workout.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                          <img
                            src={workout.image}
                            alt={title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold uppercase text-white tracking-wide">
                            {title}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">
                            {equipment}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                            <span className="flex items-center gap-1">⏱️ {dur} min</span>
                            <span className="flex items-center gap-1 text-zinc-300">🔥 {cal} kcal</span>
                            <span className="flex items-center gap-1 text-zinc-300">⭐ {rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                        <Link
                          href={`/workouts/${workout.id}`}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleRemoveSaved(String(workout.id), title)}
                          className="bg-zinc-800 hover:bg-red-900/40 text-red-400 border border-red-500/20 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}