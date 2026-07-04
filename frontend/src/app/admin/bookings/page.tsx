'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Calendar, Plus } from 'lucide-react';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-black">Direct Bookings</h2>
          <p className="text-gray-500 font-medium">Manage all confirmed route bookings.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
          <Plus size={20} />
          Create Booking
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4 font-bold">Booking ID</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold">Passengers</th>
              <th className="p-4 font-bold">Total Price</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-sm">{booking.id.substring(0, 8)}...</td>
                <td className="p-4 text-gray-600 font-medium">{booking.date}</td>
                <td className="p-4 text-gray-600">{booking.passengers}</td>
                <td className="p-4 font-bold">₹{booking.totalPrice}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-500 font-bold">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
