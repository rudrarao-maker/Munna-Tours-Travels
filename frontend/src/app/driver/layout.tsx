'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Navigation, MapPin, IndianRupee, Bell } from 'lucide-react';

const navItems = [
  { href: '/driver', icon: Home, label: 'Home' },
  { href: '/driver/trips', icon: Navigation, label: 'Trips' },
  { href: '/driver/navigation', icon: MapPin, label: 'Navigate' },
  { href: '/driver/earnings', icon: IndianRupee, label: 'Earnings' },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--background)' }}>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 backdrop-blur-xl border-b"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-black" style={{ color: 'var(--foreground)' }}>Munna Driver</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Online/Offline Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
            <button className="relative p-2 rounded-xl" style={{ backgroundColor: 'var(--section-alt)' }}>
              <Bell size={18} style={{ color: 'var(--foreground)' }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16 max-w-lg mx-auto px-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl"
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}>
        <div className="flex justify-around items-center max-w-lg mx-auto py-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive ? 'scale-105' : 'opacity-50 hover:opacity-80'}`}>
                <item.icon size={22} style={{ color: isActive ? 'var(--foreground)' : 'var(--muted)' }} />
                <span className="text-[10px] font-bold" style={{ color: isActive ? 'var(--foreground)' : 'var(--muted)' }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
