'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Map, Bus, Ticket, Building2, Package, 
  MessageSquare, Bell, FileText, PieChart, Users, Settings, 
  Menu, X, LogOut, ChevronLeft, ChevronRight, PenTool
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { group: 'Overview', items: [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/reports', icon: PieChart, label: 'Reports & Analytics' },
  ]},
  { group: 'Operations', items: [
    { href: '/admin/fleet-tracking', icon: Map, label: 'Fleet Tracking' },
    { href: '/admin/fleet', icon: Bus, label: 'Fleet Management' },
    { href: '/admin/bookings', icon: Ticket, label: 'Bookings & Tickets' },
    { href: '/admin/invoices', icon: FileText, label: 'Invoices' },
  ]},
  { group: 'Content', items: [
    { href: '/admin/hotels', icon: Building2, label: 'Hotels' },
    { href: '/admin/blogs', icon: PenTool, label: 'Travel Blogs' },
  ]},
  { group: 'Engagement', items: [
    { href: '/admin/feedback', icon: MessageSquare, label: 'Feedback & AI' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: collapsed ? 80 : 280, x: mobileOpen ? 0 : ((typeof window !== 'undefined' && window.innerWidth < 1024) ? -280 : 0) }}
        className="fixed lg:sticky top-0 h-screen z-50 flex flex-col border-r transition-all duration-300"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
      >
        {/* Logo & Toggle */}
        <div className="h-20 flex items-center justify-between px-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 font-black text-xl tracking-tight" style={{ color: 'var(--foreground)' }}>
              <div className="bg-black text-white dark:bg-white dark:text-black p-1.5 rounded-lg">
                <Bus size={20} strokeWidth={2.5} />
              </div>
              <span>Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto bg-black text-white dark:bg-white dark:text-black p-1.5 rounded-lg">
              <Bus size={20} strokeWidth={2.5} />
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--foreground)' }}>
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5" style={{ color: 'var(--foreground)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          {menuItems.map((group, idx) => (
            <div key={idx}>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-black uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all ${
                        isActive ? 'scale-105 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100'
                      }`}
                      style={{ 
                        backgroundColor: isActive ? 'var(--foreground)' : 'transparent',
                        color: isActive ? 'var(--background)' : 'var(--foreground)'
                      }}
                      title={collapsed ? item.label : ''}
                    >
                      <item.icon size={20} className="shrink-0" />
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User & Logout */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
          {!collapsed ? (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm font-black" style={{ color: 'var(--foreground)' }}>{user?.name || 'Admin'}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{user?.role || 'Manager'}</p>
                </div>
              </div>
              <button onClick={logout} className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={logout} className="mx-auto w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden h-20 flex items-center px-4 border-b sticky top-0 z-30 backdrop-blur-md"
          style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--card-border)' }}>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl" style={{ backgroundColor: 'var(--section-alt)' }}>
            <Menu size={20} style={{ color: 'var(--foreground)' }} />
          </button>
          <div className="mx-auto font-black text-lg" style={{ color: 'var(--foreground)' }}>Admin Panel</div>
        </div>
        
        <div className="p-6 md:p-10 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
