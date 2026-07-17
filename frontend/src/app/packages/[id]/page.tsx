'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Star, Users, Check, ArrowRight, Shield } from 'lucide-react';
import axios from '@/lib/axios';

export default function PackageDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const res = await axios.get(`/packages/${id}`);
      setPkg(res.data);
    } catch (error) {
      console.error(error);
      router.push('/packages');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    alert('Booking flow for Tour Packages will be integrated in the next sprint!');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-2xl">Loading...</div>;
  }

  if (!pkg) return null;

  const images = pkg.images ? JSON.parse(pkg.images) : [];
  const bgImage = images[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end pb-20 px-4" style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src={bgImage} alt={pkg.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-md text-white font-bold tracking-widest text-xs uppercase mb-4 border border-white/20">
              {pkg.category} Package
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter drop-shadow-lg">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 font-bold drop-shadow-md">
              <span className="flex items-center"><MapPin size={18} className="mr-2 text-white/70" /> {pkg.destination}</span>
              <span className="flex items-center"><Clock size={18} className="mr-2 text-white/70" /> {pkg.duration}</span>
              <span className="flex items-center text-yellow-400"><Star size={18} className="mr-2 fill-yellow-400" /> {pkg.rating} (Superb)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row gap-12">
          
          {/* Left Column */}
          <div className="flex-1 space-y-12">
            <div>
              <h2 className="text-3xl font-black mb-6" style={{ color: 'var(--foreground)' }}>About This Tour</h2>
              <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--muted)' }}>
                {pkg.description}
              </p>
            </div>

            {/* Inclusions */}
            <div className="p-8 rounded-3xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Premium Hotel Stays', 'Breakfast & Dinner', 'Private AC Transport', 'Guided Sightseeing', 'Airport Transfers', '24/7 Support'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold" style={{ color: 'var(--muted)' }}>
                    <div className="p-1 rounded-full bg-green-500/20 text-green-600">
                      <Check size={16} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Booking Card */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 p-8 rounded-3xl border shadow-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Price Per Person</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-5xl font-black text-green-500">₹{pkg.price.toLocaleString()}</h3>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Travel Date</label>
                  <div className="relative">
                    <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" className="w-full pl-12 pr-4 py-4 rounded-xl font-bold outline-none border focus:border-black dark:focus:border-white transition-colors" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Travelers</label>
                  <div className="relative">
                    <Users size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="w-full pl-12 pr-4 py-4 rounded-xl font-bold outline-none border focus:border-black dark:focus:border-white transition-colors appearance-none" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
                      <option>2 Adults, 0 Children</option>
                      <option>2 Adults, 1 Child</option>
                      <option>4 Adults, 0 Children</option>
                    </select>
                  </div>
                </div>
              </div>

              <button onClick={handleBooking} className="w-full bg-black text-white dark:bg-white dark:text-black py-5 rounded-2xl font-black text-lg hover:opacity-90 transition flex items-center justify-center gap-2 mb-4">
                Book This Tour <ArrowRight size={20} />
              </button>

              <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
                <Shield size={16} className="text-green-500" /> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
