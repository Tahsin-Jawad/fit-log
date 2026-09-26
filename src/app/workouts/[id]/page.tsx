'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchWorkoutById } from '@/services/api';
import { Workout } from '@/types';

export default function WorkoutDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [workout, setWorkout] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadDetails() {
      setLoading(true);
      const data = await fetchWorkoutById(id);
      setWorkout(data);
      setLoading(false);
    }
    loadDetails();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Safe extraction of calories and duration
  const getDuration = (item: any) => {
    const dur = item?.duration || item?.time || 15;
    return typeof dur === 'number' ? dur : parseInt(String(dur).replace(/[^0-9]/g, ''), 10) || 15;
  };

  const getCalories = (item: any) => {
    const cal = item?.calories || item?.calorie || item?.kcal;
    if (cal) {
      const parsed = parseInt(String(cal).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed)) return parsed;
    }
    // Fallback estimation if API doesn't provide calories (duration * 8)
    return getDuration(item) * 8;
  };

  const handleAddToPlan = () => {
    if (!workout) return;
    const existingPlan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
    
    if (existingPlan.length >= 5) {
      showToast('Cap of five lifts reached for today!');
      return;
    }

    // Normalize workout object with guaranteed calories and duration before saving
    const normalizedWorkout = {
      ...workout,
      duration: getDuration(workout),
      calories: getCalories(workout),
    };

    if (!existingPlan.some((item: any) => item.id === workout.id)) {
      existingPlan.push(normalizedWorkout);
      localStorage.setItem('fitlog_plan', JSON.stringify(existingPlan));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('fitlog_storage_updated'));
      showToast('Added to today\'s plan');
    } else {
      showToast('Already in today\'s plan');
    }
  };

  const handleSaveForLater = () => {
    if (!workout) return;
    const existingSaved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
    
    const normalizedWorkout = {
      ...workout,
      duration: getDuration(workout),
      calories: getCalories(workout),
    };

    if (!existingSaved.some((item: any) => item.id === workout.id)) {
      existingSaved.push(normalizedWorkout);
      localStorage.setItem('fitlog_saved', JSON.stringify(existingSaved));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('fitlog_storage_updated'));
      showToast('Saved for later');
    } else {
      showToast('Already saved');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ccff00]"></div>
        <span className="ml-3 text-zinc-400 text-sm">Loading workout details...</span>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Workout Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-[#ccff00] text-black font-bold px-4 py-2 rounded-lg text-xs"
        >
          Back to Workouts
        </button>
      </div>
    );
  }

  const finalDuration = getDuration(workout);
  const finalCalories = getCalories(workout);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-[#ccff00] text-black font-bold px-5 py-3 rounded-xl shadow-lg z-50 text-sm transition-all">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src={workout.image}
              alt={workout.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-3">
              {workout.title}
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-6 leading-relaxed">
              {workout.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {Array.isArray(workout.category) ? (
                workout.category.map((cat: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#ccff00] text-black text-xs font-bold px-3 py-1 rounded uppercase"
                  >
                    {cat}
                  </span>
                ))
              ) : (
                <span className="bg-[#ccff00] text-black text-xs font-bold px-3 py-1 rounded uppercase">
                  {workout.category}
                </span>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-8">
              {[
                { label: 'EQUIPMENT', value: workout.equipment },
                { label: 'DIFFICULTY', value: workout.difficulty },
                { label: 'SETS', value: workout.sets },
                { label: 'REPS', value: workout.reps },
                { label: 'DURATION', value: `${finalDuration} min` },
                { label: 'CALORIES', value: `${finalCalories} kcal` },
                { label: 'RATING', value: workout.rating },
              ].map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-6 py-3.5 border-b border-zinc-800 last:border-none text-xs md:text-sm"
                >
                  <span className="text-zinc-400 font-semibold">{spec.label}</span>
                  <span className="font-bold text-white">{spec.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold uppercase mb-4">INSTRUCTIONS</h3>
              <ol className="space-y-3">
                {workout.instructions?.map((step: string, index: number) => (
                  <li key={index} className="flex gap-4 text-xs md:text-sm text-zinc-300">
                    <span className="font-bold text-[#ccff00]">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToPlan}
                className="flex-1 bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold py-3.5 px-6 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>📅</span>
                <span>Add to today's plan</span>
              </button>
              <button
                onClick={handleSaveForLater}
                className="flex-1 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>🔖</span>
                <span>Save for later</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}