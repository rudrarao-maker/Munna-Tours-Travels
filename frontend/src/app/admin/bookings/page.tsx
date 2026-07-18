'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Calendar, Plus, Search, Filter, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // In real implementation:
      // const res = await axios.get('/bookings');
      // setBookings(res.data);

      // Using mock data for demo since backend might be empty
      const mockBookings = [
        { id: 'BK-982143', date: '2026-07-17', user: { name: 'Rahul Desai', email: 'rahul@test.com' }, route: { from: 'Ahmedabad', to: 'Pune' }, passengers: 2, totalPrice: 1500, status: 'Confirmed' },
        { id: 'BK-982255', date: '2026-07-18', user: { name: 'Sneha Patel', email: 'sneha@test.com' }, route: { from: 'Mumbai', to: 'Surat' }, passengers: 1, totalPrice: 850, status: 'Pending' },
        { id: 'BK-982312', date: '2026-07-19', user: { name: 'Amit Shah', email: 'amit@test.com' }, route: { from: 'Delhi', to: 'Jaipur' }, passengers: 4, totalPrice: 4800, status: 'Cancelled' },
        { id: 'BK-982467', date: '2026-07-15', user: { name: 'Priya Sharma', email: 'priya@test.com' }, route: { from: 'Bangalore', to: 'Goa' }, passengers: 2, totalPrice: 3200, status: 'Completed' },
      ];
      setBookings(mockBookings);
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
       // In real implementation:
       // await axios.put(`/bookings/${id}/status`, { status: newStatus });
       
       // Update local state for immediate feedback
       setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
       toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
       console.error(err);
       toast.error('Failed to update status');
    } finally {
       setUpdatingId(null);
    }
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Refunded: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300',
  };

  const filteredBookings = bookings.filter(b => {
     const matchesSearch = 
       b.id.toLowerCase().includes(search.toLowerCase()) || 
       (b.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
       (b.route?.from || '').toLowerCase().includes(search.toLowerCase()) ||
       (b.route?.to || '').toLowerCase().includes(search.toLowerCase());
     
     const matchesStatus = statusFilter === 'all' || b.status.toLowerCase() === statusFilter.toLowerCase();
     
     return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Bookings Management</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage reservations, update statuses, and view passenger details.</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg">
          <Plus size={20} />
          Manual Booking
        </button>
      </div>

      <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by ID, User, or Route..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none font-medium w-full md:w-auto"
             >
               <option value="all">All Statuses</option>
               <option value="pending">Pending</option>
               <option value="confirmed">Confirmed</option>
               <option value="completed">Completed</option>
               <option value="cancelled">Cancelled</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4 font-bold">Booking Details</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Journey</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-black text-black dark:text-white text-xs mb-1">{booking.id}</p>
                    <div className="flex items-center text-xs text-gray-500 font-bold gap-1">
                      <Calendar size={12} /> {booking.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-black dark:text-white">{booking.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-black dark:text-white">
                      {booking.route?.from} → {booking.route?.to}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">{booking.passengers} Passenger(s)</p>
                  </td>
                  <td className="p-4 font-black text-black dark:text-white">
                    ₹{booking.totalPrice?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${statusColors[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                     <div className="relative inline-block group">
                       <button 
                         disabled={updatingId === booking.id}
                         className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-xs font-bold hover:bg-gray-50 dark:hover:bg-[#333] transition disabled:opacity-50"
                       >
                         {updatingId === booking.id ? 'Updating...' : 'Update'}
                         <ChevronDown size={14} />
                       </button>
                       <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                          {['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'].map(status => (
                            <button 
                              key={status}
                              onClick={() => handleUpdateStatus(booking.id, status)}
                              className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-100 dark:hover:bg-[#333] transition flex justify-between items-center ${booking.status === status ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}
                            >
                              {status}
                              {booking.status === status && <Check size={14} />}
                            </button>
                          ))}
                       </div>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500 font-bold">No bookings found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
