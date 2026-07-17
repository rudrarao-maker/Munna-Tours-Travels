'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bus, Sun, Moon, Menu, X, User } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/routes', label: 'Routes' },
    { href: '/hotels', label: 'Hotels' },
    { href: '/trip-planner', label: '✨ AI Planner' },
    { href: '/book', label: 'Book Now' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed w-full z-50 border-b shadow-sm backdrop-blur-md"
      style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-tight group"
          style={{ color: 'var(--foreground)' }}>
          <div className="bg-black text-white dark:bg-white dark:text-black p-2 rounded-lg group-hover:-rotate-12 transition-transform">
            <Bus size={24} strokeWidth={2.5} />
          </div>
          <span>MUNNA TRAVELS.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? 'font-bold border-b-2'
                  : 'opacity-60'
              } hover:opacity-100 transition-opacity font-medium text-sm pb-1`}
              style={{
                color: 'var(--foreground)',
                borderColor: pathname === link.href ? 'var(--foreground)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex space-x-3 items-center">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Toggle dark mode"
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun size={20} style={{ color: 'var(--foreground)' }} />
            ) : (
              <Moon size={20} style={{ color: 'var(--foreground)' }} />
            )}
          </button>

          {token && user ? (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/my-bookings" className="px-3 py-2 text-sm font-bold hover:opacity-70 transition-opacity" style={{ color: 'var(--foreground)' }}>
                My Bookings
              </Link>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link href="/admin" className="px-3 py-2 text-sm font-bold hover:opacity-70 transition-opacity text-blue-500">
                  Dashboard
                </Link>
              )}
              {user.role === 'driver' && (
                <Link href="/driver" className="px-3 py-2 text-sm font-bold hover:opacity-70 transition-opacity text-green-500">
                  Driver Hub
                </Link>
              )}
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2 font-medium hover:opacity-70 transition-opacity hidden sm:inline-block"
                style={{ color: 'var(--foreground)' }}>
                Login
              </Link>
              <Link href="/register" className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:opacity-90 transition-opacity font-medium shadow-sm">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} style={{ color: 'var(--foreground)' }} />
            ) : (
              <Menu size={24} style={{ color: 'var(--foreground)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-3"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                pathname === link.href ? 'font-bold' : 'opacity-60'
              }`}
              style={{ color: 'var(--foreground)' }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 font-medium text-sm sm:hidden"
            style={{ color: 'var(--foreground)' }}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
