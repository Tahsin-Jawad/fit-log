'use client';

import { useState, useEffect } from 'react';
import { fetchWorkouts } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const saved = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    setSavedCount(saved.length);
  }, []);

  const handleAddToPlan = (workout: any, e: React.MouseEvent) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    const exists = existing.some((item: any) => String(item.id) === String(workout.id));
    
    if (!exists) {
      const updated = [...existing, workout];
      localStorage.setItem('savedWorkouts', JSON.stringify(updated));
      setSavedCount(updated.length);
      alert('Workout added to your plan successfully!');
    } else {
      alert('This workout is already in your plan!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading workout library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar savedCount={savedCount} todayCount={0} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Workout Library</h1>
          <p className="text-zinc-400">Explore professional fitness routines and build your personal plan.</p>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-400">No workouts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-[#ccff00]/50 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#ccff00]/10 text-[#ccff00] text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {workout.category || 'General'}
                    </span>
                    <button
                      onClick={(e) => handleAddToPlan(workout, e)}
                      className="bg-[#ccff00] text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#b3ff00] transition cursor-pointer"
                    >
                      + Add to Plan
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{workout.title || workout.name}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {workout.description || 'Professional training routine.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-400">
                  <span>⏱️ {workout.duration || '30'} mins</span>
                  <Link
                    href={`/workouts/${workout.id}`}
                    className="text-[#ccff00] font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}