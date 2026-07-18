'use client';

import { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Star, Clock, Filter, Compass } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';



interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  category: string;
  images: string;
  rating: number;
}

export default function PackagesGallery() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get('/packages');
      setPackages(res.data);
    } catch (error) {
      console.error('Failed to fetch packages', error);
    } finally {
      setLoading(false);
    }
  };

  const parseImages = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'];
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header */}
      <section className="relative py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-black/10 dark:border-white/10 font-bold tracking-widest text-sm uppercase mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            Curated Experiences
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
            style={{ color: 'var(--foreground)' }}
          >
            Unforgettable <br /> Tour Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 font-medium max-w-2xl mx-auto"
            style={{ color: 'var(--muted)' }}
          >
            Explore expertly crafted itineraries that bundle travel, stays, and activities into one seamless adventure.
          </motion.p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="container mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>All Packages</h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-xl font-bold" style={{ borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-96 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, i) => {
                const images = parseImages(pkg.images);
                return (
                  <motion.div 
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-3xl overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={images[0]} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg backdrop-blur-md text-xs font-black uppercase tracking-wider text-white bg-black/60">
                        {pkg.category}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black line-clamp-2" style={{ color: 'var(--foreground)' }}>{pkg.title}</h3>
                        </div>
                        <p className="text-sm font-medium line-clamp-3 mb-6" style={{ color: 'var(--muted)' }}>
                          {pkg.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-8">
                          <span className="flex items-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                            <Clock size={16} className="mr-1 text-gray-500" /> {pkg.duration}
                          </span>
                          <span className="flex items-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                            <Compass size={16} className="mr-1 text-gray-500" /> {pkg.destination}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Starting From</p>
                          <p className="text-2xl font-black text-green-500">₹{pkg.price.toLocaleString()}</p>
                        </div>
                        <Link href={`/packages/${pkg.slug}`} className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
