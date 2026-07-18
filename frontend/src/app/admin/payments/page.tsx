'use client';

import { useState, useEffect } from 'react';
import { Search, Download, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock data for payments
    const mockPayments = [
      { id: 'pay_12345abcde', bookingId: 'BK-9821', user: 'Rahul Desai', email: 'rahul@example.com', amount: 1500, method: 'UPI', status: 'successful', date: '2026-07-17 14:30:00' },
      { id: 'pay_67890fghij', bookingId: 'BK-9822', user: 'Sneha Patel', email: 'sneha@example.com', amount: 850, method: 'Credit Card', status: 'pending', date: '2026-07-17 15:45:00' },
      { id: 'pay_13579klmno', bookingId: 'BK-9823', user: 'Amit Shah', email: 'amit@example.com', amount: 1200, method: 'Net Banking', status: 'successful', date: '2026-07-16 09:15:00' },
      { id: 'pay_24680pqrst', bookingId: 'BK-9824', user: 'Priya Sharma', email: 'priya@example.com', amount: 2100, method: 'Debit Card', status: 'failed', date: '2026-07-16 11:20:00' },
      { id: 'pay_98765uvwxy', bookingId: 'BK-9824', user: 'Priya Sharma', email: 'priya@example.com', amount: 2100, method: 'UPI', status: 'refunded', date: '2026-07-16 18:00:00' },
    ];
    setPayments(mockPayments);
  }, []);

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(search.toLowerCase()) || 
    p.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    p.user.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'refunded': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Payments Ledger</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>View all transaction history, refunds, and payment status.</p>
        </div>
        <button className="border-2 border-black dark:border-white text-black dark:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Payment ID, Booking ID, or User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#262626] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#333]">
                <Filter size={16} /> Filters
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4 font-bold">Transaction Info</th>
                <th className="p-4 font-bold">User Details</th>
                <th className="p-4 font-bold">Method</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-black text-black dark:text-white text-xs mb-1">{payment.id}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-2 font-bold">
                       <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{payment.bookingId}</span>
                       <span>•</span>
                       <span>{payment.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-black dark:text-white">{payment.user}</p>
                    <p className="text-xs text-gray-500">{payment.email}</p>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-medium">
                    {payment.method}
                  </td>
                  <td className="p-4 font-black text-black dark:text-white">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                     <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <ExternalLink size={16} />
                     </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No transactions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
