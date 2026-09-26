'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [planCount, setPlanCount] = useState<number>(0);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const updateCounts = () => {
      try {
        const plan = JSON.parse(localStorage.getItem('fitlog_plan') || '[]');
        const saved = JSON.parse(localStorage.getItem('fitlog_saved') || '[]');
        setPlanCount(Array.isArray(plan) ? plan.length : 0);
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch (e) {
        setPlanCount(0);
        setSavedCount(0);
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('fitlog_storage_updated', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('fitlog_storage_updated', updateCounts);
    };
  }, []);

  return (
    <header className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="FitLog Logo" className="h-8 w-auto object-contain bg-transparent border-0" />
          <span className="text-white font-extrabold text-xl tracking-wider">FITLOG</span>
        </Link>
      </div>

      {/* Middle: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-full">
        <Link
          href="/"
          className={`px-5 py-1.5 rounded-full text-xs font-bold transition-colors ${
            pathname === '/' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Workouts
        </Link>
        <Link
          href="/my-plan"
          className={`px-5 py-1.5 rounded-full text-xs font-bold transition-colors ${
            pathname === '/my-plan' ? 'bg-[#ccff00] text-black' : 'text-zinc-400 hover:text-white'
          }`}
        >
          My Plan
        </Link>
      </nav>

      {/* Right: Status Badges (Counters) */}
      <div className="flex items-center gap-3">
        <Link
          href="/my-plan"
          className="flex items-center gap-2 bg-[#ccff00] text-black px-3.5 py-1.5 rounded-full text-xs font-bold shadow"
        >
          <span>PLAN:</span>
          <span>{mounted ? planCount : 0}</span>
        </Link>
        <Link
          href="/my-plan"
          className="flex items-center gap-2 border border-zinc-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:border-zinc-500 transition-colors"
        >
          <span>SAVED:</span>
          <span>{mounted ? savedCount : 0}</span>
        </Link>
      </div>
    </header>
  );
}