'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Plus, Search, Edit2, Trash2, UserCheck, Star, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DriversManagement() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      // Mock data for now if backend endpoint doesn't exist
      const mockDrivers = [
        { id: '1', name: 'Ramesh Kumar', phone: '+91 9876543210', license: 'GJ01-2015-1234567', status: 'active', rating: 4.8, totalTrips: 156 },
        { id: '2', name: 'Suresh Patel', phone: '+91 8765432109', license: 'GJ02-2018-7654321', status: 'active', rating: 4.5, totalTrips: 89 },
        { id: '3', name: 'Mahesh Bhai', phone: '+91 7654321098', license: 'GJ03-2020-9876543', status: 'on_leave', rating: 4.9, totalTrips: 210 },
      ];
      setDrivers(mockDrivers);
      
      // In real implementation:
      // const res = await axios.get('/admin/drivers');
      // setDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.license.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Drivers Management</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage driver profiles, licenses, and assignments.</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg">
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or license..."
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
                <th className="p-4 font-bold">Driver Name</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">License No.</th>
                <th className="p-4 font-bold">Performance</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredDrivers.map(driver => (
                <tr key={driver.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                        {driver.name.charAt(0)}
                      </div>
                      <span className="font-bold text-black dark:text-white">{driver.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-medium">{driver.phone}</td>
                  <td className="p-4 font-mono text-gray-600 dark:text-gray-400">{driver.license}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="font-bold text-black dark:text-white">{driver.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{driver.totalTrips} trips</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                      driver.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {driver.status.replace('_', ' ')}
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
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No drivers found matching your search.
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
