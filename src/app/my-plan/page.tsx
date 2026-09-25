'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function MyPlanPage() {
  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);

  useEffect(() => {
    
    const saved = JSON.parse(localStorage.getItem('savedWorkouts') || '[]');
    setSavedWorkouts(saved);
  }, []);

  const handleRemove = (id: string) => {
    const updated = savedWorkouts.filter((item) => item.id !== id);
    setSavedWorkouts(updated);
    localStorage.setItem('savedWorkouts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar savedCount={savedWorkouts.length} todayCount={0} />
      
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">My Saved Plan</h1>
            <p className="text-zinc-400">Manage your bookmarked workouts and routines.</p>
          </div>
          <Link
            href="/"
            className="bg-[#ccff00] text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#b3ff00] transition text-sm"
          >
            + Add More Workouts
          </Link>
        </div>

        {savedWorkouts.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-12 text-center">
            <p className="text-zinc-400 mb-4 text-lg">No workouts saved in your plan yet.</p>
            <Link
              href="/"
              className="text-[#ccff00] underline font-medium hover:text-white transition"
            >
              Browse workouts and add to plan
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#ccff00]/10 text-[#ccff00] text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {workout.category || 'General'}
                    </span>
                    <button
                      onClick={() => handleRemove(workout.id)}
                      className="text-zinc-500 hover:text-red-400 transition text-sm"
                    >
                      Remove ✕
                    </button>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{workout.title || workout.name}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {workout.description || 'Custom fitness routine.'}
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