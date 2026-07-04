'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, ArrowRight, Bus, Phone, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';

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
    <div className="flex flex-col bg-gray-50 min-h-screen pt-24">
      
      {/* Search Header */}
      <div className="bg-black text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-black mb-6">Explore Our Routes</h1>
          
          <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-4xl shadow-xl">
            <div className="flex-1 flex items-center bg-gray-100 p-4 rounded-xl">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input type="text" placeholder="Leaving From" className="bg-transparent outline-none w-full font-bold text-black" />
            </div>
            <div className="flex-1 flex items-center bg-gray-100 p-4 rounded-xl">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input type="text" placeholder="Going To" className="bg-transparent outline-none w-full font-bold text-black" />
            </div>
            <button className="bg-black text-white px-8 py-4 rounded-xl font-black hover:bg-gray-800 transition flex items-center justify-center shrink-0">
              <Search className="mr-2" size={20} /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {loading ? (
            <div className="text-center text-gray-500 font-bold py-12">Loading routes from database...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {routes.map((route, i) => (
                <motion.div 
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col"
                >
                  <div className="h-56 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${route.image}')` }} />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center border border-white/20">
                      <Clock size={14} className="mr-1.5" /> {route.time}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-black flex items-center gap-2 mb-1">
                          {route.from} <ArrowRight size={20} className="text-gray-400" /> {route.to}
                        </h3>
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{route.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs font-bold uppercase mb-0.5">Starting from</p>
                        <p className="text-xl font-black text-green-600">{route.price}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Available on Demand</span>
                      <Link href={`/routes/${route.routeId}`} className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition text-sm shadow-md inline-block">
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
              {routes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-bold text-gray-500 mb-4">No routes found</h3>
                  <p className="text-gray-400">Please seed the database in the backend or add routes via the Admin Panel.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Customize Route Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Customize Your Route</h2>
            <p className="text-xl text-gray-500 font-medium">Can't find a direct route? Need a private charter bus for your group? Submit your custom requirements below.</p>
          </div>
          
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
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

            <form className="space-y-6" onSubmit={handleCustomQuoteSubmit}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Pick-up City / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="text" value={formData.pickup} onChange={e => setFormData({...formData, pickup: e.target.value})} placeholder="Enter starting point" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Drop-off City / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="text" value={formData.dropoff} onChange={e => setFormData({...formData, dropoff: e.target.value})} placeholder="Enter destination" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Date of Journey</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Number of Passengers</label>
                  <select value={formData.passengers} onChange={e => setFormData({...formData, passengers: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                    <option>1-5 Passengers</option>
                    <option>6-15 Passengers (Minibus)</option>
                    <option>16-30 Passengers</option>
                    <option>30+ Passengers (Full Charter)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Preferred Bus Type</label>
                  <select value={formData.busType} onChange={e => setFormData({...formData, busType: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                    <option>Any Type</option>
                    <option>Volvo A/C Sleeper</option>
                    <option>A/C Semi-Sleeper</option>
                    <option>Non-A/C Seater</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Meal Type Preference</label>
                  <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                    <option>No Meals</option>
                    <option>Snacks & Beverages</option>
                    <option>Full Meals (Veg)</option>
                    <option>Full Meals (Non-Veg)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Contact Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Additional Requirements (Optional)</label>
                <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Tell us if you need multiple stops, return journey, special accommodations, etc." className="w-full bg-white border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition resize-none"></textarea>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <ShieldCheck className="text-green-500" size={20} />
                  We will get back to you within 2 hours.
                </div>
                <button disabled={submitting} type="submit" className="bg-black text-white px-10 py-4 rounded-xl font-black hover:bg-gray-800 transition flex items-center shadow-lg disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Custom Route Request'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
