'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Download, MessageSquare, X, Star, QrCode, FileText, Bus, Clock, ArrowRight } from 'lucide-react';
import axios from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [feedbackModal, setFeedbackModal] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      // Fallback mock data
      setBookings(getDemoBookings());
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async (bookingId: string) => {
    try {
      const res = await axios.get(`/bookings/${bookingId}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `MunnaTravels_Ticket_${bookingId.slice(0, 8)}.pdf`;
      link.click();
    } catch {
      alert('Could not download ticket. Please try again.');
    }
  };

  const submitFeedback = async () => {
    try {
      await axios.post('/feedback', {
        bookingId: feedbackModal,
        rating: feedbackRating,
        comment: feedbackComment,
      });
      alert('Thank you for your feedback!');
      setFeedbackModal(null);
      setFeedbackComment('');
      setFeedbackRating(5);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await axios.put(`/bookings/${bookingId}/cancel`);
      alert(`Booking cancelled. Refund: ₹${res.data.refundAmount}`);
      fetchBookings();
    } catch {
      alert('Failed to cancel booking.');
    }
  };

  const filteredBookings = bookings.filter(b => filter === 'all' || b.status === filter);

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
    Refunded: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>
          My Bookings
        </motion.h1>
        <p className="font-medium mb-8" style={{ color: 'var(--muted)' }}>
          View your trip history, download e-tickets, and leave feedback.
        </p>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === f ? 'scale-105' : 'opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: filter === f ? 'var(--foreground)' : 'var(--card-bg)', color: filter === f ? 'var(--background)' : 'var(--foreground)', border: '1px solid var(--card-border)' }}>
              {f === 'all' ? 'All Bookings' : f}
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-3xl animate-pulse" style={{ backgroundColor: 'var(--section-alt)' }} />)}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <Bus size={48} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--foreground)' }} />
            <h3 className="text-xl font-black mb-2" style={{ color: 'var(--foreground)' }}>No bookings found</h3>
            <p className="font-medium" style={{ color: 'var(--muted)' }}>Your bookings will appear here once you make a reservation.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, i) => (
              <motion.div key={booking.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-3xl overflow-hidden shadow-md"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-black" style={{ color: 'var(--foreground)' }}>
                          {booking.route?.from || 'Origin'} <ArrowRight className="inline" size={16} /> {booking.route?.to || 'Destination'}
                        </h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-black ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--muted)' }}>
                        <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> {booking.date}</span>
                        <span className="flex items-center gap-1.5 font-medium"><Users size={14} /> {booking.passengers} passengers</span>
                        <span className="flex items-center gap-1.5 font-medium"><Clock size={14} /> {booking.route?.time || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>₹{booking.totalPrice}</p>
                      <p className={`text-xs font-bold ${booking.paymentStatus === 'Paid' ? 'text-green-500' : 'text-amber-500'}`}>
                        {booking.paymentStatus}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                    <button onClick={() => downloadTicket(booking.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors hover:opacity-90"
                      style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                      <QrCode size={16} /> E-Ticket
                    </button>
                    <button onClick={() => downloadTicket(booking.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                      style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                      <FileText size={16} /> Invoice
                    </button>
                    {booking.status === 'Completed' && (
                      <button onClick={() => setFeedbackModal(booking.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                        style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                        <MessageSquare size={16} /> Leave Review
                      </button>
                    )}
                    {booking.status === 'Confirmed' && (
                      <button onClick={() => cancelBooking(booking.id)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        style={{ backgroundColor: 'var(--section-alt)' }}>
                        <X size={16} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setFeedbackModal(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
            <h3 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Rate Your Trip</h3>
            
            {/* Star Rating */}
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setFeedbackRating(star)} className="transition-transform hover:scale-110">
                  <Star size={36} fill={star <= feedbackRating ? '#f59e0b' : 'none'} stroke={star <= feedbackRating ? '#f59e0b' : 'var(--muted-light)'} />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea value={feedbackComment} onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4} className="w-full px-4 py-3 rounded-xl outline-none resize-none mb-6 font-medium"
              style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />

            <div className="flex gap-3">
              <button onClick={() => setFeedbackModal(null)} className="flex-1 py-3 rounded-xl font-bold"
                style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)' }}>
                Cancel
              </button>
              <button onClick={submitFeedback} className="flex-1 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function getDemoBookings() {
  return [
    { id: 'b1', date: '2026-07-25', passengers: 4, totalPrice: '3600', status: 'Confirmed', paymentStatus: 'Paid', route: { from: 'Ahmedabad', to: 'Mumbai', time: '8 hrs 30 mins', type: 'Volvo A/C Sleeper' } },
    { id: 'b2', date: '2026-07-10', passengers: 2, totalPrice: '2400', status: 'Completed', paymentStatus: 'Paid', route: { from: 'Ahmedabad', to: 'Pune', time: '11 hrs 45 mins', type: 'Scania Multi-Axle' } },
    { id: 'b3', date: '2026-06-28', passengers: 6, totalPrice: '3300', status: 'Completed', paymentStatus: 'Paid', route: { from: 'Ahmedabad', to: 'Udaipur', time: '5 hrs 15 mins', type: 'BharatBenz Premium' } },
    { id: 'b4', date: '2026-06-15', passengers: 3, totalPrice: '2550', status: 'Cancelled', paymentStatus: 'Refunded', route: { from: 'Ahmedabad', to: 'Jaipur', time: '10 hrs 30 mins', type: 'Volvo A/C Sleeper' } },
  ];
}
