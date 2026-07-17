'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@munnatravels.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Set user object in localStorage for the layouts to use
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, role: data.role }));
      
      // Call AuthContext login to set token and handle redirect
      login(data.token, data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-20" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Welcome Back</h1>
            <p className="font-medium" style={{ color: 'var(--muted)' }}>Sign in to manage your bookings and access premium features.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl mb-6 font-bold text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl py-4 pl-12 pr-4 font-bold border border-transparent focus:border-black dark:focus:border-white outline-none transition" 
                  style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Password</label>
                <Link href="#" className="text-sm font-bold hover:underline" style={{ color: 'var(--foreground)' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl py-4 pl-12 pr-4 font-bold border border-transparent focus:border-black dark:focus:border-white outline-none transition" 
                  style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl font-black text-lg hover:opacity-90 transition flex items-center justify-center shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? 'Signing In...' : <><LogIn className="mr-2" size={20} /> Sign In</>}
            </button>
          </form>

          <p className="mt-8 text-center font-bold" style={{ color: 'var(--muted)' }}>
            Don't have an account? <Link href="#" className="hover:underline" style={{ color: 'var(--foreground)' }}>Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right side - Premium Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden" style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-20 flex flex-col justify-end p-16 text-white h-full">
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 max-w-lg">
            <h2 className="text-3xl font-black tracking-tight mb-4 text-white">Experience Luxury Travel</h2>
            <p className="text-white/80 font-medium leading-relaxed mb-6">
              Join thousands of satisfied passengers who choose TripNova Holidays for their intercity journeys. Access exclusive routes, AI planning, and seamless booking.
            </p>
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider text-white/90">
              <span className="flex items-center"><ArrowRight size={16} className="mr-2" /> Fleet Management</span>
              <span className="flex items-center"><ArrowRight size={16} className="mr-2" /> Live Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
