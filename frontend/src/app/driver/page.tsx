'use client';

import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, Star, IndianRupee, Navigation, Users, Fuel, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DriverDashboard() {
  const driver = {
    name: 'Rajesh Kumar',
    rating: 4.8,
    totalTrips: 342,
    vehicle: 'Volvo B11R Sleeper (GJ-01-XX-1234)',
    status: 'On Trip',
  };

  const currentTrip = {
    from: 'Ahmedabad',
    to: 'Mumbai',
    departure: '08:30 AM',
    eta: '05:00 PM',
    passengers: 36,
    progress: 65,
    distance: '530 km',
    currentLocation: 'Near Vadodara',
  };

  const todayStats = {
    tripsCompleted: 1,
    distanceCovered: '245 km',
    earnings: '₹2,800',
    fuelUsed: '32 L',
  };

  const upcomingTrips = [
    { id: 't1', from: 'Mumbai', to: 'Pune', date: 'Tomorrow, 6:00 AM', passengers: 42 },
    { id: 't2', from: 'Pune', to: 'Ahmedabad', date: 'Jul 19, 7:00 PM', passengers: 38 },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
            RK
          </div>
          <div>
            <h2 className="text-xl font-black">Hello, {driver.name}!</h2>
            <div className="flex items-center gap-3 text-sm opacity-80">
              <span className="flex items-center gap-1"><Star size={12} fill="currentColor" /> {driver.rating}</span>
              <span>·</span>
              <span>{driver.totalTrips} trips</span>
            </div>
          </div>
        </div>
        <p className="text-sm opacity-70 flex items-center gap-2">
          <Bus size={14} /> {driver.vehicle}
        </p>
      </motion.div>

      {/* Current Trip */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-3xl shadow-md" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-sm uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Active Trip</h3>
          <span className="px-3 py-1 rounded-lg text-xs font-black bg-blue-100 text-blue-700">In Progress</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="text-center">
            <p className="text-lg font-black" style={{ color: 'var(--foreground)' }}>{currentTrip.from}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{currentTrip.departure}</p>
          </div>
          <div className="flex-1 relative mx-2">
            <div className="h-1 rounded-full" style={{ backgroundColor: 'var(--card-border)' }}>
              <div className="h-1 rounded-full bg-blue-500 transition-all" style={{ width: `${currentTrip.progress}%` }} />
            </div>
            <div className="absolute top-3 left-0 right-0 flex justify-between text-[10px] font-bold" style={{ color: 'var(--muted)' }}>
              <span>{currentTrip.progress}%</span>
              <span>{currentTrip.distance}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-black" style={{ color: 'var(--foreground)' }}>{currentTrip.to}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>ETA {currentTrip.eta}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link href="/driver/navigation"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
            <Navigation size={16} /> Navigate
          </Link>
          <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
            <Users size={16} /> {currentTrip.passengers}
          </button>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Trips Today', value: todayStats.tripsCompleted, icon: Bus, color: '#3b82f6' },
          { label: 'Distance', value: todayStats.distanceCovered, icon: MapPin, color: '#10b981' },
          { label: 'Earnings', value: todayStats.earnings, icon: IndianRupee, color: '#f59e0b' },
          { label: 'Fuel Used', value: todayStats.fuelUsed, icon: Fuel, color: '#ef4444' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <stat.icon size={18} style={{ color: stat.color }} className="mb-2" />
            <p className="text-lg font-black" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Trips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Upcoming Trips</h3>
        <div className="space-y-3">
          {upcomingTrips.map(trip => (
            <Link href="/driver/trips" key={trip.id}
              className="flex items-center justify-between p-4 rounded-2xl transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div>
                <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.from} → {trip.to}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{trip.date} · {trip.passengers} passengers</p>
              </div>
              <ArrowRight size={18} style={{ color: 'var(--muted)' }} />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
