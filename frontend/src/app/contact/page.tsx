'use client';

import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">Have a question or want to book a custom tour? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-3xl font-black mb-8 text-black tracking-tight">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors mt-2">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <MapPin />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Head Office</h3>
                    <p className="text-gray-600">123 Travel Boulevard, Business District<br/>Mumbai, Maharashtra 400001, India</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Phone />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210 (24/7 Support)<br/>+91 98765 43211 (Bookings)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Mail />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@munnatravels.com<br/>bookings@munnatravels.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Map */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border h-[300px] relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop" 
                alt="Map location placeholder" 
                className="w-full h-full object-cover rounded-xl opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg font-bold text-blue-600 flex items-center">
                  <MapPin className="mr-2" /> Munna Travels HQ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
