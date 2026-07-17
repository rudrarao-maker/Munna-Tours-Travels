'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardOverview() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadTicket = async (bookingId: string) => {
    setDownloading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/bookings/${bookingId}/ticket`);
      
      if (!response.ok) {
        throw new Error('Failed to download ticket');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MunnaTravels_Ticket_${bookingId.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download ticket. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? Refund will be processed based on cancellation policy.')) {
      return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/bookings/${bookingId}/cancel`, { method: 'PUT' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }
      alert(`Booking cancelled successfully. Refund amount: ₹${data.refundAmount}`);
      // Refresh logic would go here in a real app
    } catch (error: any) {
      console.error('Cancel failed:', error);
      alert(error.message);
    }
  };

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Dashboard Overview</h1>
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage your tickets, save your favorite routes, and track your buses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Upcoming Trips</p>
            <h3 className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>1</h3>
          </div>
          <Link href="/dashboard/bookings" className="text-sm font-bold flex items-center mt-4 group" style={{ color: 'var(--foreground)' }}>
            View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="p-6 rounded-3xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>Saved Routes</p>
            <h3 className="text-4xl font-black" style={{ color: 'var(--foreground)' }}>4</h3>
          </div>
          <Link href="/dashboard/saved" className="text-sm font-bold flex items-center mt-4 group" style={{ color: 'var(--foreground)' }}>
            View Saved <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="bg-black p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-2">Rewards Points</p>
            <h3 className="text-4xl font-black">2,450</h3>
          </div>
          <p className="text-sm font-bold text-white/90 relative z-10 mt-4">Redeem on your next booking!</p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <div className="p-8 rounded-3xl border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
        <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Your Next Adventure</h2>
        
        <div className="border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-center"
          style={{ borderColor: 'var(--card-border)' }}>
          <div className="w-full sm:w-1/3 h-48 rounded-xl overflow-hidden relative" style={{ backgroundColor: 'var(--section-alt)' }}>
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop')" }}
            />
          </div>
          <div className="w-full sm:w-2/3 flex flex-col justify-center">
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider"
                style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>Confirmed</span>
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Kerala Backwaters Retreat</h3>
            <div className="flex flex-wrap items-center gap-4 font-medium mb-6" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center"><MapPin className="mr-1" size={16} /> Kerala, India</span>
              <span className="flex items-center"><Clock className="mr-1" size={16} /> 3N/4D</span>
              <span className="flex items-center"><Calendar className="mr-1" size={16} /> Oct 15, 2026</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">View Itinerary</button>
              <button 
                onClick={() => handleDownloadTicket('demo-booking-id')}
                disabled={downloading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                {downloading ? 'Downloading...' : 'Download E-Ticket'}
              </button>
              <button 
                onClick={() => handleCancelBooking('demo-booking-id')}
                className="px-6 py-3 rounded-xl font-bold transition border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Cancel Booking
              </button>
              <button className="px-6 py-3 rounded-xl font-bold transition"
                style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
