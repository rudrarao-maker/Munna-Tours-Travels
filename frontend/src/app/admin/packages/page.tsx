'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Plus, Search, Edit2, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PackagesManagement() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Use mock data for frontend scaffolding
      const mockPackages = [
        { id: '1', title: 'Kerala Backwaters Retreat', destination: 'Kerala, India', duration: '3N/4D', price: 15000, category: 'Honeymoon', status: 'active', featured: true },
        { id: '2', title: 'Goa Beach Party', destination: 'Goa, India', duration: '4N/5D', price: 12500, category: 'Friends', status: 'active', featured: false },
        { id: '3', title: 'Kashmir Valley Tour', destination: 'Jammu & Kashmir', duration: '5N/6D', price: 25000, category: 'Family', status: 'inactive', featured: false },
        { id: '4', title: 'Golden Triangle', destination: 'Delhi-Agra-Jaipur', duration: '6N/7D', price: 18000, category: 'Cultural', status: 'active', featured: true },
      ];
      setPackages(mockPackages);
      
      // In real implementation:
      // const res = await axios.get('/packages');
      // setPackages(res.data);
    } catch (err) {
      console.error('Failed to fetch packages', err);
      toast.error('Failed to load tour packages');
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: 'var(--foreground)' }}>Tour Packages</h1>
          <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage holiday packages, pricing, and itineraries.</p>
        </div>
        <button className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg">
          <Plus size={20} />
          Create Package
        </button>
      </div>

      <div className="bg-white dark:bg-[#171717] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#1a1a1a]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search packages by name or destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>
          <div className="flex gap-2">
             <select className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#262626] text-black dark:text-white focus:outline-none font-medium">
               <option value="all">All Categories</option>
               <option value="honeymoon">Honeymoon</option>
               <option value="family">Family</option>
               <option value="cultural">Cultural</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="p-4 font-bold">Package Details</th>
                <th className="p-4 font-bold">Duration</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Featured</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPackages.map(pkg => (
                <tr key={pkg.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-black dark:text-white mb-1">{pkg.title}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-2">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {pkg.destination}</span>
                      <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">{pkg.category}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium gap-1.5">
                      <Clock size={16} />
                      {pkg.duration}
                    </div>
                  </td>
                  <td className="p-4 font-black text-green-600 dark:text-green-400">
                    ₹{pkg.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                      pkg.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="p-4">
                     {pkg.featured ? (
                       <span className="text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-xs font-bold uppercase">Featured</span>
                     ) : (
                       <span className="text-gray-400">-</span>
                     )}
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
              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No packages found matching your search.
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
