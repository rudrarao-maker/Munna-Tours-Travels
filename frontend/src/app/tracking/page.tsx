'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MapPin, Bus, AlertCircle, Clock, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Leaflet requires window to be defined, so we dynamically import the Map components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// We need to fix the default Leaflet marker icons in Next.js
const getBusIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `<div style="background-color: black; border-radius: 50%; padding: 8px; border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
  }
  return null;
};

export default function LiveTracking() {
  const [position, setPosition] = useState<[number, number]>([19.0760, 72.8777]); // Default Mumbai
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate real-time GPS updates from a moving bus
    // Moving slowly from Mumbai towards Pune
    let lat = 19.0760;
    let lng = 72.8777;

    const interval = setInterval(() => {
      lat -= 0.0005; // Move South
      lng += 0.0006; // Move East
      setPosition([lat, lng]);
      setLoading(false);
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header */}
      <section className="pt-16 pb-12 px-4" style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-1.5 rounded-full font-bold text-sm tracking-wider uppercase mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2" style={{ color: 'var(--foreground)' }}>
                Vehicle Tracking
              </h1>
              <p className="font-medium text-lg" style={{ color: 'var(--muted)' }}>
                Tracking Bus #MH04-AB-1234 (Mumbai - Pune)
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white dark:bg-gray-800 border rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]" style={{ borderColor: 'var(--card-border)' }}>
                <Clock className="text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">ETA</p>
                <p className="text-xl font-black" style={{ color: 'var(--foreground)' }}>2h 15m</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]" style={{ borderColor: 'var(--card-border)' }}>
                <MapPin className="text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Distance</p>
                <p className="text-xl font-black" style={{ color: 'var(--foreground)' }}>84 km</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1 relative z-0">
        {typeof window !== 'undefined' && !loading && (
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ width: '100%', height: 'calc(100vh - 250px)' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {getBusIcon() && (
              <Marker position={position} icon={getBusIcon()!}>
                <Popup>
                  <div className="text-center font-bold">
                    <p className="text-sm">TripNova Volvo</p>
                    <p className="text-xs text-green-600">Speed: 62 km/h</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}

        {/* Floating Actions overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border rounded-2xl p-2 flex items-center gap-2 shadow-2xl" style={{ borderColor: 'var(--card-border)' }}>
            <button className="px-6 py-3 rounded-xl font-bold bg-black text-white dark:bg-white dark:text-black flex items-center gap-2 transition hover:opacity-90">
              <Info size={18} /> View Route Details
            </button>
            <button className="px-4 py-3 rounded-xl font-bold text-red-500 bg-red-50 dark:bg-red-950/30 flex items-center gap-2 transition hover:bg-red-100">
              <AlertCircle size={18} /> Emergency / SOS
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
