'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  savedCount: number;
  todayCount: number;
}

export default function Navbar({ savedCount, todayCount }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#121214] border-b border-[#27272a] text-white py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
  <Image src="/logo.png" alt="Fit Log Logo" width={80} height={24} className="h-6 w-auto object-contain" />
</Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link 
            href="/" 
            className={`hover:text-lime-400 transition-colors ${pathname === '/' ? 'text-lime-400 font-semibold' : 'text-zinc-300'}`}
          >
            Workouts
          </Link>
          <Link 
            href="/my-plan" 
            className={`hover:text-lime-400 transition-colors ${pathname === '/my-plan' ? 'text-lime-400 font-semibold' : 'text-zinc-300'}`}
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-md flex items-center gap-2">
            <span className="text-zinc-400">PLAN:</span>
            <span className="text-lime-400">{todayCount}</span>
          </div>
          <div className="bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-md flex items-center gap-2">
            <span className="text-zinc-400">SAVED:</span>
            <span className="text-lime-400">{savedCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}