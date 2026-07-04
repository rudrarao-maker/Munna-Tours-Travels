'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Map, Bus, 
  DollarSign, Package 
} from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-black font-bold">Loading Analytics...</div>;

  const stats = [
    { title: 'Total Revenue', value: `₹${analytics?.totalRevenue || 0}`, isPositive: true, icon: DollarSign },
    { title: 'Total Bookings', value: analytics?.totalBookings || 0, isPositive: true, icon: Package },
    { title: 'Active Customers', value: analytics?.totalUsers || 0, isPositive: true, icon: Users },
    { title: 'Active Drivers', value: analytics?.activeDrivers || 0, isPositive: true, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Top Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
                <stat.icon size={20} />
              </div>
            </div>
            <h3 className="text-gray-500 font-bold text-sm mb-1">{stat.title}</h3>
            <p className="text-3xl font-black text-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <h2 className="text-xl font-black text-black mb-6">Revenue Over Time (Recent Bookings)</h2>
        <div className="h-80 w-full">
          {analytics?.chartData && analytics.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold">
              Not enough data to display chart.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
