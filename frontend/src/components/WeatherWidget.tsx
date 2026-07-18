'use client';

import { CloudRain, Sun, Cloud, Thermometer, Wind, Droplets } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WeatherWidget({ destination }: { destination: string }) {
  // Simulate fetching weather
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      // Mock data based on destination length to make it deterministic but varied
      const isRainy = destination.length % 3 === 0;
      const isCloudy = destination.length % 2 === 0;
      
      setWeather({
        temp: 24 + (destination.length % 12),
        condition: isRainy ? 'Rainy' : isCloudy ? 'Partly Cloudy' : 'Sunny',
        humidity: 45 + (destination.length % 30),
        wind: 12 + (destination.length % 15),
        forecast: [
          { day: 'Tomorrow', temp: 26, icon: 'sun' },
          { day: 'Wed', temp: 23, icon: 'cloud' },
          { day: 'Thu', temp: 21, icon: 'rain' },
        ]
      });
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [destination]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-6 border border-white/40 dark:border-zinc-700 animate-pulse h-48">
        <div className="h-6 w-32 bg-white/50 dark:bg-zinc-700 rounded-full mb-4"></div>
        <div className="h-12 w-24 bg-white/50 dark:bg-zinc-700 rounded-full mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 to-blue-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-lg text-blue-50">Weather in</h3>
            <h2 className="text-2xl font-black">{destination}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
            {weather.condition === 'Sunny' ? <Sun size={32} className="text-yellow-300" /> : 
             weather.condition === 'Rainy' ? <CloudRain size={32} className="text-blue-200" /> : 
             <Cloud size={32} className="text-gray-100" />}
          </div>
        </div>

        <div className="flex items-end gap-4 mb-6">
          <div className="text-6xl font-black tracking-tighter">
            {weather.temp}°
          </div>
          <div className="text-xl font-medium text-blue-100 mb-1">
            {weather.condition}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-200" />
            <span className="text-sm font-medium">Humidity: {weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-blue-200" />
            <span className="text-sm font-medium">Wind: {weather.wind} km/h</span>
          </div>
        </div>

        {/* 3 Day Forecast */}
        <div className="bg-black/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-100 mb-3">3-Day Forecast</p>
          <div className="flex justify-between">
            {weather.forecast.map((f: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center">
                <p className="text-xs font-medium mb-1">{f.day}</p>
                {f.icon === 'sun' ? <Sun size={18} className="text-yellow-300 mb-1" /> : 
                 f.icon === 'rain' ? <CloudRain size={18} className="text-blue-200 mb-1" /> : 
                 <Cloud size={18} className="text-gray-200 mb-1" />}
                <p className="text-sm font-bold">{f.temp}°</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
