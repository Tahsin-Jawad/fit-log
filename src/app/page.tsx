'use client';

import { useState, useEffect } from 'react';
import { fetchWorkouts } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [planCount, setPlanCount] = useState(0);
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

    // লোকালস্টোরেজ থেকে প্ল্যান এবং সেভড কাউন্ট লোড করা
    const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    setPlanCount(plan.length);
    setSavedCount(saved.length);
  }, []);

  // "+ Add to Plan" বাটনের সঠিক লজিক
  const handleAddToPlan = (workout: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const existingPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    const exists = existingPlan.some((item: any) => String(item.id) === String(workout.id));
    
    if (!exists) {
      const updatedPlan = [...existingPlan, workout];
      localStorage.setItem('fitlog_plan', JSON.stringify(updatedPlan));
      setPlanCount(updatedPlan.length);
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
      <Navbar savedCount={savedCount} todayCount={planCount} />
      
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero Section with Banner */}
        <div className="relative bg-[#121214] border border-[#27272a] rounded-3xl p-8 md:p-12 mb-12 overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10 mb-6 md:mb-0">
            <span className="text-[#a1a1aa] text-[10px] font-bold tracking-widest uppercase mb-3 block">
              WORKOUT LIBRARY
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 uppercase leading-tight text-white">
              TRAIN WITH INTENT. LOG <br />
              <span className="text-white">EVERY SET.</span>
            </h1>
            <p className="text-[#a1a1aa] text-xs md:text-sm mb-6 leading-relaxed">
              FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
            </p>
            <a 
              href="#workouts-section" 
              className="inline-block bg-[#ccff00] text-black text-xs font-bold px-5 py-3 rounded-lg hover:bg-[#b3ff00] transition"
            >
              BROWSE WORKOUTS
            </a>
          </div>
          <div className="relative w-full md:w-1/2 h-64 md:h-72 rounded-2xl overflow-hidden bg-zinc-800">
            <img 
              src="/banner.png" 
              alt="Fit Log Banner" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        <div id="workouts-section" className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-1 uppercase">THE LIBRARY</h2>
          <p className="text-zinc-400 text-xs md:text-sm">Twelve lifts covering every major muscle group.</p>
        </div>

        {workouts.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-400">No workouts available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout, index) => (
              <div
                key={workout.id || index}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-lime-400/50 transition"
              >
                <div>
                  {/* Workout Image */}
                  <div className="relative w-full h-48 bg-zinc-800">
                    <img 
                      src={workout.image || "/banner.png"} 
                      alt={workout.title || workout.name || "Workout"} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-lime-400/10 text-lime-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                          {workout.category || 'CHEST'}
                        </span>
                        <span className="bg-lime-400/10 text-lime-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                          ARMS
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleAddToPlan(workout, e)}
                        className="bg-lime-400 text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-lime-300 transition cursor-pointer z-10 relative"
                      >
                        + Add to Plan
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">{workout.title || workout.name}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-1 mb-4">
                      {workout.description || 'Professional training routine.'}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span>⏱️ {workout.duration || '25'} min</span>
                    <span>🔥 {workout.calories || '190'} kcal</span>
                    <span>⭐ {workout.rating || '4.9'}</span>
                  </div>
                  <Link
                    href={`/workouts/${workout.id}`}
                    className="text-lime-400 font-medium hover:underline cursor-pointer z-10"
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