'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import Link from 'next/link';

type RouteData = {
  id: string;
  routeId: string;
  from: string;
  to: string;
  price: string;
  time: string;
};

// Hardcoded for demo if API fails, ideally fetched from backend
const mockRoutes: RouteData[] = [
  { id: '1', routeId: 'ahmedabad-mumbai', from: 'Ahmedabad', to: 'Mumbai', price: '₹900', time: '8 hrs 30 mins' },
  { id: '2', routeId: 'ahmedabad-pune', from: 'Ahmedabad', to: 'Pune', price: '₹1200', time: '11 hrs 45 mins' },
  { id: '3', routeId: 'ahmedabad-udaipur', from: 'Ahmedabad', to: 'Udaipur', price: '₹550', time: '5 hrs 15 mins' },
  { id: '4', routeId: 'ahmedabad-jaipur', from: 'Ahmedabad', to: 'Jaipur', price: '₹850', time: '10 hrs 30 mins' },
  { id: '5', routeId: 'ahmedabad-jodhpur', from: 'Ahmedabad', to: 'Jodhpur', price: '₹750', time: '8 hrs 45 mins' },
];

export default function RouteAutocomplete({ placeholder }: { placeholder: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RouteData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 1) {
      const filtered = mockRoutes.filter(route => 
        route.from.toLowerCase().includes(val.toLowerCase()) || 
        route.to.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex items-center w-full">
        <MapPin className="mr-3 shrink-0" size={24} style={{ color: 'var(--muted-light)' }} />
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          onFocus={() => { if(query.length > 1) setIsOpen(true); }}
          placeholder={placeholder} 
          className="bg-transparent outline-none w-full font-bold text-lg placeholder-gray-400 dark:placeholder-gray-500" 
          style={{ color: 'var(--foreground)' }} 
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto"
             style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {results.map((route) => (
            <Link 
              key={route.id} 
              href={`/routes/${route.routeId}`}
              className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors border-b last:border-b-0"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <div>
                <p className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>{route.from} to {route.to}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{route.time}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-green-600">{route.price}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
