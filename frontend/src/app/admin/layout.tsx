'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Map, Bus, Hotel, Users, Settings, LogOut, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Direct Bookings', href: '/admin/bookings', icon: Map },
    { name: 'Fleet & Drivers', href: '/admin/fleet', icon: Bus },
    { name: 'Route Management', href: '/admin/routes', icon: Map },
    { name: 'Vehicle Management', href: '/admin/vehicles', icon: Bus },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Customers', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Admin ERP</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            // Strict exact match for dashboard to prevent highlighting it always
            const isStrictActive = item.href === '/admin' ? pathname === '/admin' : isActive;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold ${isStrictActive ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto shrink-0">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg w-full transition-colors font-bold">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-2xl font-black text-black">
            {navItems.find(i => pathname.includes(i.href) && i.href !== '/admin')?.name || 'Overview Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-black shadow-md text-sm">
              AD
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
