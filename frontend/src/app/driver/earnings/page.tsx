'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DriverEarningsPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const earnings = {
    week: { total: '₹18,500', trips: 12, avgPerTrip: '₹1,542', trend: '+15%' },
    month: { total: '₹72,400', trips: 48, avgPerTrip: '₹1,508', trend: '+8%' },
  };

  const current = earnings[period];

  const weeklyData = [
    { day: 'Mon', amount: 2800 },
    { day: 'Tue', amount: 3200 },
    { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 2500 },
    { day: 'Fri', amount: 4100 },
    { day: 'Sat', amount: 3500 },
    { day: 'Sun', amount: 2400 },
  ];
  const maxAmount = Math.max(...weeklyData.map(d => d.amount));

  const recentPayouts = [
    { id: 'p1', date: 'Jul 14, 2026', amount: '₹18,200', status: 'Paid', trips: 12 },
    { id: 'p2', date: 'Jul 07, 2026', amount: '₹16,800', status: 'Paid', trips: 11 },
    { id: 'p3', date: 'Jun 30, 2026', amount: '₹19,500', status: 'Paid', trips: 13 },
    { id: 'p4', date: 'Jun 23, 2026', amount: '₹15,200', status: 'Paid', trips: 10 },
  ];

  return (
    <div className="py-6 space-y-6">
      <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>Earnings</h2>

      {/* Period Toggle */}
      <div className="flex rounded-xl p-1" style={{ backgroundColor: 'var(--section-alt)' }}>
        {(['week', 'month'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${period === p ? 'shadow-sm' : 'opacity-60'}`}
            style={{ backgroundColor: period === p ? 'var(--card-bg)' : 'transparent', color: 'var(--foreground)' }}>
            This {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Total Earnings Card */}
      <motion.div key={period} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
        <p className="text-sm opacity-60 font-bold mb-1">Total Earnings</p>
        <div className="flex items-end gap-3 mb-4">
          <p className="text-4xl font-black">{current.total}</p>
          <span className="flex items-center text-sm font-bold text-green-400 mb-1">
            <ArrowUpRight size={16} /> {current.trend}
          </span>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-xs opacity-50 font-bold">Trips</p>
            <p className="text-lg font-black">{current.trips}</p>
          </div>
          <div>
            <p className="text-xs opacity-50 font-bold">Avg/Trip</p>
            <p className="text-lg font-black">{current.avgPerTrip}</p>
          </div>
        </div>
      </motion.div>

      {/* Bar Chart */}
      <div className="p-5 rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h3 className="font-black text-sm uppercase tracking-wider mb-4" style={{ color: 'var(--muted)' }}>Daily Breakdown</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div initial={{ height: 0 }} animate={{ height: maxAmount > 0 ? `${(d.amount / maxAmount) * 100}%` : 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full rounded-lg min-h-[4px]"
                style={{ backgroundColor: d.amount > 0 ? 'var(--foreground)' : 'var(--card-border)' }} />
              <span className="text-[10px] font-bold" style={{ color: 'var(--muted)' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payout History */}
      <div>
        <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: 'var(--muted)' }}>Payout History</h3>
        <div className="space-y-3">
          {recentPayouts.map((payout, i) => (
            <motion.div key={payout.id}
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{payout.date}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{payout.trips} trips</p>
              </div>
              <div className="text-right">
                <p className="font-black" style={{ color: 'var(--foreground)' }}>{payout.amount}</p>
                <p className="text-xs font-bold text-green-500">{payout.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
