'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LayoutDashboard, Heart, History, Settings, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
    } else {
      const user = JSON.parse(userStr);
      setUserName(user.name || 'Traveler');
    }
  }, [router]);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/bookings', icon: History },
    { name: 'Saved Routes', href: '/dashboard/saved', icon: Heart },
    { name: 'Profile Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-20" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <aside className="w-full md:w-64 px-4 py-8 flex flex-col min-h-[calc(100vh-5rem)] border-r"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-12 h-12 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center shadow-md">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Welcome back,</p>
            <h2 className="text-lg font-black" style={{ color: 'var(--foreground)' }}>{userName}</h2>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                  isActive 
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                style={{ color: isActive ? '' : 'var(--muted)' }}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
