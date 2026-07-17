'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { Camera, User, Mail, Phone, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/upload/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      const fullAvatarUrl = `http://localhost:5000${data.avatar}`;
      setAvatar(fullAvatarUrl);
      alert('Avatar updated successfully!');
      // In a real app, we'd update AuthContext user object here too
    } catch (error) {
      console.error(error);
      alert('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return <div className="p-8 font-bold">Loading profile...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>My Profile</h1>
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Manage your personal details and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Avatar Card */}
        <div className="rounded-3xl border p-8 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="relative group mb-6">
            <div className="w-40 h-40 rounded-full border-4 overflow-hidden relative" style={{ borderColor: 'var(--foreground)' }}>
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
              
              <div 
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={32} className="text-white mb-2" />
                <span className="text-white font-bold text-sm">{uploading ? 'Uploading...' : 'Change Photo'}</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
          
          <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>{user.name}</h2>
          <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--muted)' }}>{user.role}</p>
          
          <div className="mt-8 w-full p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: 'var(--section-alt)' }}>
            <span className="font-bold flex items-center gap-2"><Shield size={18} className="text-green-500" /> Account Status</span>
            <span className="font-black text-green-500">Verified</span>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2 rounded-3xl border p-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <h3 className="text-xl font-black mb-6 border-b pb-4" style={{ color: 'var(--foreground)', borderColor: 'var(--card-border)' }}>Personal Information</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Full Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" defaultValue={user.name} className="w-full pl-12 pr-4 py-3 rounded-xl font-bold outline-none border transition-colors focus:border-black dark:focus:border-white" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'transparent', color: 'var(--foreground)' }} />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Email Address</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" defaultValue={user.email} disabled className="w-full pl-12 pr-4 py-3 rounded-xl font-bold outline-none opacity-60" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }} />
                </div>
                <p className="text-xs font-medium mt-2 text-gray-500">Email cannot be changed.</p>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Phone Number</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" defaultValue={user.phone} placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-3 rounded-xl font-bold outline-none border transition-colors focus:border-black dark:focus:border-white" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'transparent', color: 'var(--foreground)' }} />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t mt-8" style={{ borderColor: 'var(--card-border)' }}>
              <button type="button" className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-xl font-bold hover:opacity-90 transition">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
