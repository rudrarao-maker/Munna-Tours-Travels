'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Map, Bus, 
  DollarSign, Package, Calendar, ArrowUpRight, ArrowDownRight,
  Clock, XCircle, CheckCircle2, AlertCircle, RefreshCw, BarChart3
} from 'lucide-react';
import axios from '@/lib/axios';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
        // Set mock fallback
        setAnalytics(getMockAnalytics());
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1,2].map(i => (
            <div key={i} className="h-96 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', value: `₹${(analytics?.totalRevenue || 425000).toLocaleString()}`, trend: '+12.5%', trendUp: true, icon: DollarSign, color: '#10b981' },
    { title: 'Total Bookings', value: (analytics?.totalBookings || 1248).toLocaleString(), trend: '+8.2%', trendUp: true, icon: Package, color: '#3b82f6' },
    { title: 'Active Customers', value: (analytics?.totalUsers || 892).toLocaleString(), trend: '+15.3%', trendUp: true, icon: Users, color: '#8b5cf6' },
    { title: 'Active Drivers', value: (analytics?.activeDrivers || 45).toLocaleString(), trend: '+2.1%', trendUp: true, icon: Bus, color: '#f59e0b' },
  ];

  const statusCards = [
    { title: 'Pending', value: analytics?.pendingBookings || 23, icon: Clock, bg: 'rgba(234,179,8,0.1)', color: '#eab308' },
    { title: 'Confirmed', value: analytics?.confirmedBookings || 156, icon: CheckCircle2, bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
    { title: 'Cancelled', value: analytics?.cancelledBookings || 18, icon: XCircle, bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    { title: 'Refunded', value: analytics?.refundedBookings || 7, icon: RefreshCw, bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
  ];

  const dailyData = analytics?.dailyChartData?.length > 0 ? analytics.dailyChartData : [
    { label: 'Mon', revenue: 12000, bookings: 5 }, { label: 'Tue', revenue: 19000, bookings: 8 },
    { label: 'Wed', revenue: 15000, bookings: 6 }, { label: 'Thu', revenue: 22000, bookings: 9 },
    { label: 'Fri', revenue: 38000, bookings: 14 }, { label: 'Sat', revenue: 45000, bookings: 18 },
    { label: 'Sun', revenue: 41000, bookings: 16 },
  ];

  const monthlyData = analytics?.monthlyChartData?.length > 0 ? analytics.monthlyChartData : [
    { month: 'Jan', bookings: 120, revenue: 340000, cancellations: 8 },
    { month: 'Feb', bookings: 98, revenue: 280000, cancellations: 5 },
    { month: 'Mar', bookings: 145, revenue: 420000, cancellations: 12 },
    { month: 'Apr', bookings: 168, revenue: 480000, cancellations: 9 },
    { month: 'May', bookings: 132, revenue: 380000, cancellations: 7 },
    { month: 'Jun', bookings: 189, revenue: 560000, cancellations: 14 },
    { month: 'Jul', bookings: 210, revenue: 630000, cancellations: 11 },
  ];

  const topDestinations = analytics?.topDestinations?.length > 0 ? analytics.topDestinations : [
    { name: 'Mumbai', bookings: 450 }, { name: 'Pune', bookings: 380 },
    { name: 'Udaipur', bookings: 320 }, { name: 'Jaipur', bookings: 290 },
    { name: 'Goa', bookings: 260 }, { name: 'Delhi', bookings: 220 },
  ];

  const peakHoursData = analytics?.peakHoursData?.length > 0 ? analytics.peakHoursData : [
    { hour: '06:00', bookings: 12 }, { hour: '07:00', bookings: 18 }, { hour: '08:00', bookings: 32 },
    { hour: '09:00', bookings: 45 }, { hour: '10:00', bookings: 58 }, { hour: '11:00', bookings: 42 },
    { hour: '12:00', bookings: 35 }, { hour: '13:00', bookings: 28 }, { hour: '14:00', bookings: 30 },
    { hour: '15:00', bookings: 38 }, { hour: '16:00', bookings: 44 }, { hour: '17:00', bookings: 52 },
    { hour: '18:00', bookings: 65 }, { hour: '19:00', bookings: 72 }, { hour: '20:00', bookings: 58 },
    { hour: '21:00', bookings: 40 }, { hour: '22:00', bookings: 25 }, { hour: '23:00', bookings: 15 },
  ];

  const userGrowthData = analytics?.userGrowthData?.length > 0 ? analytics.userGrowthData : [
    { month: 'Jan', newUsers: 45 }, { month: 'Feb', newUsers: 52 },
    { month: 'Mar', newUsers: 78 }, { month: 'Apr', newUsers: 95 },
    { month: 'May', newUsers: 88 }, { month: 'Jun', newUsers: 120 },
    { month: 'Jul', newUsers: 142 },
  ];

  const popularRoutes = analytics?.popularRoutes?.length > 0 ? analytics.popularRoutes : [
    { route: 'Ahmedabad → Pune', bookings: 450 },
    { route: 'Mumbai → Surat', bookings: 380 },
    { route: 'Delhi → Jaipur', bookings: 320 },
    { route: 'Bangalore → Goa', bookings: 290 },
  ];

  const recentBookings = analytics?.recentBookingsTable?.length > 0 ? analytics.recentBookingsTable : [
    { id: 'BK-9821', user: 'Rahul Desai', route: 'Ahmedabad to Pune', amount: '₹1,500', status: 'Confirmed', date: '2026-07-17' },
    { id: 'BK-9822', user: 'Sneha Patel', route: 'Mumbai to Surat', amount: '₹850', status: 'Pending', date: '2026-07-17' },
    { id: 'BK-9823', user: 'Amit Shah', route: 'Delhi to Jaipur', amount: '₹1,200', status: 'Confirmed', date: '2026-07-16' },
    { id: 'BK-9824', user: 'Priya Sharma', route: 'Bangalore to Goa', amount: '₹2,100', status: 'Cancelled', date: '2026-07-16' },
    { id: 'BK-9825', user: 'Vikram Singh', route: 'Ahmedabad to Mumbai', amount: '₹900', status: 'Completed', date: '2026-07-15' },
  ];

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
    Refunded: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Analytics Overview</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Monitor your business performance and key metrics.</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button key={range} onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${timeRange === range ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
              style={{ 
                backgroundColor: timeRange === range ? 'var(--foreground)' : 'var(--card-bg)', 
                color: timeRange === range ? 'var(--background)' : 'var(--foreground)',
                border: '1px solid var(--card-border)' 
              }}>
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${stat.trendUp ? 'text-green-600 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xs mb-1.5 uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{stat.title}</h3>
              <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((card, i) => (
          <div key={i} className="p-4 rounded-2xl border flex items-center gap-4 transition-all hover:shadow-sm"
               style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: card.bg, color: card.color }}>
              <card.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>{card.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Monthly Bookings Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>Revenue Trend</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>Daily</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bookings */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>Monthly Bookings</h2>
            <span className="text-xs font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>Last 12 Months</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} name="Bookings" />
                <Bar dataKey="cancellations" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={20} name="Cancellations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Destinations + Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Destinations Pie */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Top Destinations</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topDestinations} dataKey="bookings" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {topDestinations.map((_: any, index: number) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Booking Hours */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Peak Booking Hours</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: 'var(--muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                  formatter={(value: any) => [value, 'Bookings']}
                />
                <Bar dataKey="bookings" radius={[4, 4, 0, 0]} barSize={14}>
                  {peakHoursData.map((_: any, index: number) => (
                    <Cell key={index} fill={peakHoursData[index].bookings > 50 ? '#ef4444' : peakHoursData[index].bookings > 30 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth + Popular Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>User Growth</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                  formatter={(value: any) => [value, 'New Users']}
                />
                <Area type="monotone" dataKey="newUsers" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#userGrad)" dot={{ r: 3, fill: '#8b5cf6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="rounded-3xl border shadow-sm p-6 lg:p-8"
             style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Popular Routes</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularRoutes} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="var(--card-border)" strokeDasharray="5 5" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="route" type="category" tick={{ fill: 'var(--foreground)', fontWeight: 'bold', fontSize: 11 }} axisLine={false} tickLine={false} width={140} />
                <Tooltip
                  cursor={{ fill: 'var(--section-alt)' }}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                />
                <Bar dataKey="bookings" fill="var(--foreground)" radius={[0, 6, 6, 0]} barSize={20} />
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
          <a href="/admin/bookings" className="text-sm font-bold hover:underline" style={{ color: 'var(--foreground)' }}>View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'var(--section-alt)', color: 'var(--muted)' }}>
                <th className="p-4 font-bold">Booking ID</th>
                <th className="p-4 font-bold">Passenger</th>
                <th className="p-4 font-bold">Route</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentBookings.map((b: any) => (
                <tr key={b.id} className="border-b transition hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--card-border)' }}>
                  <td className="p-4 font-black" style={{ color: 'var(--foreground)' }}>{typeof b.id === 'string' && b.id.length > 10 ? `${b.id.substring(0, 8)}...` : b.id}</td>
                  <td className="p-4 font-bold" style={{ color: 'var(--foreground)' }}>{b.user}</td>
                  <td className="p-4 font-medium" style={{ color: 'var(--muted)' }}>{b.route}</td>
                  <td className="p-4 font-medium" style={{ color: 'var(--muted)' }}>{b.date}</td>
                  <td className="p-4 font-black text-green-600">{b.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${statusColors[b.status] || 'bg-gray-100 text-gray-700'}`}>
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

function getMockAnalytics() {
  return {
    totalBookings: 1248, pendingBookings: 23, confirmedBookings: 156,
    completedBookings: 1042, cancelledBookings: 18, refundedBookings: 9,
    totalRevenue: 425000, totalUsers: 892, activeVehicles: 12, activeDrivers: 45,
    dailyChartData: [], monthlyChartData: [], topDestinations: [],
    peakHoursData: [], userGrowthData: [], popularRoutes: [], recentBookingsTable: [],
  };
}
