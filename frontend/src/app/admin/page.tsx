'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Map, Bus, 
  DollarSign, Package, Calendar, ArrowUpRight
} from 'lucide-react';
import axios from '@/lib/axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 font-bold" style={{ color: 'var(--foreground)' }}>Loading Analytics...</div>;

  const stats = [
    { title: 'Total Revenue', value: `₹${analytics?.totalRevenue || '4,25,000'}`, trend: '+12.5%', icon: DollarSign },
    { title: 'Total Bookings', value: analytics?.totalBookings || '1,248', trend: '+8.2%', icon: Package },
    { title: 'Active Customers', value: analytics?.totalUsers || '892', trend: '+15.3%', icon: Users },
    { title: 'Active Drivers', value: analytics?.activeDrivers || '45', trend: '+2.1%', icon: TrendingUp },
  ];

  // Fallback Mock Data for charts if backend doesn't provide enough
  const chartData = analytics?.chartData?.length > 0 ? analytics.chartData : [
    { date: 'Mon', revenue: 12000 }, { date: 'Tue', revenue: 19000 }, { date: 'Wed', revenue: 15000 },
    { date: 'Thu', revenue: 22000 }, { date: 'Fri', revenue: 38000 }, { date: 'Sat', revenue: 45000 }, { date: 'Sun', revenue: 41000 }
  ];

  const popularRoutesData = [
    { route: 'Ahmedabad - Pune', bookings: 450 },
    { route: 'Mumbai - Surat', bookings: 380 },
    { route: 'Delhi - Jaipur', bookings: 320 },
    { route: 'Bangalore - Goa', bookings: 290 }
  ];

  const recentBookings = [
    { id: 'BK-9821', user: 'Rahul Desai', route: 'Ahmedabad to Pune', amount: '₹1,500', status: 'Confirmed' },
    { id: 'BK-9822', user: 'Sneha Patel', route: 'Mumbai to Surat', amount: '₹850', status: 'Pending' },
    { id: 'BK-9823', user: 'Amit Shah', route: 'Delhi to Jaipur', amount: '₹1,200', status: 'Confirmed' },
    { id: 'BK-9824', user: 'Priya Sharma', route: 'Bangalore to Goa', amount: '₹2,100', status: 'Cancelled' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Analytics Overview</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Monitor your business performance and key metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
          <Calendar size={16} /> Last 7 Days
        </button>
      </div>

      {/* Top Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                <stat.icon size={20} />
              </div>
              <span className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                <ArrowUpRight size={14} className="mr-1" /> {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1 uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{stat.title}</h3>
              <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Revenue Overview</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="revenue" stroke="var(--foreground)" strokeWidth={3} dot={{ r: 4, fill: 'var(--foreground)' }} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Popular Routes</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularRoutesData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="route" type="category" tick={{ fill: 'var(--foreground)', fontWeight: 'bold' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip 
                  cursor={{ fill: 'var(--section-alt)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                />
                <Bar dataKey="bookings" fill="var(--foreground)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-3xl border shadow-sm overflow-hidden"
           style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>Recent Bookings</h2>
          <button className="text-sm font-bold hover:underline" style={{ color: 'var(--foreground)' }}>View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>
                <th className="p-4 font-bold">Booking ID</th>
                <th className="p-4 font-bold">Passenger</th>
                <th className="p-4 font-bold">Route</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--card-border)' }}>
                  <td className="p-4 font-black" style={{ color: 'var(--foreground)' }}>{b.id}</td>
                  <td className="p-4 font-bold" style={{ color: 'var(--foreground)' }}>{b.user}</td>
                  <td className="p-4 font-medium" style={{ color: 'var(--muted)' }}>{b.route}</td>
                  <td className="p-4 font-black text-green-600">{b.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                      b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                      b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
