'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ArrowRight, Bus, Phone, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import RouteAutocomplete from '@/components/RouteAutocomplete';

type RouteData = {
  id: string;
  routeId: string;
  from: string;
  to: string;
  price: string;
  time: string;
  type: string;
  image: string;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Quote Form State
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    passengers: '1-5 Passengers',
    busType: 'Any Type',
    mealType: 'No Meals',
    phone: '',
    email: '',
    notes: '',
    contactName: 'Custom Client' // Dummy name since form doesn't have it
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get('/routes');
        setRoutes(res.data);
      } catch (error) {
        console.error('Failed to fetch routes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleCustomQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/quotes', formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        pickup: '', dropoff: '', date: '', passengers: '1-5 Passengers',
        busType: 'Any Type', mealType: 'No Meals',
        phone: '', email: '', notes: '', contactName: 'Custom Client'
      });
    } catch (error) {
      console.error('Failed to submit quote request', error);
      alert('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24" style={{ backgroundColor: 'var(--background)' }}>
      
      {/* Search Header */}
      <div className="py-16 relative overflow-hidden" style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: 'var(--foreground)' }}>Explore Our Routes</h1>
          
          <div className="p-4 rounded-3xl flex flex-col md:flex-row gap-4 max-w-5xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
               style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex-1 flex items-center p-2 rounded-2xl border border-transparent focus-within:border-black dark:focus-within:border-white transition-colors w-full z-20"
                 style={{ backgroundColor: 'var(--input-bg)' }}>
              <RouteAutocomplete placeholder="Leaving From (e.g. Ahmedabad)" />
            </div>
            <div className="flex-1 flex items-center p-2 rounded-2xl border border-transparent focus-within:border-black dark:focus-within:border-white transition-colors w-full z-10"
                 style={{ backgroundColor: 'var(--input-bg)' }}>
              <RouteAutocomplete placeholder="Going To (e.g. Pune)" />
            </div>
            <button className="bg-black text-white dark:bg-white dark:text-black px-10 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition flex items-center justify-center shadow-lg w-full md:w-auto shrink-0">
              <Search className="mr-2" size={22} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse rounded-3xl overflow-hidden h-96" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {routes.map((route, i) => (
                <motion.div 
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl overflow-hidden transition-all group flex flex-col hover:-translate-y-2"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="h-56 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${route.image}')` }} />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center border border-white/20">
                      <Clock size={14} className="mr-1.5" /> {route.time}
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-black flex items-center gap-2 mb-2" style={{ color: 'var(--foreground)' }}>
                          {route.from} <ArrowRight size={20} className="text-gray-400" /> {route.to}
                        </h3>
                        <span className="px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider"
                              style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>{route.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase mb-1 tracking-widest" style={{ color: 'var(--muted)' }}>Starting from</p>
                        <p className="text-2xl font-black text-green-600">{route.price}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 flex justify-between items-center" style={{ borderTop: '1px solid var(--card-border)' }}>
                      <span className="text-sm font-bold tracking-wide uppercase" style={{ color: 'var(--muted)' }}>Available on Demand</span>
                      <Link href={`/routes/${route.routeId}`} className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-black hover:opacity-90 transition text-sm shadow-md inline-block">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              {routes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--muted)' }}>No routes found</h3>
                  <p style={{ color: 'var(--muted-light)' }}>Please seed the database in the backend or add routes via the Admin Panel.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Customize Route Section */}
      <section className="py-24" style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--card-border)' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Customize Your Route</h2>
            <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Can't find a direct route? Need a private charter bus for your group? Submit your custom requirements below.</p>
          </div>
          
          <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
               style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
            {submitted && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center text-white p-8"
               >
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                   <ShieldCheck size={32} />
                 </div>
                 <h2 className="text-4xl font-black mb-4 tracking-tight">Quote Requested!</h2>
                 <p className="text-lg text-white/70 font-medium max-w-md text-center">
                   Our team has received your custom requirements and will contact you within 2 hours.
                 </p>
               </motion.div>
            )}

            <form className="space-y-8" onSubmit={handleCustomQuoteSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Pick-up City / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="text" value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} placeholder="Enter starting point" 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Drop-off City / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="text" value={formData.dropoff} onChange={e => setFormData({...formData, dropoff: e.target.value})} placeholder="Enter destination" 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Date of Journey</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Number of Passengers</label>
                  <select value={formData.passengers} onChange={e => setFormData({...formData, passengers: e.target.value})} 
                          className="w-full rounded-xl py-4 px-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition appearance-none" 
                          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                    <option>1-5 Passengers</option>
                    <option>6-15 Passengers (Minibus)</option>
                    <option>16-30 Passengers</option>
                    <option>30+ Passengers (Full Charter)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Preferred Bus Type</label>
                  <select value={formData.busType} onChange={e => setFormData({...formData, busType: e.target.value})} 
                          className="w-full rounded-xl py-4 px-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition appearance-none" 
                          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                    <option>Any Type</option>
                    <option>Volvo A/C Sleeper</option>
                    <option>A/C Semi-Sleeper</option>
                    <option>Non-A/C Seater</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Meal Type Preference</label>
                  <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})} 
                          className="w-full rounded-xl py-4 px-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition appearance-none" 
                          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                    <option>No Meals</option>
                    <option>Snacks & Beverages</option>
                    <option>Full Meals (Veg)</option>
                    <option>Full Meals (Non-Veg)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Contact Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-3 tracking-wider" style={{ color: 'var(--muted)' }}>Additional Requirements (Optional)</label>
                <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Tell us if you need multiple stops, return journey, special accommodations, etc." 
                          className="w-full rounded-xl py-4 px-4 font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition resize-none" 
                          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}></textarea>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between" style={{ borderTop: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-2 text-sm font-bold mb-6 sm:mb-0" style={{ color: 'var(--muted)' }}>
                  <ShieldCheck className="text-green-500" size={24} />
                  We will get back to you within 2 hours.
                </div>
                <button disabled={submitting} type="submit" className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black px-12 py-5 rounded-2xl font-black text-lg hover:opacity-90 transition shadow-lg disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Custom Request'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
