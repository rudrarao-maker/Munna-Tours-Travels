'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, Percent, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock data
    const mockCoupons = [
      { id: '1', code: 'SUMMER25', type: 'percentage', discount: 25, maxAmount: 1500, minBooking: 3000, validUntil: '2026-08-31', usageLimit: 500, usedCount: 142, status: 'active' },
      { id: '2', code: 'WELCOME500', type: 'fixed', discount: 500, maxAmount: 500, minBooking: 2000, validUntil: '2026-12-31', usageLimit: 1000, usedCount: 890, status: 'active' },
      { id: '3', code: 'DIWALI20', type: 'percentage', discount: 20, maxAmount: 2000, minBooking: 5000, validUntil: '2025-11-15', usageLimit: 200, usedCount: 200, status: 'expired' },
    ];
    setCoupons(mockCoupons);
  }, []);

  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Offers & Coupons</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage discount codes and promotional campaigns.</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg">
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="p-6 rounded-3xl border shadow-sm bg-white dark:bg-[#171717] border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Tag size={24} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Active Coupons</p>
            <p className="text-3xl font-black text-black dark:text-white">12</p>
         </div>
         <div className="p-6 rounded-3xl border shadow-sm bg-white dark:bg-[#171717] border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
              <Percent size={24} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Discount Given</p>
            <p className="text-3xl font-black text-black dark:text-white">₹45,200</p>
         </div>
         <div className="p-6 rounded-3xl border shadow-sm bg-white dark:bg-[#171717] border-gray-200 dark:border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Redemptions</p>
            <p className="text-3xl font-black text-black dark:text-white">1,242</p>
         </div>
      </div>

      <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search coupon codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4 font-bold">Code</th>
                <th className="p-4 font-bold">Discount</th>
                <th className="p-4 font-bold">Conditions</th>
                <th className="p-4 font-bold">Usage</th>
                <th className="p-4 font-bold">Valid Until</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredCoupons.map(coupon => (
                <tr key={coupon.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-black text-lg text-black dark:text-white bg-gray-100 dark:bg-[#262626] px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-green-600 dark:text-green-400">
                    {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5 font-medium">
                      <p>Min Booking: ₹{coupon.minBooking}</p>
                      {coupon.type === 'percentage' && <p>Max Discount: ₹{coupon.maxAmount}</p>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 font-bold text-right">{coupon.usedCount} / {coupon.usageLimit}</p>
                  </td>
                  <td className="p-4 font-medium text-gray-600 dark:text-gray-400">
                    {coupon.validUntil}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                      coupon.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-medium">
                    No coupons found matching your search.
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
