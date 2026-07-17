'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Fuel, AlertCircle, Plus, CheckCircle, Clock } from 'lucide-react';
import axios from '@/lib/axios';

export default function FleetManagementPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFleetAnalytics();
  }, []);

  const fetchFleetAnalytics = async () => {
    try {
      const res = await axios.get('/fleet/analytics');
      setAnalytics(res.data);
    } catch {
      // Fallback data
      setAnalytics({
        totalVehicles: 24,
        activeVehicles: 18,
        totalCost: 125000,
        costBreakdown: { maintenance: 45000, fuel: 65000, repair: 15000 },
        totalMileage: 125400,
        avgFuelCostPerKm: '12.5',
        upcomingMaintenanceCount: 3,
        upcomingMaintenance: [
          { id: '1', name: 'Volvo B11R', registration: 'GJ-01-XX-1234', lastService: '2026-06-15' },
          { id: '2', name: 'Scania Metrolink', registration: 'MH-04-YY-5678', lastService: '2026-06-10' },
        ],
        recentLogs: [
          { id: 'l1', type: 'maintenance', description: 'Oil change and filter replacement', cost: 12500, date: '2026-07-16', vehicle: { registration: 'GJ-01-XX-1234' } },
          { id: 'l2', type: 'fuel', description: 'Diesel top-up', cost: 18500, date: '2026-07-15', vehicle: { registration: 'MH-04-YY-5678' } },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="font-bold">Loading Fleet Data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Fleet Management</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage vehicles, track maintenance, and monitor fuel expenses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <CheckCircle size={20} />
          </div>
          <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Active Vehicles</h3>
          <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>
            {analytics.activeVehicles} <span className="text-sm font-medium opacity-60">/ {analytics.totalVehicles}</span>
          </p>
        </div>
        <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <AlertCircle size={20} />
          </div>
          <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Needs Service</h3>
          <p className="text-3xl font-black text-amber-600">{analytics.upcomingMaintenanceCount}</p>
        </div>
        <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <Fuel size={20} />
          </div>
          <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Total Fleet Cost</h3>
          <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>₹{(analytics.totalCost / 1000).toFixed(1)}k</p>
        </div>
        <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <Wrench size={20} />
          </div>
          <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Avg. Fuel Cost / Km</h3>
          <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>₹{analytics.avgFuelCostPerKm}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Maintenance Required */}
        <div className="rounded-3xl border shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Maintenance Required</h2>
          {analytics.upcomingMaintenance.length > 0 ? (
            <div className="space-y-4">
              {analytics.upcomingMaintenance.map((v: any) => (
                <div key={v.id} className="flex justify-between items-center p-4 rounded-2xl" style={{ backgroundColor: 'var(--section-alt)' }}>
                  <div>
                    <p className="font-black" style={{ color: 'var(--foreground)' }}>{v.registration}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{v.name} · Last Service: {v.lastService?.split('T')[0]}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
                    Schedule Service
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-500 opacity-50" />
              <p className="font-bold" style={{ color: 'var(--foreground)' }}>All vehicles are up to date!</p>
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="rounded-3xl border shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>Recent Logs</h2>
            <button className="text-sm font-bold hover:underline" style={{ color: 'var(--foreground)' }}>Add Log</button>
          </div>
          <div className="space-y-4">
            {analytics.recentLogs.map((log: any) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-2xl border" style={{ borderColor: 'var(--card-border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                     style={{ backgroundColor: log.type === 'fuel' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                  {log.type === 'fuel' ? <Fuel size={16} className="text-red-500" /> : <Wrench size={16} className="text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{log.vehicle?.registration}</p>
                    <p className="font-black text-sm" style={{ color: 'var(--foreground)' }}>₹{log.cost.toLocaleString()}</p>
                  </div>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>{log.description}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-light)' }}>
                    {log.date?.split('T')[0]} · {log.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
