import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4">
      <div className="w-24 h-24 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center mb-8 shadow-xl">
        <Compass size={48} className="animate-spin-slow" />
      </div>
      <h1 className="text-7xl font-black text-[var(--foreground)] tracking-tighter mb-2">404</h1>
      <h2 className="text-2xl font-bold text-[var(--muted)] mb-8 text-center max-w-md">
        Looks like you've wandered off the map. This page doesn't exist.
      </h2>
      <Link 
        href="/" 
        className="px-8 py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
      >
        Return to Home Base
      </Link>
    </div>
  );
}
