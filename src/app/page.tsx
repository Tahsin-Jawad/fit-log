'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchWorkouts } from '@/services/api';
import { Workout } from '@/types';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const scrollToLibrary = () => {
    const section = document.getElementById('library');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              WORKOUT LIBRARY
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mt-2 mb-4 leading-none">
              TRAIN WITH INTENT. LOG EVERY SET.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-8">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.
            </p>
            <button
              onClick={scrollToLibrary}
              className="bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 hover:bg-[#b3e600] transition-colors"
            >
              <span>BROWSE WORKOUTS</span>
              <span>↓</span>
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-zinc-800">
              <Image
                src="/banner.png"
                alt="Workout Banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">THE LIBRARY</h2>
          <p className="text-zinc-400 text-sm mt-1">Twelve lifts covering every major muscle group.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ccff00]"></div>
            <span className="ml-3 text-zinc-400 text-sm">Loading workouts...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all"
              >
                <div>
                  <div className="relative h-48 w-full bg-zinc-800">
                    <Image
                      src={workout.image}
                      alt={workout.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {workout.category.map((cat, index) => (
                        <span
                          key={index}
                          className="bg-[#ccff00] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold uppercase mb-1">{workout.title}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4">
                      {workout.description}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-4 mb-4">
                    <span>⏱️ {workout.duration} min</span>
                    <span>🔥 {workout.calories} kcal</span>
                    <span>⭐ {workout.rating}</span>
                  </div>
                  <Link
                    href={`/workouts/${workout.id}`}
                    className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}