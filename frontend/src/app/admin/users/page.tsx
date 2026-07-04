'use client';

import { useState } from 'react';
import { ShieldAlert, Trash2, Search, MoreVertical } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', bookings: 3, joinDate: 'Jan 2026', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', bookings: 1, joinDate: 'Feb 2026', status: 'Active' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', bookings: 0, joinDate: 'Mar 2026', status: 'Blocked' },
  { id: 4, name: 'Demo User', email: 'user@munna.com', bookings: 5, joinDate: 'Jun 2026', status: 'Active' },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Customer Management</h2>
          <p className="text-gray-500 font-medium mt-1">View and manage registered customers.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all max-w-md mb-8">
          <Search size={20} className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search customers by name or email..."
            className="bg-transparent outline-none w-full text-black font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <th className="pb-4">Customer Info</th>
                <th className="pb-4">Bookings</th>
                <th className="pb-4">Joined</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0 text-sm hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div>
                      <p className="font-bold text-black">{user.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600 font-bold">{user.bookings}</td>
                  <td className="py-4 text-gray-600 font-medium">{user.joinDate}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-black text-white' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button title="Block User" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <ShieldAlert size={18} />
                      </button>
                      <button title="Delete User" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500 font-medium">
              No customers found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
