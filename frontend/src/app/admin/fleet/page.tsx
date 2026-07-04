'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Bus, User as DriverIcon, Plus } from 'lucide-react';

export default function FleetManagement() {
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('/drivers');
      setDrivers(res.data);
    } catch (err) {
      console.error('Failed to fetch drivers', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-black">Fleet & Driver Management</h2>
          <p className="text-gray-500 font-medium">Manage your vehicles, drivers, and assignments.</p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg flex items-center gap-2"><DriverIcon /> Registered Drivers</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">License</th>
              <th className="p-4 font-bold">Phone</th>
              <th className="p-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold">{driver.name}</td>
                <td className="p-4 text-gray-600">{driver.license}</td>
                <td className="p-4 text-gray-600">{driver.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${driver.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {driver.status}
                  </span>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-gray-500 font-bold">No drivers found. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
