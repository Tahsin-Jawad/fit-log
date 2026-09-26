import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl md:text-8xl font-extrabold text-[#ccff00] mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">Page Not Found</h2>
      <p className="text-zinc-400 text-sm max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[#ccff00] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}