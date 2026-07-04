'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-black tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">Manage your tickets, save your favorite routes, and track your buses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Upcoming Trips</p>
            <h3 className="text-4xl font-black text-black">1</h3>
          </div>
          <Link href="/dashboard/bookings" className="text-sm font-bold text-black flex items-center mt-4 group">
            View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Saved Routes</p>
            <h3 className="text-4xl font-black text-black">4</h3>
          </div>
          <Link href="/dashboard/saved" className="text-sm font-bold text-black flex items-center mt-4 group">
            View Saved <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="bg-black p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-2">Rewards Points</p>
            <h3 className="text-4xl font-black">2,450</h3>
          </div>
          <p className="text-sm font-bold text-white/90 relative z-10 mt-4">Redeem on your next booking!</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-2xl font-black text-black mb-6">Your Next Adventure</h2>
        
        <div className="border border-gray-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-full sm:w-1/3 h-48 rounded-xl bg-gray-100 overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop')" }}
            />
          </div>
          <div className="w-full sm:w-2/3 flex flex-col justify-center">
            <div className="flex gap-2 mb-3">
              <span className="bg-gray-100 text-black px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider">Confirmed</span>
            </div>
            <h3 className="text-2xl font-black text-black mb-2">Kerala Backwaters Retreat</h3>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium mb-6">
              <span className="flex items-center"><MapPin className="mr-1" size={16} /> Kerala, India</span>
              <span className="flex items-center"><Clock className="mr-1" size={16} /> 3N/4D</span>
              <span className="flex items-center"><Calendar className="mr-1" size={16} /> Oct 15, 2026</span>
            </div>
            <div className="flex gap-3">
              <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition">View Itinerary</button>
              <button className="bg-gray-100 text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
