'use client';

import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight">Platform Settings</h2>
          <p className="text-gray-500 font-medium mt-1">Configure global platform preferences.</p>
        </div>
        <button className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-md flex items-center">
          <Save size={20} className="mr-2" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 space-y-6">
          <h3 className="text-xl font-black text-black border-b border-gray-100 pb-4">General Details</h3>
          
          <div>
            <label className="block text-sm font-bold text-black mb-2">Platform Name</label>
            <input 
              type="text" 
              defaultValue="Munna Tours & Travels"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Support Email</label>
            <input 
              type="email" 
              defaultValue="support@munna.com"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Support Phone</label>
            <input 
              type="tel" 
              defaultValue="+91 98765 43210"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 space-y-6">
          <h3 className="text-xl font-black text-black border-b border-gray-100 pb-4">Display Preferences</h3>
          
          <div>
            <label className="block text-sm font-bold text-black mb-2">Default Currency</label>
            <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold cursor-pointer">
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Theme Envorcement</label>
            <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition text-black font-bold cursor-pointer">
              <option>Light (Default)</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </div>
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-black cursor-pointer rounded border-gray-300" />
              <span className="text-sm font-bold text-black">Enable AI Chatbot widget globally</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
