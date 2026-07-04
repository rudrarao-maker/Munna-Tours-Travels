'use client';

import { useState, useEffect } from 'react';
import { Bus, MapPin, Navigation2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackingPage() {
  const [progress, setProgress] = useState(0);

  // Simulate bus movement
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Trip Tracking</h1>
          <p className="text-gray-600">Tracking Trip ID: #MN-847291 (Mumbai to Goa)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          {/* Mock Map Area */}
          <div className="relative h-[400px] bg-blue-50 w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop" 
              alt="Map Background" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* The Route Line */}
            <div className="absolute top-1/2 left-1/4 right-1/4 h-2 bg-blue-200 rounded-full shadow-inner transform -translate-y-1/2" />
            
            {/* The Bus (Moving) */}
            <motion.div 
              className="absolute top-1/2 transform -translate-y-1/2 -ml-6"
              style={{ left: `calc(25% + ${progress * 0.5}%)` }} // Moves from 25% to 75%
            >
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-blue-600 z-20 relative">
                  <Bus className="text-blue-600" size={24} />
                </div>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-3 rounded whitespace-nowrap shadow-lg">
                  65 km/h
                </div>
              </div>
            </motion.div>

            {/* Start and End Markers */}
            <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 -ml-4 z-10">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="text-white" size={16} />
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-sm font-bold bg-white px-2 py-1 rounded shadow">Mumbai</div>
            </div>

            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 mr-4 z-10">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="text-white" size={16} />
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-sm font-bold bg-white px-2 py-1 rounded shadow">Goa</div>
            </div>
          </div>

          {/* Status Panel */}
          <div className="p-6 bg-white border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Navigation2 />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next Stop</p>
                  <p className="font-bold text-gray-900">Pune Toll Plaza</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 border-l pl-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  <Clock />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Arrival</p>
                  <p className="font-bold text-gray-900">08:45 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l pl-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Distance Remaining</p>
                  <p className="font-bold text-gray-900">324 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
