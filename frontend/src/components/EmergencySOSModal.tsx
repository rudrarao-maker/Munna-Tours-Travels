'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, ShieldAlert, Navigation, X } from 'lucide-react';
import { useState } from 'react';

export default function EmergencySOSModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [sosSent, setSosSent] = useState(false);

  const handleSOS = () => {
    // In a real app, this would trigger an API call to the backend
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      onClose();
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-[2001] overflow-hidden border border-red-100 dark:border-red-900/30"
          >
            {/* Header */}
            <div className="bg-red-600 p-6 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Emergency SOS</h2>
                  <p className="text-red-100 text-sm font-medium">Help is just a tap away.</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {!sosSent ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <a href="tel:100" className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 transition">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <ShieldAlert size={24} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">Police</p>
                        <p className="text-xs text-gray-500">Call 100</p>
                      </div>
                    </a>

                    <a href="tel:108" className="flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 transition">
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <Phone size={24} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold">Ambulance</p>
                        <p className="text-xs text-gray-500">Call 108</p>
                      </div>
                    </a>
                  </div>

                  <a href="tel:18001234567" className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 p-4 rounded-2xl border border-gray-100 dark:border-zinc-700 transition w-full">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="font-bold">TripNova Support</p>
                      <p className="text-xs text-gray-500">24/7 Helpline</p>
                    </div>
                  </a>

                  <div className="pt-4 mt-4 border-t border-gray-100 dark:border-zinc-800">
                    <button 
                      onClick={handleSOS}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                      <Navigation size={20} />
                      Share Live Location with Admin
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                      This will immediately alert our command center with your live GPS location.
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Navigation size={48} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">SOS Alert Sent!</h3>
                  <p className="text-gray-500">Our command center has received your live location and is dispatching help immediately.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
