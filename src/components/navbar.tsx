'vow use client'; // অথবা সাধারণ ক্লায়েন্ট কম্পোনেন্ট হিসেবে

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  planCount: number;
  savedCount: number;
}

export default function Navbar({ planCount, savedCount }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="w-full bg-black border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center text-[#ccff00]">
            ⚡
          </div>
          <span>FITLOG</span>
        </Link>
      </div>

      <nav className="flex items-center gap-8">
        <Link
          href="/"
          className={`text-sm font-medium transition-colors ${
            pathname === '/' ? 'text-[#ccff00]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Workouts
        </Link>
        <Link
          href="/my-plan"
          className={`text-sm font-medium transition-colors ${
            pathname === '/my-plan' ? 'text-[#ccff00]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          My Plan
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/my-plan"
          className="flex items-center gap-2 bg-[#ccff00] text-black px-3 py-1.5 rounded-full text-xs font-bold"
        >
          <span>PLAN:</span>
          <span>{planCount}</span>
        </Link>
        <Link
          href="/my-plan"
          className="flex items-center gap-2 border border-zinc-700 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:border-zinc-500"
        >
          <span>SAVED:</span>
          <span>{savedCount}</span>
        </Link>
      </div>
    </header>
  );
}