'use client';

import { useState } from 'react';
import { Bell, Send, Users, Smartphone, Mail, Globe } from 'lucide-react';
import axios from '@/lib/axios';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('promo');
  const [target, setTarget] = useState('all');
  const [channel, setChannel] = useState('in-app');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return alert('Title and message are required');

    setLoading(true);
    try {
      await axios.post('/notifications/broadcast', {
        title,
        message,
        type,
        targetRole: target === 'all' ? undefined : target,
        channel
      });
      alert('Notification sent successfully!');
      setTitle('');
      setMessage('');
    } catch {
      alert('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--foreground)' }}>Notifications</h1>
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Broadcast messages, alerts, and promotions to your users.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSend} className="p-6 md:p-8 rounded-3xl border shadow-sm space-y-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Message Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                     placeholder="e.g. 50% OFF Diwali Special!"
                     className="w-full px-4 py-3 rounded-xl font-bold outline-none"
                     style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Message Content</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                        placeholder="Write your message here..."
                        className="w-full px-4 py-3 rounded-xl font-medium outline-none resize-none"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Notification Type</label>
                <select value={type} onChange={e => setType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl font-bold outline-none"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                  <option value="promo">Promotion</option>
                  <option value="alert">Alert / Emergency</option>
                  <option value="info">General Info</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--muted)' }}>Target Audience</label>
                <select value={target} onChange={e => setTarget(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl font-bold outline-none"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}>
                  <option value="all">All Users</option>
                  <option value="customer">Customers Only</option>
                  <option value="driver">Drivers Only</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
              <Send size={20} /> {loading ? 'Sending...' : 'Broadcast Notification'}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <h3 className="font-black mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}><Globe size={18} /> Delivery Channels</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className={channel === 'in-app' ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>In-App</span>
                </div>
                <input type="radio" name="channel" checked={channel === 'in-app'} onChange={() => setChannel('in-app')} className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <Mail size={18} className={channel === 'email' ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Email Only</span>
                </div>
                <input type="radio" name="channel" checked={channel === 'email'} onChange={() => setChannel('email')} className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ border: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-3">
                  <Bell size={18} className={channel === 'all' ? 'text-blue-500' : 'text-gray-400'} />
                  <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>Both</span>
                </div>
                <input type="radio" name="channel" checked={channel === 'all'} onChange={() => setChannel('all')} className="w-4 h-4" />
              </label>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--section-alt)' }}>
            <h3 className="font-black mb-2 flex items-center gap-2" style={{ color: 'var(--foreground)' }}><Users size={18} /> Estimated Reach</h3>
            <p className="text-3xl font-black text-blue-500 mb-1">
              {target === 'all' ? '1,500+' : target === 'customer' ? '1,450' : '50'}
            </p>
            <p className="text-xs font-bold" style={{ color: 'var(--muted)' }}>Users will receive this message.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
