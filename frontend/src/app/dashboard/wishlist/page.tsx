'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const [items, setItems] = useState([
    { id: '1', type: 'package', title: 'Kerala Backwaters Retreat', location: 'Kerala, India', price: 15000, rating: 4.8, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400' },
    { id: '2', type: 'hotel', title: 'Taj Lake Palace', location: 'Udaipur, Rajasthan', price: 25000, rating: 5.0, image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8379?w=400' },
  ]);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">My Wishlist</h1>
        <p className="text-[var(--muted)] font-medium">Saved destinations and properties for your next trip.</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-[var(--card-bg)] rounded-3xl p-12 text-center border border-[var(--card-border)]">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">Your wishlist is empty</h2>
          <p className="text-[var(--muted)] mb-6">Start exploring and save your favorite places.</p>
          <Link href="/packages" className="inline-block px-6 py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl hover:opacity-90 transition">
            Explore Packages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl overflow-hidden group hover:shadow-xl transition-all relative"
            >
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="h-48 relative overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {item.type}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[var(--foreground)] text-lg line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-lg">
                    <Star size={14} className="fill-yellow-500 text-yellow-500" /> {item.rating}
                  </div>
                </div>
                
                <p className="text-[var(--muted)] text-sm flex items-center gap-1 mb-4 font-medium">
                  <MapPin size={14} /> {item.location}
                </p>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[var(--card-border)]">
                  <div>
                    <p className="text-xs text-[var(--muted)] font-bold uppercase tracking-wider">Starting from</p>
                    <p className="text-xl font-black text-[var(--foreground)]">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Link href={`/${item.type}s/${item.id}`} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-sm hover:opacity-90 transition">
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
