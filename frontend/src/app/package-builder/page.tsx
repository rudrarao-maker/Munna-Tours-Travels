'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Bus, Building2, CheckCircle2, ChevronRight, ChevronLeft, CreditCard } from 'lucide-react';
import axios from '@/lib/axios';

export default function PackageBuilderPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data from APIs
  const [hotels, setHotels] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  // Selected package details
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [travelers, setTravelers] = useState(2);

  useEffect(() => {
    // Fetch options when component mounts
    const fetchData = async () => {
      try {
        const [hotelsRes, routesRes] = await Promise.all([
          axios.get('/hotels'),
          axios.get('/routes')
        ]);
        setHotels(hotelsRes.data);
        setRoutes(routesRes.data);
      } catch (error) {
        console.error('Failed to fetch data for package builder');
      }
    };
    fetchData();
  }, []);

  // Filter hotels based on destination if entered
  const availableHotels = destination 
    ? hotels.filter(h => h.city.toLowerCase().includes(destination.toLowerCase()) || h.state.toLowerCase().includes(destination.toLowerCase()))
    : hotels.slice(0, 10); // Show top 10 if no destination

  // Calculate prices
  const hotelPrice = selectedHotel ? selectedHotel.pricePerNight * 1 /* assuming 1 night for simplicity, or calc dates */ : 0;
  const transportPrice = selectedRoute ? parseInt(selectedRoute.price.replace(/[^0-9]/g, '')) * travelers : 0;
  const totalPrice = hotelPrice + transportPrice;
  const taxes = totalPrice * 0.18;
  const finalPrice = totalPrice + taxes;

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Custom Package Booked Successfully!');
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Custom Package Builder</h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Design your perfect getaway. Choose your destination, handpick your luxury stay, and select your premium transport.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-12 relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-zinc-800 -z-10 rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black dark:bg-white -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          
          {[
            { num: 1, icon: MapPin, label: 'Destination' },
            { num: 2, icon: Building2, label: 'Accommodation' },
            { num: 3, icon: Bus, label: 'Transport' },
            { num: 4, icon: CheckCircle2, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors ${step >= s.num ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/20' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                <s.icon size={20} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step >= s.num ? 'text-black dark:text-white' : 'text-gray-400 dark:text-zinc-500'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Builder Area */}
          <div className="flex-1">
            <div className="p-8 rounded-3xl border shadow-xl min-h-[500px]" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <AnimatePresence mode="wait">
                
                {/* Step 1: Destination & Dates */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Where do you want to go?</h2>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Destination</label>
                      <input 
                        type="text" value={destination} onChange={e => setDestination(e.target.value)}
                        placeholder="e.g. Udaipur, Goa, Manali"
                        className="w-full rounded-xl py-4 px-4 font-bold outline-none border focus:border-black dark:focus:border-white transition-colors"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Start Date</label>
                        <input type="date" value={dates.start} onChange={e => setDates({...dates, start: e.target.value})} className="w-full rounded-xl py-4 px-4 font-bold outline-none border focus:border-black dark:focus:border-white transition-colors" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>End Date</label>
                        <input type="date" value={dates.end} onChange={e => setDates({...dates, end: e.target.value})} className="w-full rounded-xl py-4 px-4 font-bold outline-none border focus:border-black dark:focus:border-white transition-colors" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Number of Travelers</label>
                      <input type="number" min="1" value={travelers} onChange={e => setTravelers(parseInt(e.target.value))} className="w-full rounded-xl py-4 px-4 font-bold outline-none border focus:border-black dark:focus:border-white transition-colors" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }} />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Accommodation */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Choose your stay</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      {availableHotels.map(hotel => (
                        <div key={hotel.id} onClick={() => setSelectedHotel(hotel)} 
                             className={`p-4 rounded-2xl border cursor-pointer transition-all ${selectedHotel?.id === hotel.id ? 'border-black dark:border-white ring-2 ring-black dark:ring-white bg-black/5 dark:bg-white/5' : 'hover:border-black/50 dark:hover:border-white/50'}`}
                             style={{ borderColor: selectedHotel?.id === hotel.id ? undefined : 'var(--card-border)' }}>
                          <img src={JSON.parse(hotel.images)[0] || 'https://via.placeholder.com/150'} alt={hotel.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                          <h3 className="font-black truncate" style={{ color: 'var(--foreground)' }}>{hotel.name}</h3>
                          <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)' }}>{hotel.type} • {'★'.repeat(hotel.starRating)}</p>
                          <p className="font-black text-lg" style={{ color: 'var(--foreground)' }}>₹{hotel.pricePerNight.toLocaleString()}<span className="text-xs font-medium text-gray-400">/night</span></p>
                        </div>
                      ))}
                      {availableHotels.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500 font-medium">
                          No hotels found in {destination}. Try clearing the destination.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Transport */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>How will you get there?</h2>
                    <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                      {routes.slice(0, 10).map(route => (
                        <div key={route.id} onClick={() => setSelectedRoute(route)} 
                             className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${selectedRoute?.id === route.id ? 'border-black dark:border-white ring-2 ring-black dark:ring-white bg-black/5 dark:bg-white/5' : 'hover:border-black/50 dark:hover:border-white/50'}`}
                             style={{ borderColor: selectedRoute?.id === route.id ? undefined : 'var(--card-border)' }}>
                          <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                            <Bus size={24} style={{ color: 'var(--foreground)' }} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-black text-lg" style={{ color: 'var(--foreground)' }}>{route.from} to {route.to}</h3>
                            <p className="text-sm font-bold" style={{ color: 'var(--muted)' }}>{route.type} • {route.time}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xl" style={{ color: 'var(--foreground)' }}>{route.price}</p>
                            <p className="text-xs font-medium text-gray-400">per seat</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}><CheckCircle2 className="text-green-500" /> Review Your Custom Package</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                        <h4 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Trip Details</h4>
                        <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{destination || 'Mystery Destination'}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{dates.start} to {dates.end} • {travelers} Travelers</p>
                      </div>

                      <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                        <h4 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Accommodation</h4>
                        <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{selectedHotel?.name || 'Not Selected'}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{selectedHotel ? `₹${selectedHotel.pricePerNight.toLocaleString()}/night` : '-'}</p>
                      </div>

                      <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                        <h4 className="text-xs font-black uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Transportation</h4>
                        <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{selectedRoute ? `${selectedRoute.from} to ${selectedRoute.to}` : 'Not Selected'}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{selectedRoute ? `${selectedRoute.price} x ${travelers} seats` : '-'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <button onClick={prevStep} disabled={step === 1} className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-30 transition-all hover:bg-gray-100 dark:hover:bg-zinc-800" style={{ color: 'var(--foreground)' }}>
                  <ChevronLeft size={20} /> Back
                </button>
                {step < 4 ? (
                  <button onClick={nextStep} className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl font-black flex items-center gap-2 hover:opacity-90 shadow-lg transition-all">
                    Next Step <ChevronRight size={20} />
                  </button>
                ) : (
                  <button onClick={handleBooking} disabled={loading} className="px-8 py-3 bg-green-500 text-white rounded-xl font-black flex items-center gap-2 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all disabled:opacity-50">
                    {loading ? 'Processing...' : <><CreditCard size={20} /> Pay & Book Now</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Sidebar */}
          <div className="w-full lg:w-80">
            <div className="p-6 rounded-3xl border shadow-lg sticky top-32 text-gray-900 dark:text-white bg-white dark:bg-zinc-900" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-black mb-6 border-b pb-4 border-gray-100 dark:border-zinc-800">Package Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Hotel ({travelers} pax)</span>
                  <span>₹{hotelPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Transport ({travelers} seats)</span>
                  <span>₹{transportPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Taxes & Fees (18%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-gray-500 dark:text-gray-400">Total Price</span>
                  <span className="text-3xl font-black">₹{finalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs font-bold text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Best price guaranteed</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
