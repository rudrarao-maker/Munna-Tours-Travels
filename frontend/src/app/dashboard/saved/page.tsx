'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export default function SavedWishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get('/wishlist');
      setWishlist(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (id: string, itemType: string, itemId: string) => {
    try {
      await axios.post('/wishlist/toggle', {
        itemType,
        ...(itemType === 'route' ? { routeId: itemId } : { hotelId: itemId })
      });
      setWishlist(wishlist.filter(w => w.id !== id));
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>My Wishlist</h1>
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Routes and hotels you have saved for later.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="p-12 text-center border rounded-3xl" style={{ borderColor: 'var(--card-border)' }}>
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Explore our routes and hotels and save your favorites!</p>
          <div className="flex justify-center gap-4">
            <Link href="/routes" className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold">Explore Routes</Link>
            <Link href="/hotels" className="border border-black dark:border-white px-6 py-3 rounded-xl font-bold">Explore Hotels</Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, i) => {
            const data = item.itemType === 'route' ? item.route : item.hotel;
            if (!data) return null;
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl overflow-hidden border group relative"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
              >
                <button 
                  onClick={() => removeWishlist(item.id, item.itemType, data.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-red-500/20 text-white transition-colors"
                >
                  <Heart size={20} className="fill-red-500 text-red-500" />
                </button>
                
                <div className="h-48 relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${item.itemType === 'route' ? data.image : JSON.parse(data.images)[0]}')` }} 
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider">
                    {item.itemType}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-black mb-2 line-clamp-1">
                    {item.itemType === 'route' ? `${data.from} to ${data.to}` : data.name}
                  </h3>
                  <div className="text-sm font-bold text-gray-500 mb-4">
                    {item.itemType === 'route' ? data.time : data.city}
                  </div>
                  <Link 
                    href={item.itemType === 'route' ? `/routes/${data.routeId}` : `/hotels/${data.id}`}
                    className="flex items-center justify-between font-bold text-blue-500 hover:text-blue-600"
                  >
                    View Details <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
