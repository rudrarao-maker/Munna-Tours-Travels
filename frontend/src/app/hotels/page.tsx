'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, Wifi, Waves, Utensils, Dumbbell, Sparkles, ChevronDown, Phone, Mail } from 'lucide-react';
import axios from '@/lib/axios';

interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  type: string;
  description: string;
  starRating: number;
  pricePerNight: number;
  amenities: string;
  images: string;
  contactPhone: string;
  contactEmail: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  totalRooms: number;
  availableRooms: number;
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi, 'Pool': Waves, 'Restaurant': Utensils, 'Gym': Dumbbell, 'Spa': Sparkles,
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get('/hotels');
      setHotels(res.data);
    } catch (err) {
      console.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = !search || hotel.name.toLowerCase().includes(search.toLowerCase()) || hotel.city.toLowerCase().includes(search.toLowerCase()) || hotel.state?.toLowerCase().includes(search.toLowerCase()) || hotel.location.toLowerCase().includes(search.toLowerCase());
    const matchesRating = hotel.starRating >= minRating;
    const matchesType = selectedType === 'All' || hotel.type === selectedType;
    const matchesState = selectedState === 'All' || hotel.state === selectedState;
    const matchesPrice = hotel.pricePerNight >= minPrice && hotel.pricePerNight <= maxPrice;
    return matchesSearch && matchesRating && matchesType && matchesState && matchesPrice;
  });

  // Get unique states and types from hotels
  const states = ['All', ...Array.from(new Set(hotels.map(h => h.state).filter(Boolean)))];
  const types = ['All', ...Array.from(new Set(hotels.map(h => h.type).filter(Boolean)))];

  const parseAmenities = (amenitiesStr: string): string[] => {
    try { return JSON.parse(amenitiesStr); } catch { return []; }
  };

  const parseImages = (imagesStr: string): string[] => {
    try { return JSON.parse(imagesStr); } catch { return []; }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}
          >
            Premium Hotels & Stays
          </motion.h1>
          <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            From budget-friendly hostels to luxury palaces — handpicked accommodations across India.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="p-3 rounded-3xl shadow-lg" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center px-4 py-2 rounded-2xl" style={{ backgroundColor: 'var(--input-bg)' }}>
                <Search className="mr-3 shrink-0" size={20} style={{ color: 'var(--muted-light)' }} />
                <input
                  type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search hotels by name or city..."
                  className="bg-transparent outline-none w-full font-semibold" style={{ color: 'var(--foreground)' }}
                />
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-colors"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                <Filter size={18} /> Filters <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-bold w-24" style={{ color: 'var(--muted)' }}>Min Rating:</span>
                  {[0, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${minRating === r ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: minRating === r ? 'var(--foreground)' : 'var(--section-alt)', color: minRating === r ? 'var(--background)' : 'var(--foreground)' }}>
                      {r === 0 ? 'All' : `${r}★+`}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-bold w-24" style={{ color: 'var(--muted)' }}>Property Type:</span>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                    {types.map(t => <option key={t as string} value={t as string}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-sm font-bold w-24" style={{ color: 'var(--muted)' }}>State:</span>
                  <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer"
                    style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                    {states.map(s => <option key={s as string} value={s as string}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-wrap gap-4 items-center w-full">
                  <span className="text-sm font-bold w-24 shrink-0" style={{ color: 'var(--muted)' }}>Price Range:</span>
                  <div className="flex items-center gap-2 flex-1 max-w-sm">
                    <input 
                      type="number" min="0" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-sm font-bold outline-none"
                      style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}
                      placeholder="Min ₹"
                    />
                    <span style={{ color: 'var(--muted)' }}>-</span>
                    <input 
                      type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-sm font-bold outline-none"
                      style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}
                      placeholder="Max ₹"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="font-bold" style={{ color: 'var(--muted)' }}>
            {loading ? 'Loading...' : `${filteredHotels.length} hotels found`}
          </p>
        </div>

        {/* Hotel Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-3xl h-[420px] animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel, i) => {
              const amenities = parseAmenities(hotel.amenities);
              const images = parseImages(hotel.images);
              return (
                <motion.div key={hotel.id}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                  
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl backdrop-blur-md text-sm font-black"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                      {'★'.repeat(hotel.starRating)}
                    </div>
                    <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl backdrop-blur-md text-sm font-bold"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#10b981' }}>
                      {hotel.availableRooms} rooms available
                    </div>
                  </div>

                  <div className="p-6 relative">
                    {hotel.type && (
                      <span className="absolute -top-3 left-6 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700 shadow-sm border border-blue-200">
                        {hotel.type}
                      </span>
                    )}
                    <div className="flex justify-between items-start mb-3 pt-2">
                      <h3 className="text-lg font-black leading-tight" style={{ color: 'var(--foreground)' }}>{hotel.name}</h3>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xl font-black" style={{ color: 'var(--foreground)' }}>₹{hotel.pricePerNight.toLocaleString()}</p>
                        <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>/night</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin size={14} style={{ color: 'var(--muted)' }} />
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{hotel.location}</p>
                    </div>

                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--muted)' }}>{hotel.description}</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {amenities.slice(0, 4).map(amenity => (
                        <span key={amenity} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                          {amenity}
                        </span>
                      ))}
                      {amenities.length > 4 && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>
                          +{amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Contact */}
                    <div className="flex gap-3">
                      {hotel.contactPhone && (
                        <a href={`tel:${hotel.contactPhone}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-90"
                          style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                          <Phone size={14} /> Call
                        </a>
                      )}
                      <a href={`mailto:${hotel.contactEmail}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                        <Mail size={14} /> Book Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredHotels.length === 0 && (
          <div className="text-center py-20">
            <MapPin size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--foreground)' }} />
            <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>No hotels found</h3>
            <p className="font-medium" style={{ color: 'var(--muted)' }}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
