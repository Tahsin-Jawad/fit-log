import { fetchWorkouts } from '@/services/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default async function Home() {
  const workouts = await fetchWorkouts();

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar savedCount={0} todayCount={0} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative bg-[#121214] border border-[#27272a] rounded-2xl p-8 md:p-12 mb-12 overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl z-10">
            <span className="text-lime-400 text-xs font-bold tracking-widest uppercase mb-2 block">
              FITNESS FIRST
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">
              Train with intent. Log every set.
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mb-6">
              Track your daily workouts, build custom routines, and push your limits with our comprehensive fitness management system.
            </p>
            <a
              href="#library"
              className="inline-block bg-lime-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-lime-500 transition-colors text-sm"
            >
              Browse Workouts
            </a>
          </div>
          <div className="mt-8 md:mt-0 z-10">
            <div className="w-48 h-48 md:w-60 md:h-60 bg-gradient-to-br from-lime-400/20 to-transparent rounded-full flex items-center justify-center border border-lime-400/30">
              <span className="text-6xl">🏋️‍♂️</span>
            </div>
          </div>
        </div>

        {/* Library Section */}
        <div id="library" className="mb-8">
          <h2 className="text-xl font-bold tracking-wider uppercase mb-6 text-zinc-200">
            The Library
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workouts.map((workout, index) => {
              const workoutId = workout._id || workout.id || String(index);
              return (
                <div
                  key={workoutId}
                  className="bg-[#121214] border border-[#27272a] rounded-xl overflow-hidden hover:border-lime-400/50 transition-all group flex flex-col"
                >
                  <div className="h-48 bg-[#18181b] flex items-center justify-center relative overflow-hidden">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">💪</span>
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-lime-400 text-xs font-bold px-2.5 py-1 rounded">
                      {workout.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-bold text-base mb-2 tracking-wide text-zinc-100 group-hover:text-lime-400 transition-colors">
                        {workout.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-zinc-400 mb-4">
                        <span>⏱️ {workout.duration} mins</span>
                        <span>🔥 {workout.calories} kcal</span>
                      </div>
                    </div>
                    <Link
                      href={`/workouts/${workoutId}`}
                      className="w-full text-center bg-[#18181b] border border-[#27272a] text-zinc-200 font-semibold py-2 rounded-lg text-xs hover:bg-lime-400 hover:text-black hover:border-lime-400 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}