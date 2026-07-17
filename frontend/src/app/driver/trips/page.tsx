'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, Check, ArrowRight, Play, Square } from 'lucide-react';

const trips = [
  { id: 't1', from: 'Ahmedabad', to: 'Mumbai', date: '2026-07-17', departure: '08:30 AM', arrival: '05:00 PM', passengers: 36, status: 'active', distance: '530 km', busType: 'Volvo B11R' },
  { id: 't2', from: 'Mumbai', to: 'Pune', date: '2026-07-18', departure: '06:00 AM', arrival: '10:30 AM', passengers: 42, status: 'upcoming', distance: '150 km', busType: 'Scania Metrolink' },
  { id: 't3', from: 'Pune', to: 'Ahmedabad', date: '2026-07-19', departure: '07:00 PM', arrival: '06:30 AM', passengers: 38, status: 'upcoming', distance: '660 km', busType: 'Volvo B11R' },
  { id: 't4', from: 'Ahmedabad', to: 'Udaipur', date: '2026-07-15', departure: '06:00 AM', arrival: '11:15 AM', passengers: 28, status: 'completed', distance: '260 km', busType: 'BharatBenz 1624' },
  { id: 't5', from: 'Ahmedabad', to: 'Jaipur', date: '2026-07-12', departure: '08:00 PM', arrival: '06:30 AM', passengers: 40, status: 'completed', distance: '680 km', busType: 'Volvo A/C Sleeper' },
];

export default function DriverTripsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = trips.filter(t => filter === 'all' || t.status === filter);

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Active' },
    upcoming: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Upcoming' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  };

  return (
    <div className="py-6 space-y-6">
      <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>My Trips</h2>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'active', 'upcoming', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'scale-105' : 'opacity-60'}`}
            style={{ backgroundColor: filter === f ? 'var(--foreground)' : 'var(--card-bg)', color: filter === f ? 'var(--background)' : 'var(--foreground)', border: '1px solid var(--card-border)' }}>
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Trip Cards */}
      <div className="space-y-4">
        {filtered.map((trip, i) => {
          const config = statusConfig[trip.status];
          return (
            <motion.div key={trip.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl shadow-sm"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              
              <div className="flex justify-between items-center mb-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${config.bg} ${config.text}`}>{config.label}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{trip.date}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.from}</p>
                <ArrowRight size={14} style={{ color: 'var(--muted)' }} />
                <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.to}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs mb-4" style={{ color: 'var(--muted)' }}>
                <span className="flex items-center gap-1.5 font-medium"><Clock size={12} /> {trip.departure} - {trip.arrival}</span>
                <span className="flex items-center gap-1.5 font-medium"><MapPin size={12} /> {trip.distance}</span>
                <span className="flex items-center gap-1.5 font-medium"><Users size={12} /> {trip.passengers} passengers</span>
                <span className="flex items-center gap-1.5 font-medium">🚌 {trip.busType}</span>
              </div>

              {/* Actions */}
              {trip.status === 'active' && (
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors">
                  <Square size={14} /> End Trip
                </button>
              )}
              {trip.status === 'upcoming' && (
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                  <Play size={14} /> Start Trip
                </button>
              )}
              {trip.status === 'completed' && (
                <div className="flex items-center gap-2 text-sm font-medium text-green-500">
                  <Check size={14} /> Trip completed successfully
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
