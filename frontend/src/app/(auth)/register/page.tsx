'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/register', { ...formData, role: 'customer' });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-24">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
        <div>
          <h2 className="text-3xl font-black text-center text-black tracking-tight">Create an Account</h2>
          <p className="text-center text-gray-500 font-medium mt-2">Join TripNova Holidays today</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 text-center">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Full Name</label>
            <input
              name="name"
              type="text"
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Email Address</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Phone</label>
            <input
              name="phone"
              type="tel"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-4 text-white bg-black font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md mt-2"
          >
            Create Account
          </button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
