'use client';

import { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2, MapPin, Star, Check } from 'lucide-react';
import axios from '@/lib/axios';

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels');
      setHotels(res.data);
    } catch {
      console.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const parseJSON = (str: string) => {
    try { return JSON.parse(str); } catch { return []; }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Partner Hotels</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage your hotel inventory and accommodations.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
          <Plus size={18} /> Add Hotel
        </button>
      </div>

      <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {loading ? (
          <div className="p-8 text-center font-bold">Loading Hotels...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>
                  <th className="p-4 font-bold">Hotel & Location</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Rating</th>
                  <th className="p-4 font-bold">Price / Night</th>
                  <th className="p-4 font-bold">Rooms</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--card-border)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                          <img src={parseJSON(hotel.images)[0] || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-black" style={{ color: 'var(--foreground)' }}>{hotel.name}</p>
                          <p className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                            <MapPin size={10} /> {hotel.city}, {hotel.state}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                        {hotel.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 font-black text-amber-500">
                        <Star size={14} fill="currentColor" /> {hotel.starRating}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-black" style={{ color: 'var(--foreground)' }}>₹{hotel.pricePerNight}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full" style={{ backgroundColor: 'var(--card-border)' }}>
                          <div className="h-2 rounded-full bg-green-500" style={{ width: `${(hotel.availableRooms / hotel.totalRooms) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold">{hotel.availableRooms}/{hotel.totalRooms}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--foreground)' }}>
                          <Edit size={16} />
                        </button>
                        <button className="p-2 rounded-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
