'use client';

import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, Gauge, Bus, AlertTriangle, CheckCircle, Circle } from 'lucide-react';

export default function DriverNavigationPage() {
  const trip = {
    from: 'Ahmedabad',
    to: 'Mumbai',
    currentLocation: 'Vadodara Bypass',
    nextStop: 'Surat',
    nextStopETA: '1 hr 45 min',
    finalETA: '05:00 PM',
    speed: 65,
    distanceRemaining: '350 km',
  };

  const stops = [
    { name: 'Ahmedabad', time: '08:30 AM', status: 'passed' },
    { name: 'Nadiad', time: '09:45 AM', status: 'passed' },
    { name: 'Vadodara', time: '10:30 AM', status: 'current' },
    { name: 'Surat', time: '12:15 PM', status: 'upcoming' },
    { name: 'Vapi', time: '02:00 PM', status: 'upcoming' },
    { name: 'Mumbai', time: '05:00 PM', status: 'upcoming' },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Map Area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden relative h-[300px]"
        style={{ border: '1px solid var(--card-border)' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d942902.8068474985!2d72.2!3d21.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad!3d23.0225!4d72.5714!4m5!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai!3d19.076!4d72.8777!5e0!3m2!1sen!2sin"
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
        />
        {/* Speed Overlay */}
        <div className="absolute bottom-4 left-4 p-3 rounded-2xl backdrop-blur-md flex items-center gap-3"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <Gauge size={20} className="text-green-400" />
          <div>
            <p className="text-2xl font-black text-white">{trip.speed}</p>
            <p className="text-[10px] text-white/60 font-bold">km/h</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 p-3 rounded-2xl backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <p className="text-xs text-white/60 font-bold">ETA</p>
          <p className="text-lg font-black text-white">{trip.finalETA}</p>
        </div>
      </motion.div>

      {/* Current Status */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
            <Navigation size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Current Location</p>
            <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.currentLocation}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--section-alt)' }}>
            <p className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Next Stop</p>
            <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.nextStop}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{trip.nextStopETA}</p>
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--section-alt)' }}>
            <p className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Remaining</p>
            <p className="font-black" style={{ color: 'var(--foreground)' }}>{trip.distanceRemaining}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>to {trip.to}</p>
          </div>
        </div>
      </motion.div>

      {/* Route Stops */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="font-black text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Route Stops</h3>
        <div className="relative pl-8">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full" style={{ backgroundColor: 'var(--card-border)' }} />
          {stops.map((stop, i) => (
            <div key={i} className="relative pb-5 last:pb-0">
              <div className={`absolute left-[-20px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                stop.status === 'passed' ? 'bg-green-500 border-green-500' :
                stop.status === 'current' ? 'border-blue-500 bg-blue-500' :
                'border-gray-300 dark:border-gray-600'
              }`} style={stop.status === 'upcoming' ? { backgroundColor: 'var(--card-bg)' } : {}}>
                {stop.status === 'passed' && <CheckCircle size={12} className="text-white" />}
                {stop.status === 'current' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                {stop.status === 'upcoming' && <Circle size={8} style={{ color: 'var(--muted-light)' }} />}
              </div>
              <div className="ml-3">
                <p className={`font-bold ${stop.status === 'upcoming' ? 'opacity-50' : ''}`} style={{ color: 'var(--foreground)' }}>{stop.name}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{stop.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Emergency Button */}
      <button className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 transition-colors">
        <AlertTriangle size={18} /> Report Emergency
      </button>
    </div>
  );
}
