'use client';

import { useState, useEffect } from 'react';
import { Download, Calendar, Filter, FileText, CheckCircle } from 'lucide-react';
import axios from '@/lib/axios';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('this-month');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      // In a real app, calculate dates based on dateRange and pass as query params
      const res = await axios.get(`/reports/${reportType}`);
      setReportData(res.data);
    } catch {
      // Demo data
      setReportData({
        type: reportType,
        totalRevenue: 425000,
        paidRevenue: 390000,
        pendingRevenue: 35000,
        totalBookings: 145,
        avgBookingValue: 2931,
        routeBreakdown: [
          { route: 'Ahmedabad → Mumbai', revenue: 125000 },
          { route: 'Mumbai → Pune', revenue: 95000 },
          { route: 'Ahmedabad → Pune', revenue: 85000 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Reports & Analytics</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Generate deep-dive reports across modules.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 p-4 rounded-2xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl font-bold outline-none appearance-none"
                  style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}>
            <option value="revenue">Revenue & Sales</option>
            <option value="bookings">Booking Volume</option>
            <option value="fleet">Fleet & Maintenance Cost</option>
            <option value="drivers">Driver Performance</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl font-bold outline-none appearance-none"
                  style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={fetchReport} className="px-6 py-2.5 rounded-xl font-bold transition-opacity hover:opacity-90 h-[44px]"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
            Generate
          </button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="rounded-3xl border shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        {loading ? (
          <div className="py-20 text-center font-bold" style={{ color: 'var(--muted)' }}>Generating report...</div>
        ) : reportData ? (
          <div>
            <h2 className="text-xl font-black mb-6 uppercase tracking-wider border-b pb-4" style={{ color: 'var(--foreground)', borderColor: 'var(--card-border)' }}>
              {reportType} Summary
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(reportData).map(([key, value]) => {
                if (key === 'type' || typeof value === 'object') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--section-alt)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>{formattedKey}</p>
                    <p className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>
                      {key.toLowerCase().includes('revenue') || key.toLowerCase().includes('value') ? `₹${Number(value).toLocaleString()}` : String(value)}
                    </p>
                  </div>
                );
              })}
            </div>

            {reportData.routeBreakdown && (
              <div>
                <h3 className="font-bold mb-4" style={{ color: 'var(--foreground)' }}>Top Performing Routes</h3>
                <div className="space-y-3">
                  {reportData.routeBreakdown.map((r: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl border" style={{ borderColor: 'var(--card-border)' }}>
                      <span className="font-medium" style={{ color: 'var(--foreground)' }}>{r.route}</span>
                      <span className="font-black text-green-500">₹{r.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 font-bold" style={{ color: 'var(--muted)' }}>No data available for this selection.</div>
        )}
      </div>
    </div>
  );
}
