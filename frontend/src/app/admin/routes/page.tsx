'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import api from '@/lib/axios';

type RouteData = {
  id?: string;
  routeId: string;
  from: string;
  to: string;
  price: string;
  time: string;
  type: string;
  image: string;
};

export default function RouteManagement() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    routeId: '', from: '', to: '', price: '', time: '', type: '', image: ''
  });

  const fetchRoutes = async () => {
    try {
      const res = await api.get('/routes');
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleOpenAddForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ routeId: '', from: '', to: '', price: '', time: '', type: '', image: '' });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (route: RouteData) => {
    setIsEditing(true);
    setEditId(route.id!);
    setFormData({
      routeId: route.routeId,
      from: route.from,
      to: route.to,
      price: route.price,
      time: route.time,
      type: route.type,
      image: route.image,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editId) {
        await api.put(`/routes/${editId}`, formData);
      } else {
        await api.post('/routes', formData);
      }
      handleCloseForm();
      fetchRoutes();
    } catch (err) {
      console.error(err);
      alert(isEditing ? "Failed to update route" : "Failed to add route");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await api.delete(`/routes/${id}`);
      fetchRoutes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete route");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-black tracking-tight">Route Management</h1>
        <button 
          onClick={isFormOpen ? handleCloseForm : handleOpenAddForm}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center shadow-lg"
        >
          {isFormOpen ? 'Cancel' : <><Plus size={20} className="mr-2" /> Add New Route</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-black mb-4">{isEditing ? 'Edit Route' : 'Add New Route'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Route ID (e.g. ahmedabad-pune)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.routeId} onChange={e => setFormData({...formData, routeId: e.target.value})} disabled={isEditing} />
            <input required type="text" placeholder="From (e.g. Ahmedabad)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})} />
            <input required type="text" placeholder="To (e.g. Pune)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} />
            <input required type="text" placeholder="Price (e.g. ₹900)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input required type="text" placeholder="Duration (e.g. 8 hrs 30 mins)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            <input required type="text" placeholder="Bus Type (e.g. Volvo A/C Sleeper)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
            <input required type="text" placeholder="Image URL" className="p-3 border rounded-xl outline-none focus:border-black col-span-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            <div className="col-span-2 flex justify-end">
              <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                {isEditing ? 'Update Route' : 'Save Route'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[60vh]">
        {loading ? (
          <p className="text-gray-500 font-bold">Loading routes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-4 font-bold">Route</th>
                  <th className="p-4 font-bold">Duration</th>
                  <th className="p-4 font-bold">Bus Type</th>
                  <th className="p-4 font-bold">Price</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-black text-black flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                        {route.image ? <img src={route.image} alt={route.to} className="w-full h-full object-cover" /> : <MapPin size={16} className="text-gray-500" />}
                      </div>
                      {route.from} to {route.to}
                    </td>
                    <td className="p-4 text-gray-600 font-bold">{route.time}</td>
                    <td className="p-4 text-gray-600 font-bold">{route.type}</td>
                    <td className="p-4 font-black text-green-600">{route.price}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => handleOpenEditForm(route)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(route.id!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {routes.length === 0 && <p className="text-center text-gray-500 p-8 font-bold">No routes found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
