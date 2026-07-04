'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Car } from 'lucide-react';
import api from '@/lib/axios';

type VehicleData = {
  id?: string;
  name: string;
  type: string;
  capacity: number;
  registration: string;
  status: string;
};

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', type: '', capacity: 0, registration: '', status: 'active'
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAddForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', type: '', capacity: 0, registration: '', status: 'active' });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (vehicle: VehicleData) => {
    setIsEditing(true);
    setEditId(vehicle.id!);
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      registration: vehicle.registration,
      status: vehicle.status,
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
      const payload = {
        ...formData,
        capacity: Number(formData.capacity)
      };

      if (isEditing && editId) {
        await api.put(`/vehicles/${editId}`, payload);
      } else {
        await api.post('/vehicles', payload);
      }
      handleCloseForm();
      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert(isEditing ? "Failed to update vehicle" : "Failed to add vehicle");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-black tracking-tight">Vehicle Management</h1>
        <button 
          onClick={isFormOpen ? handleCloseForm : handleOpenAddForm}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center shadow-lg"
        >
          {isFormOpen ? 'Cancel' : <><Plus size={20} className="mr-2" /> Add Vehicle</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-black mb-4">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input required type="text" placeholder="Vehicle Name (e.g. Volvo 9400)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="text" placeholder="Vehicle Type (e.g. Sleeper)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
            <input required type="number" placeholder="Capacity (e.g. 40)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} />
            <input required type="text" placeholder="Registration (e.g. GJ-01-AB-1234)" className="p-3 border rounded-xl outline-none focus:border-black" value={formData.registration} onChange={e => setFormData({...formData, registration: e.target.value})} disabled={isEditing} />
            <select className="p-3 border rounded-xl outline-none focus:border-black" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <div className="col-span-1 flex justify-end">
              <button type="submit" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[60vh]">
        {loading ? (
          <p className="text-gray-500 font-bold">Loading vehicles...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-4 font-bold">Vehicle</th>
                  <th className="p-4 font-bold">Registration</th>
                  <th className="p-4 font-bold">Capacity</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-black text-black flex items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                        <Car size={16} className="text-gray-500" />
                      </div>
                      <div>
                        {vehicle.name}
                        <div className="text-xs text-gray-500 font-normal">{vehicle.type}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-bold">{vehicle.registration}</td>
                    <td className="p-4 text-gray-600 font-bold">{vehicle.capacity} pax</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        vehicle.status === 'active' ? 'bg-green-100 text-green-700' :
                        vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vehicle.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => handleOpenEditForm(vehicle)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(vehicle.id!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vehicles.length === 0 && <p className="text-center text-gray-500 p-8 font-bold">No vehicles found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
