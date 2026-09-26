'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Workout } from '@/types';

export default function MyPlan() {
  const [activeTab, setActiveTab] = useState<'plan' | 'saved'>('plan');
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'duration' | 'calories' | 'rating'>('duration');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadStorageData = () => {
      const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
      const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
      const completed = JSON.parse(localStorage.getItem('fitlog_completed') || '[]');
      setPlanWorkouts(plan);
      setSavedWorkouts(saved);
      setCompletedIds(completed);
    };

    loadStorageData();
    window.addEventListener('storage', loadStorageData);
    return () => window.removeEventListener('storage', loadStorageData);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleRemoveFromPlan = (id: string) => {
    const updated = planWorkouts.filter((item) => item.id !== id);
    setPlanWorkouts(updated);
    localStorage.setItem('fitlog_plan', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    showToast('Removed from plan');
  };

  const handleMarkAsDone = (id: string) => {
    if (!completedIds.includes(id)) {
      const updated = [...completedIds, id];
      setCompletedIds(updated);
      localStorage.setItem('fitlog_completed', JSON.stringify(updated));
      showToast('Workout marked as done!');
    } else {
      showToast('Workout already marked as done');
    }
  };

  const currentList = activeTab === 'plan' ? planWorkouts : savedWorkouts;

  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === 'duration') return a.duration - b.duration;
    if (sortBy === 'calories') return a.calories - b.calories;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalExercises = planWorkouts.length;
  const totalMinutes = planWorkouts.reduce((acc, item) => acc + item.duration, 0);
  const totalCalories = planWorkouts.reduce((acc, item) => acc + item.calories, 0);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#ccff00] text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50 text-sm transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">MY PLAN</h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Exercises</span>
            <div className="text-3xl font-extrabold text-[#ccff00] mt-2">{totalExercises}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Minutes</span>
            <div className="text-3xl font-extrabold text-white mt-2">{totalMinutes}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Calories</span>
            <div className="text-3xl font-extrabold text-white mt-2">{totalCalories}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b border-zinc-800 pb-4">
          <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'plan' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Today's Plan
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'saved' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Saved
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-semibold">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'duration' | 'calories' | 'rating')}
              className="bg-zinc-900 border border-zinc-800 text-white text-xs rounded-lg px-3 py-2 font-semibold outline-none focus:border-zinc-700"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {sortedList.length === 0 ? (
          <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-2xl p-16 text-center">
            <h3 className="text-xl font-bold uppercase mb-2">NOTHING HERE YET</h3>
            <p className="text-zinc-400 text-xs mb-6">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl text-xs hover:bg-[#b3e600] transition-colors"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedList.map((workout) => {
              const isDone = completedIds.includes(workout.id);
              return (
                <div
                  key={workout.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative h-16 w-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image
                        src={workout.image}
                        alt={workout.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase">{workout.title}</h4>
                      <p className="text-zinc-400 text-xs">{workout.equipment}</p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                        <span>⏱️ {workout.duration} min</span>
                        <span>🔥 {workout.calories} kcal</span>
                        <span>⭐ {workout.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors"
                    >
                      View Details
                    </Link>
                    {activeTab === 'plan' && (
                      <button
                        onClick={() => handleMarkAsDone(workout.id)}
                        className={`font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                          isDone
                            ? 'bg-zinc-800 text-zinc-400 cursor-default'
                            : 'bg-[#ccff00] hover:bg-[#b3e600] text-black'
                        }`}
                      >
                        <span>{isDone ? '✓' : '✓'}</span>
                        <span>{isDone ? 'Completed' : 'Mark as Done'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromPlan(workout.id)}
                      className="bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
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
    </div>
  );
}