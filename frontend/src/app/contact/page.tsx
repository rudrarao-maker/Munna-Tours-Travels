'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Contact Us</h1>
          <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Have a question or want to book a custom tour? We'd love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="p-10 md:p-12 rounded-3xl"
               style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
            <h2 className="text-3xl font-black mb-8 tracking-tight" style={{ color: 'var(--foreground)' }}>Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 tracking-wider" style={{ color: 'var(--muted)' }}>First Name</label>
                  <input type="text" className="w-full px-4 py-4 rounded-xl font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                         placeholder="John" 
                         style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 tracking-wider" style={{ color: 'var(--muted)' }}>Last Name</label>
                  <input type="text" className="w-full px-4 py-4 rounded-xl font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                         placeholder="Doe" 
                         style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2 tracking-wider" style={{ color: 'var(--muted)' }}>Email Address</label>
                <input type="email" className="w-full px-4 py-4 rounded-xl font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                       placeholder="john@example.com" 
                       style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }} />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase mb-2 tracking-wider" style={{ color: 'var(--muted)' }}>Message</label>
                <textarea rows={5} className="w-full px-4 py-4 rounded-xl font-bold focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition resize-none" 
                          placeholder="How can we help you?" 
                          style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', border: '1px solid var(--card-border)' }}></textarea>
              </div>
              <button type="button" className="w-full bg-black text-white dark:bg-white dark:text-black font-black text-lg py-5 rounded-2xl hover:opacity-90 transition shadow-lg mt-4">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="p-10 rounded-3xl"
                 style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
              <h2 className="text-2xl font-black mb-8" style={{ color: 'var(--foreground)' }}>Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 mr-5 shadow-md">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1" style={{ color: 'var(--foreground)' }}>Head Office</h3>
                    <p className="font-medium" style={{ color: 'var(--muted)' }}>123 Travel Boulevard, Business District<br/>Mumbai, Maharashtra 400001, India</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 mr-5 shadow-md">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1" style={{ color: 'var(--foreground)' }}>Phone</h3>
                    <p className="font-medium" style={{ color: 'var(--muted)' }}>+91 98765 43210 (24/7 Support)<br/>+91 98765 43211 (Bookings)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center shrink-0 mr-5 shadow-md">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg mb-1" style={{ color: 'var(--foreground)' }}>Email</h3>
                    <p className="font-medium" style={{ color: 'var(--muted)' }}>support@munnatravels.com<br/>bookings@munnatravels.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Gradient Map Placeholder */}
            <div className="rounded-3xl p-2 h-[300px] relative overflow-hidden"
                 style={{ border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black dark:from-neutral-800 dark:to-neutral-950 opacity-90" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-xl font-black flex items-center text-lg z-10 border border-gray-100">
                  <MapPin className="mr-2" /> Munna Travels HQ
                </div>
                <p className="text-white/60 font-bold mt-4 text-sm tracking-widest uppercase">Mumbai Hub</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
