'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Bus, Clock, AlertCircle, CheckCircle, Phone } from 'lucide-react';

export default function TrackingPage() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [eta, setEta] = useState('2 hrs 15 mins');
  const [status, setStatus] = useState('On Route');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if(ticketNumber.length > 3) {
      setIsTracking(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Live Bus Tracking</h1>
          <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>Enter your ticket PNR or registered phone number to track your journey in real-time.</p>
        </div>

        {/* Tracking Input Widget */}
        <div className="p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-2xl mx-auto mb-12"
             style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center px-4 py-2 rounded-2xl border border-transparent focus-within:border-black dark:focus-within:border-white transition-colors"
                 style={{ backgroundColor: 'var(--input-bg)' }}>
              <Navigation className="mr-3" size={24} style={{ color: 'var(--muted-light)' }} />
              <input 
                type="text" 
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Enter PNR or Phone Number" 
                className="bg-transparent outline-none w-full font-bold text-lg py-2" 
                style={{ color: 'var(--foreground)' }}
              />
            </div>
            <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-2xl font-black hover:opacity-90 transition flex items-center justify-center shrink-0">
              <Search className="mr-2" size={20} /> Track
            </button>
          </form>
        </div>

        {/* Tracking Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map Area */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden relative shadow-md min-h-[500px]"
               style={{ border: '1px solid var(--card-border)' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118106.70010221669!2d72.48489816174163!3d23.02049777123985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1709140000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', inset: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Overlay if not tracking */}
            {!isTracking && (
              <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center p-8 rounded-2xl border border-white/10" style={{ backgroundColor: 'var(--card-bg)' }}>
                  <MapPin size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--foreground)' }} />
                  <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Waiting for Input</h3>
                  <p className="font-medium" style={{ color: 'var(--muted)' }}>Enter your PNR to start live tracking on the map.</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl shadow-md border"
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Journey Status</h2>
              
              {isTracking ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: 'var(--section-alt)' }}>
                    <div className="flex items-center gap-3">
                      <Bus className="text-blue-500" size={24} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Current Status</p>
                        <p className="font-black text-lg text-blue-500">{status}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-2xl" style={{ backgroundColor: 'var(--section-alt)' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="text-green-500" size={24} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>Est. Time of Arrival</p>
                        <p className="font-black text-lg text-green-500">{eta}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-1 rounded-full" style={{ backgroundColor: 'var(--card-border)' }}></div>
                    
                    {/* Timeline items */}
                    <div className="relative pl-12 pb-8">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white border-4" style={{ borderColor: 'var(--card-bg)' }}>
                        <CheckCircle size={14} />
                      </div>
                      <h4 className="font-bold" style={{ color: 'var(--foreground)' }}>Departed Ahmedabad</h4>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>08:30 AM</p>
                    </div>

                    <div className="relative pl-12 pb-8">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'var(--card-bg)', backgroundColor: 'var(--foreground)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--background)' }} />
                      </div>
                      <h4 className="font-bold" style={{ color: 'var(--foreground)' }}>Approaching Vadodara</h4>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Current Location</p>
                    </div>

                    <div className="relative pl-12">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'var(--card-bg)', backgroundColor: 'var(--section-alt)' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--muted)' }} />
                      </div>
                      <h4 className="font-bold opacity-50" style={{ color: 'var(--foreground)' }}>Arrival at Surat</h4>
                      <p className="text-sm font-medium opacity-50" style={{ color: 'var(--muted)' }}>Est. 12:45 PM</p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--foreground)' }} />
                  <p className="font-medium" style={{ color: 'var(--muted)' }}>Tracking details will appear here once you enter a valid PNR.</p>
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition-colors border"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
                <Phone size={20} />
                Call Driver
              </button>
              <button className="p-4 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition-colors border"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
                <MapPin size={20} />
                Share ETA
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
