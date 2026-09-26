'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWorkouts } from '@/services/api';
import { Workout } from '@/types';

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('duration');

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

  const getDuration = (w: any) => {
    const dur = w.duration || w.time || 15;
    return typeof dur === 'number' ? dur : parseInt(String(dur).replace(/[^0-9]/g, ''), 10) || 15;
  };

  const getCalories = (w: any) => {
    const cal = w.caloriesBurned || w.calories || w.calorie || w.kcal;
    if (cal) {
      const parsed = parseInt(String(cal).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) return parsed;
    }
    return getDuration(w) * 8;
  };

  const getRating = (w: any) => {
    return Number(w.rating) || 4.5;
  };

  const sortedWorkouts = [...workouts].sort((a: any, b: any) => {
    if (sortBy === 'duration') {
      return getDuration(a) - getDuration(b);
    } else if (sortBy === 'calories') {
      return getCalories(b) - getCalories(a);
    } else if (sortBy === 'rating') {
      return getRating(b) - getRating(a);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
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
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden bg-transparent flex items-center justify-center">
              <img
                src="/banner.png"
                alt="Workout Banner"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide">THE LIBRARY</h2>
            <p className="text-zinc-400 text-sm mt-1">Twelve lifts covering every major muscle group.</p>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
            <span className="text-xs text-zinc-400 font-semibold uppercase">Sort By:</span>
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-xs font-bold uppercase focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="duration" className="bg-zinc-900 text-white">Duration</option>
                <option value="calories" className="bg-zinc-900 text-white">Calories</option>
                <option value="rating" className="bg-zinc-900 text-white">Rating</option>
              </select>
              <span className="pointer-events-none absolute right-0 text-zinc-400 text-xs">
                ▼
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ccff00]"></div>
            <span className="ml-3 text-zinc-400 text-sm">Loading workouts...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkouts.map((workout: any) => {
              const cardDuration = getDuration(workout);
              const cardCalories = getCalories(workout);
              const cardRating = getRating(workout);
              
              // ডেটা ফাইল অনুযায়ী muscleGroups ব্যবহার করা হচ্ছে (অথবা ফলব্যাক হিসেবে category)
              const groups = workout.muscleGroups || workout.category;

              return (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all cursor-pointer group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-48 w-full bg-zinc-800 overflow-hidden">
                      <img
                        src={workout.image}
                        alt={workout.name || workout.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-5 pb-3">
                      {/* Muscle Groups Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Array.isArray(groups) ? (
                          groups.map((group: string, index: number) => (
                            <span
                              key={index}
                              className="bg-[#ccff00] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider"
                            >
                              {group}
                            </span>
                          ))
                        ) : (
                          <span className="bg-[#ccff00] text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            {groups || 'GENERAL'}
                          </span>
                        )}
                      </div>

                      {/* Title / Name */}
                      <h3 className="text-base font-extrabold uppercase text-white tracking-wide mb-1">
                        {workout.name || workout.title}
                      </h3>

                      {/* Equipment */}
                      <p className="text-zinc-400 text-xs">
                        {workout.equipment || 'Standard Equipment'}
                      </p>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="p-5 pt-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800/80 pt-3">
                      <span className="flex items-center gap-1">
                        ⏱️ {cardDuration} min
                      </span>
                      <span className="flex items-center gap-1 text-zinc-300">
                        🔥 {cardCalories} kcal
                      </span>
                      <span className="flex items-center gap-1 text-zinc-300">
                        ⭐ {cardRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}