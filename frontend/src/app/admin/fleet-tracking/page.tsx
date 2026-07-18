'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Navigation, Bus, AlertTriangle, Phone } from 'lucide-react';
import axios from '@/lib/axios';
import { getSocket } from '@/lib/socket';

export default function FleetTrackingPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();

    const socket = getSocket();
    socket.emit('track-fleet');

    socket.on('vehicle-position', (data: any) => {
      setVehicles(prev => {
        const existing = prev.find(v => v.driver?.id === data.driverId);
        if (existing) {
          return prev.map(v => v.driver?.id === data.driverId ? { ...v, location: data } : v);
        }
        // If not existing, we would ideally fetch the driver/vehicle info, but for now we just append
        return [...prev, { driver: { id: data.driverId, name: 'Driver' }, location: data }];
      });
    });

    return () => {
      socket.off('vehicle-position');
    };
  }, []);

  const fetchLocations = async () => {
    try {
      // Mock data for UI scaffolding if backend doesn't exist
      setVehicles([
        { driver: { id: 'd1', name: 'Ramesh Kumar', phone: '+919876543210' }, vehicle: { registration: 'GJ01-AB-1234', name: 'Volvo Sleeper' }, location: { speed: 65, heading: 45, latitude: 23.0225, longitude: 72.5714 } },
        { driver: { id: 'd2', name: 'Suresh Patel', phone: '+918765432109' }, vehicle: { registration: 'GJ02-XY-9876', name: 'Scania Semi-Sleeper' }, location: { speed: 72, heading: 120, latitude: 19.0760, longitude: 72.8777 } }
      ]);
      // In real implementation:
      // const res = await axios.get('/tracking/fleet');
      // setVehicles(res.data);
    } catch {
      console.error('Failed to fetch fleet locations');
    } finally {
      setLoading(false);
    }
  };

  const activeCount = vehicles.length;

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Live Fleet Tracking</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Real-time GPS tracking of all active vehicles.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-bold" style={{ color: 'var(--foreground)' }}>{activeCount} Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Map Area */}
        <div className="flex-1 rounded-3xl overflow-hidden relative" style={{ border: '1px solid var(--card-border)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3688175.7610486047!2d70.0!3d22.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad!3d23.0225!4d72.5714!4m5!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai!3d19.076!4d72.8777!5e0!3m2!1sen!2sin"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
          />
          
          {/* Simulated Map Markers overlay for demo UI */}
          {vehicles.map((v, i) => (
            <div key={i} className="absolute w-8 h-8 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                 style={{ 
                   top: `${20 + (i * 20)}%`, left: `${30 + (i * 15)}%`, // Mock positions based on index
                   transform: `rotate(${v.location?.heading || 0}deg)`
                 }}
                 onClick={() => setSelectedVehicle(v.driver?.id)}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${selectedVehicle === v.driver?.id ? 'bg-blue-600 text-white border-white scale-125' : 'bg-black text-white dark:bg-white dark:text-black border-transparent'}`}>
                <Navigation size={14} fill="currentColor" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar List */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
          {loading ? (
            <div className="h-24 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />
          ) : (
            vehicles.map((vehicle, i) => {
              const isSelected = selectedVehicle === vehicle.driver?.id;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedVehicle(vehicle.driver?.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'scale-105 shadow-md' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                  style={{ 
                    backgroundColor: isSelected ? 'var(--card-bg)' : 'transparent',
                    borderColor: isSelected ? 'var(--card-border)' : 'transparent'
                  }}>
                  
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-black text-sm" style={{ color: 'var(--foreground)' }}>{vehicle.vehicle?.registration || 'Unknown'}</p>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-green-100 text-green-700">En Route</span>
                  </div>
                  
                  <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                    <Bus size={12} /> {vehicle.vehicle?.name || 'Bus'}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg flex flex-col" style={{ backgroundColor: 'var(--section-alt)' }}>
                      <span className="font-bold mb-0.5 opacity-60">Speed</span>
                      <span className="font-black text-blue-600 dark:text-blue-400 text-sm">{vehicle.location?.speed || 0} km/h</span>
                    </div>
                    <div className="p-2 rounded-lg flex flex-col" style={{ backgroundColor: 'var(--section-alt)' }}>
                      <span className="font-bold mb-0.5 opacity-60">Driver</span>
                      <span className="font-black text-sm truncate">{vehicle.driver?.name}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 pt-3 border-t flex gap-2" style={{ borderColor: 'var(--card-border)' }}>
                      <a href={`tel:${vehicle.driver?.phone}`} className="flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">
                        <Phone size={12} /> Call Driver
                      </a>
                      <button className="flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                        <AlertTriangle size={12} /> Alert
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
