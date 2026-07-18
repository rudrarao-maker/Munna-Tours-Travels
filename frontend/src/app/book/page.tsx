'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bus, Utensils, Building2, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export default function BookPage() {
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Data
  const [routes, setRoutes] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);

  // Selections
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [nights, setNights] = useState(1);

  // Constants
  const vehicles = [
    { id: 'car', name: 'Private Car (Sedan)', priceAddon: 2000, icon: '🚗' },
    { id: 'innova', name: 'SUV (Innova)', priceAddon: 4000, icon: '🚙' },
    { id: 'volvo', name: 'Volvo A/C Sleeper', priceAddon: 1500, icon: '🚌' },
    { id: 'train', name: 'Premium Train', priceAddon: 3000, icon: '🚆' },
    { id: 'plane', name: 'Domestic Flight', priceAddon: 8000, icon: '✈️' },
  ];

  const meals = [
    { id: 'none', name: 'No Meals', priceAddon: 0, icon: '❌' },
    { id: 'breakfast', name: 'Breakfast Only', priceAddon: 300, icon: '🥐' },
    { id: 'half-board', name: 'Half Board (2 Meals)', priceAddon: 800, icon: '🍲' },
    { id: 'full-board', name: 'Full Board (All Meals)', priceAddon: 1500, icon: '🍱' },
  ];

  useEffect(() => {
    fetchRoutes();
    fetchHotels();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get('/routes');
      setRoutes(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels');
      setHotels(res.data);
    } catch (e) { console.error(e); }
  };

  const calculateTotal = () => {
    const basePrice = selectedRoute ? parseFloat(selectedRoute.price.replace(/[^0-9.-]+/g, "")) : 0;
    const vehiclePrice = selectedVehicle ? selectedVehicle.priceAddon : 0;
    const mealPrice = selectedMeal ? selectedMeal.priceAddon * passengers * (nights || 1) : 0;
    const hotelPrice = selectedHotel ? selectedHotel.pricePerNight * nights : 0;
    
    const subtotal = basePrice + vehiclePrice + mealPrice + hotelPrice;
    const taxes = subtotal * 0.18; // 18% GST
    
    return {
      basePrice, vehiclePrice, mealPrice, hotelPrice, subtotal, taxes, totalPrice: subtotal + taxes
    };
  };

  const handleBooking = async () => {
    if (!user) return alert('Please login to book.');
    setLoading(true);
    const pricing = calculateTotal();
    
    try {
      await axios.post('/bookings', {
        routeId: selectedRoute.id,
        date,
        passengers,
        userId: user.id,
        userEmail: user.email,
        vehicleType: selectedVehicle?.name || 'Standard Bus',
        mealPlan: selectedMeal?.name || 'No Meals',
        hotelId: selectedHotel?.id || null,
        basePrice: pricing.basePrice,
        vehiclePrice: pricing.vehiclePrice,
        mealPrice: pricing.mealPrice,
        hotelPrice: pricing.hotelPrice,
        taxes: pricing.taxes,
        totalPrice: pricing.totalPrice,
        seats: selectedSeats,
      });
      setSuccess(true);
    } catch (e) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { num: 1, title: 'Route', icon: MapPin },
    { num: 2, title: 'Vehicle', icon: Bus },
    { num: 3, title: 'Seats', icon: CheckCircle2 },
    { num: 4, title: 'Meals', icon: Utensils },
    { num: 5, title: 'Hotel', icon: Building2 },
    { num: 6, title: 'Checkout', icon: CreditCard },
  ];

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-black p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-4 border border-gray-200 dark:border-zinc-800">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4">Booking Confirmed!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Your trip has been successfully built and booked. An E-Ticket and Invoice have been sent to your email.</p>
          <button onClick={() => window.location.href = '/customer/my-bookings'} className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl font-bold">
            View My Bookings
          </button>
        </motion.div>
      </div>
    );
  }

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Build Your Trip</h1>
          <p className="text-lg font-medium text-gray-500">Customise every aspect of your journey.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 flex justify-between items-center relative max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 dark:bg-zinc-800 -z-10 rounded-full" />
          <div className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-600 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / 5) * 100}%` }} />
          
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all shadow-md ${
                step >= s.num ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 border-2 border-gray-200 dark:bg-zinc-900 dark:border-zinc-800'
              }`}>
                <s.icon size={20} />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-blue-600' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-zinc-800 min-h-[500px]">
              
              {/* STEP 1: ROUTE */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-6">Select a Route</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Journey Date</label>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Passengers</label>
                      <input type="number" min="1" value={passengers} onChange={e => setPassengers(parseInt(e.target.value))} className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {routes.map(r => (
                      <div key={r.id} onClick={() => setSelectedRoute(r)}
                           className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${
                             selectedRoute?.id === r.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                           }`}>
                        <div className="flex items-center gap-4">
                          <img src={r.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-lg">{r.from} <ArrowRight size={14} className="inline mx-1 text-gray-400" /> {r.to}</h4>
                            <p className="text-sm text-gray-500">{r.time} • Base Price: <span className="font-bold text-green-600">{r.price}</span></p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedRoute?.id === r.id ? 'border-blue-600' : 'border-gray-300'}`}>
                          {selectedRoute?.id === r.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: VEHICLE */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-6">Select Transport Mode</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map(v => (
                      <div key={v.id} onClick={() => setSelectedVehicle(v)}
                           className={`p-6 rounded-2xl cursor-pointer border-2 transition-all text-center ${
                             selectedVehicle?.id === v.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                           }`}>
                        <div className="text-4xl mb-3">{v.icon}</div>
                        <h4 className="font-bold text-lg mb-1">{v.name}</h4>
                        <p className="text-sm text-green-600 font-bold">+₹{v.priceAddon}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SEATS */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-2">Select Your Seats</h2>
                  <p className="text-gray-500 mb-6 text-sm">Please select {passengers} seat(s).</p>
                  
                  <div className="max-w-md mx-auto bg-gray-50 dark:bg-zinc-800 p-8 rounded-3xl border border-gray-200 dark:border-zinc-700">
                    <div className="w-full flex justify-center mb-8">
                      <div className="w-32 h-10 border-4 border-gray-300 dark:border-zinc-600 rounded-t-full rounded-b-xl flex items-center justify-center text-xs font-bold text-gray-400">FRONT</div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-y-4 gap-x-2">
                      {Array.from({ length: 40 }).map((_, i) => {
                        const row = Math.floor(i / 4);
                        const col = i % 4;
                        // Map 0,1,2,3 to visual columns 0, 1, (aisle), 3, 4
                        const gridCol = col < 2 ? col + 1 : col + 2; 
                        const seatNum = `${row + 1}${['A','B','C','D'][col]}`;
                        const isSelected = selectedSeats.includes(seatNum);
                        
                        return (
                          <div 
                            key={seatNum} 
                            style={{ gridColumn: gridCol }}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
                              } else {
                                if (selectedSeats.length < passengers) {
                                  setSelectedSeats([...selectedSeats, seatNum]);
                                } else {
                                  alert(`You can only select ${passengers} seat(s) based on your passenger count.`);
                                }
                              }
                            }}
                            className={`h-12 rounded-t-xl rounded-b flex items-center justify-center text-xs font-bold cursor-pointer transition-all border-2 ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:border-blue-400'
                            }`}
                          >
                            {seatNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-6 text-sm font-bold text-gray-500">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div> Available</div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-600 border-2 border-blue-700 rounded"></div> Selected</div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: MEALS */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-6">Select Meal Plan</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {meals.map(m => (
                      <div key={m.id} onClick={() => setSelectedMeal(m)}
                           className={`p-6 rounded-2xl cursor-pointer border-2 transition-all text-center ${
                             selectedMeal?.id === m.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                           }`}>
                        <div className="text-4xl mb-3">{m.icon}</div>
                        <h4 className="font-bold text-lg mb-1">{m.name}</h4>
                        <p className="text-sm text-green-600 font-bold">+₹{m.priceAddon} /person/day</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 5: HOTEL */}
              {step === 5 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-2">Select Accommodation</h2>
                  <p className="text-gray-500 mb-6 text-sm">Optional. You can skip this if you don't need a stay.</p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-500 mb-2">Number of Nights</label>
                    <input type="number" min="1" value={nights} onChange={e => setNights(parseInt(e.target.value))} className="w-full max-w-[200px] p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 outline-none" />
                  </div>

                  <div className="space-y-4">
                    <div onClick={() => setSelectedHotel(null)}
                         className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${
                           selectedHotel === null ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                         }`}>
                      <h4 className="font-bold">No Accommodation Needed</h4>
                    </div>

                    {hotels.map(h => (
                      <div key={h.id} onClick={() => setSelectedHotel(h)}
                           className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-center justify-between ${
                             selectedHotel?.id === h.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300'
                           }`}>
                        <div className="flex items-center gap-4">
                          <img src={JSON.parse(h.images)[0] || ''} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-lg">{h.name} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-2 uppercase">{h.type}</span></h4>
                            <p className="text-sm text-gray-500">{h.city}, {h.state} • <span className="font-bold text-green-600">₹{h.pricePerNight}/night</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 6: CHECKOUT */}
              {step === 6 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-black mb-6">Review & Pay</h2>
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 mb-6">
                    <h4 className="font-bold text-lg mb-4">Journey Details</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3"><MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" /> <b>Route:</b> {selectedRoute?.from} to {selectedRoute?.to}</li>
                      <li className="flex items-start gap-3"><Bus size={18} className="text-gray-400 shrink-0 mt-0.5" /> <b>Vehicle:</b> {selectedVehicle?.name}</li>
                      <li className="flex items-start gap-3"><Utensils size={18} className="text-gray-400 shrink-0 mt-0.5" /> <b>Meals:</b> {selectedMeal?.name}</li>
                      <li className="flex items-start gap-3"><Building2 size={18} className="text-gray-400 shrink-0 mt-0.5" /> <b>Stay:</b> {selectedHotel ? `${selectedHotel.name} (${nights} nights)` : 'None'}</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-between">
                {step > 1 ? (
                  <button onClick={prevStep} className="px-6 py-3 rounded-xl font-bold border-2 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">Back</button>
                ) : <div />}
                
                {step < 6 ? (
                  <button onClick={nextStep} 
                          disabled={
                            (step === 1 && (!selectedRoute || !date)) ||
                            (step === 3 && selectedSeats.length !== passengers)
                          }
                          className="px-8 py-3 rounded-xl font-bold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition disabled:opacity-50">
                    Next Step
                  </button>
                ) : (
                  <button onClick={handleBooking} disabled={loading}
                          className="px-10 py-3 rounded-xl font-black text-lg bg-green-600 text-white hover:bg-green-700 shadow-[0_0_20px_rgba(22,163,74,0.4)] transition">
                    {loading ? 'Processing...' : `Pay ₹${pricing.totalPrice.toLocaleString()}`}
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800">
              <h3 className="font-black text-xl mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Route Base Price</span>
                  <span className="font-bold">₹{pricing.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle Type</span>
                  <span className="font-bold">+ ₹{pricing.vehiclePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Seats ({selectedSeats.length})</span>
                  <span className="font-bold text-gray-500">{selectedSeats.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Meals ({passengers} pax)</span>
                  <span className="font-bold">+ ₹{pricing.mealPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hotel ({nights} nights)</span>
                  <span className="font-bold">+ ₹{pricing.hotelPrice.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between font-bold">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                  <span>Taxes (18% GST)</span>
                  <span className="font-bold">+ ₹{pricing.taxes.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-200 dark:border-zinc-700">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="text-3xl font-black text-green-600">₹{pricing.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
