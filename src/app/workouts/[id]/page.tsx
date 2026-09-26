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
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

    const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    setPlanCount(plan.length);
    setSavedCount(saved.length);
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToPlan = () => {
    if (!workout) return;
    const existingPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    
    // Cap of 5 lifts rule
    if (existingPlan.length >= 5) {
      showToast('⚠️ Plan is full! Maximum 5 lifts allowed for today.');
      return;
    }

    const exists = existingPlan.some((item: any) => String(item.id) === String(workout.id));
    if (!exists) {
      const updatedPlan = [...existingPlan, workout];
      localStorage.setItem('fitlog_plan', JSON.stringify(updatedPlan));
      setPlanCount(updatedPlan.length);
      showToast('✅ Added to today\'s plan successfully!');
    } else {
      showToast('⚠️ This workout is already in your plan.');
    }
  };

  const handleSaveForLater = () => {
    if (!workout) return;
    const existingSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    const exists = existingSaved.some((item: any) => String(item.id) === String(workout.id));
    
    if (!exists) {
      const updatedSaved = [...existingSaved, workout];
      localStorage.setItem('fitlog_saved', JSON.stringify(updatedSaved));
      setSavedCount(updatedSaved.length);
      showToast('🔖 Saved for later successfully!');
    } else {
      showToast('⚠️ This workout is already saved.');
    }
  };

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
        <Navbar savedCount={savedCount} todayCount={planCount} />
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
    <div className="min-h-screen bg-[#09090b] text-white relative">
      <Navbar savedCount={savedCount} todayCount={planCount} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ccff00] text-black px-4 py-3 rounded-xl font-bold shadow-2xl transition-all duration-300 animate-bounce">
          {toastMessage}
        </div>
      )}
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-400 hover:text-[#ccff00] transition mb-6 inline-block"
        >
          ← Back to Library
        </Link>

        {/* Figma Layout Card Container */}
        <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image */}
            <div className="lg:col-span-5 w-full h-[320px] md:h-[450px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80">
              <img 
                src={workout.image} 
                alt={workout.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Column: Details & Specs */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Muscle Groups / Category Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {workout.muscleGroups?.map((group: string, idx: number) => (
                    <span key={idx} className="bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                      {group}
                    </span>
                  ))}
                </div>

                {/* Workout Name */}
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3">
                  {workout.name}
                </h1>

                {/* Description */}
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
                  {workout.description}
                </p>

                {/* Specs Table mapping exact API fields */}
                <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl mb-6 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">EQUIPMENT</span>
                    <span className="font-bold text-white">{workout.equipment}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">DIFFICULTY</span>
                    <span className="font-bold text-white">{workout.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">SETS</span>
                    <span className="font-bold text-white">{workout.sets}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">REPS</span>
                    <span className="font-bold text-white">{workout.reps}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">DURATION</span>
                    <span className="font-bold text-white">{workout.duration} min</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 text-xs">
                    <span className="text-zinc-400 font-medium">CALORIES BURNED</span>
                    <span className="font-bold text-white">{workout.caloriesBurned} kcal</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-xs">
                    <span className="text-zinc-400 font-medium">RATING</span>
                    <span className="font-bold text-white">⭐ {workout.rating}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleAddToPlan}
                  className="w-full sm:flex-1 bg-[#ccff00] text-black text-xs font-bold py-3.5 px-6 rounded-xl hover:bg-[#b3ff00] transition text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>+</span> Add to today&apos;s plan
                </button>
                <button
                  onClick={handleSaveForLater}
                  className="w-full sm:w-auto bg-zinc-900 border border-zinc-700 text-white text-xs font-bold py-3.5 px-6 rounded-xl hover:bg-zinc-800 transition text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔖</span> Save for later
                </button>
              </div>

            </div>

          </div>

          {/* Instructions Dynamic Mapping from API */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <h2 className="text-sm font-black uppercase mb-3 text-white tracking-widest">INSTRUCTIONS</h2>
            <ol className="space-y-2 text-xs md:text-sm text-zinc-400 list-decimal list-inside leading-relaxed">
              {workout.instructions?.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

        </div>
      </main>
    </div>
  );
}