'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchWorkouts } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function WorkoutDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkout() {
      if (!id) return;
      try {
        const workouts = await fetchWorkouts();
        const found = workouts.find((w: any) => String(w.id) === String(id));
        setWorkout(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getWorkout();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading workout details...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white">
        <Navbar savedCount={0} todayCount={0} />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Workout not found</h1>
          <Link
            href="/"
            className="inline-block bg-[#ccff00] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#b3ff00] transition"
          >
            Back to Home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar savedCount={0} todayCount={0} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-[#ccff00] transition mb-6 inline-block"
        >
          ← Back to Library
        </Link>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="bg-[#ccff00]/10 text-[#ccff00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {workout.category || 'General'}
            </span>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>⏱️ {workout.duration || '30'} mins</span>
              <span>🔥 {workout.calories || '200'} kcal</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            {workout.title || workout.name || 'Workout Detail'}
          </h1>

          <p className="text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">
            {workout.description || 'No description provided for this workout routine.'}
          </p>

          <div className="border-t border-zinc-800 pt-6">
            <h2 className="text-xl font-bold mb-4 text-[#ccff00]">Exercises Included</h2>
            {workout.exercises && workout.exercises.length > 0 ? (
              <ul className="space-y-3">
                {workout.exercises.map((ex: any, index: number) => (
                  <li
                    key={index}
                    className="bg-zinc-950 border border-zinc-800/60 p-4 rounded-xl flex items-center justify-between"
                  >
                    <span className="font-medium">{ex.name || ex}</span>
                    <span className="text-sm text-zinc-500">{ex.sets ? `${ex.sets} sets` : ''}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500">Standard routine follows standard protocol.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}