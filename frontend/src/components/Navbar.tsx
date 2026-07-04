'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bus } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/90 backdrop-blur-md fixed w-full z-50 border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-black group">
          <div className="bg-black text-white p-2 rounded-lg group-hover:-rotate-12 transition-transform">
            <Bus size={24} strokeWidth={2.5} />
          </div>
          <span>MUNNA TRAVELS.</span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/" className={`${pathname === '/' ? 'text-black font-bold border-b-2 border-black' : 'text-gray-600'} hover:text-black transition-colors font-medium text-sm pb-1`}>Home</Link>
          <Link href="/routes" className={`${pathname === '/routes' ? 'text-black font-bold border-b-2 border-black' : 'text-gray-600'} hover:text-black transition-colors font-medium text-sm pb-1`}>Routes</Link>
          <Link href="/trip-planner" className={`${pathname === '/trip-planner' ? 'text-black font-bold border-b-2 border-black' : 'text-gray-600'} hover:text-black transition-colors font-medium text-sm pb-1 flex items-center gap-1`}>✨ AI Planner</Link>
          <Link href="/about" className={`${pathname === '/about' ? 'text-black font-bold border-b-2 border-black' : 'text-gray-600'} hover:text-black transition-colors font-medium text-sm pb-1`}>About</Link>
          <Link href="/contact" className={`${pathname === '/contact' ? 'text-black font-bold border-b-2 border-black' : 'text-gray-600'} hover:text-black transition-colors font-medium text-sm pb-1`}>Contact</Link>
        </div>
        <div className="flex space-x-4 items-center">
          <Link href="/login" className="px-5 py-2 text-black font-medium hover:text-gray-600 transition-colors">Login</Link>
          <Link href="/register" className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium shadow-sm">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
