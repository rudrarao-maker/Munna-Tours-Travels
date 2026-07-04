'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Bus, Users, Utensils, Phone, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

type RouteData = {
  id: string;
  routeId: string;
  from: string;
  to: string;
  price: string;
  time: string;
  type: string;
  image: string;
};

export default function QuoteRequestPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    returnDate: '',
    passengers: '10 - 20 (Minibus)',
    busType: 'Volvo A/C Sleeper',
    mealType: 'No Meals (Water Only)',
    contactName: '',
    companyName: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/routes/${slug}`);
        setRoute(res.data);
      } catch (err) {
        console.error('Route not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24"><p className="text-xl font-bold">Loading route details...</p></div>;
  }

  if (!route) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
        <h1 className="text-4xl font-black mb-4 text-black">Route Not Found</h1>
        <p className="text-gray-500 mb-8 font-medium">The route you are looking for does not exist or has been removed.</p>
        <Link href="/routes" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
          Back to Routes
        </Link>
      </div>
    );
  }

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // 1. Save the quote/booking request
      const quoteRes = await axios.post('http://localhost:5000/api/quotes', {
        ...formData,
        routeId: route?.routeId,
        pickup: route?.from,
        dropoff: route?.to,
      });

      // 2. Create Razorpay Order (e.g. ₹500 Advance Deposit)
      const orderRes = await axios.post('http://localhost:5000/api/payments/create-order', {
        amount: 500, // 500 INR
        receipt: `receipt_${quoteRes.data.id}`
      });

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: 'rzp_test_mock123', // Demo Key
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'Munna Travels',
        description: 'Advance Booking Deposit',
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          // 4. Verify Payment on Success
          try {
            await axios.post('http://localhost:5000/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setIsSubmitted(true);
            setTimeout(() => {
              router.push('/routes');
            }, 3000);
          } catch (verifyErr) {
            console.error('Verification failed', verifyErr);
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: formData.contactName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#000000'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        alert('Payment Failed: ' + response.error.description);
        setSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Failed to process booking', err);
      alert('Error processing your request.');
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full mx-4"
        >
          <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-black text-black mb-4">Quote Requested!</h2>
          <p className="text-gray-500 font-medium mb-8">We have received your charter request for <strong>{route.from} to {route.to}</strong>. Our team will contact you within 2 hours with a detailed quote.</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="h-full bg-black"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <button onClick={() => router.back()} className="flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition">
          <ArrowLeft size={16} className="mr-2" /> Back to Routes
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          
          {/* Header Banner */}
          <div className="h-64 relative">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${route.image}')` }} />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-widest border border-white/30 mb-4">
                Charter Booking Request
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                {route.from} <ArrowRight size={32} className="text-gray-300" /> {route.to}
              </h1>
              <p className="text-gray-300 font-medium mt-4 max-w-xl">
                Fill out the details below to receive a personalized quote for your group trip.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            
            {/* Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <MapPin className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold text-gray-500 uppercase">Distance</p>
                <p className="font-black text-black">{route.time}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <Bus className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold text-gray-500 uppercase">Standard Fleet</p>
                <p className="font-black text-black truncate">{route.type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <Users className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold text-gray-500 uppercase">Min Capacity</p>
                <p className="font-black text-black">15 Persons</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <Clock className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-xs font-bold text-gray-500 uppercase">Est. Starting Price</p>
                <p className="font-black text-green-600">{route.price}/seat</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Route Map"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8'}&origin=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}&mode=driving`}
              />
            </div>

            {/* WhatsApp Booking CTA */}
            <div className="mb-12 bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-black text-black text-lg">Book via WhatsApp</h4>
                  <p className="text-sm text-gray-600 font-medium">Instant response • No forms needed</p>
                </div>
              </div>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Munna Travels! I want to book a bus from ${route.from} to ${route.to}. Route: ${route.routeId}. Please share the quote.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-3 rounded-xl font-black hover:bg-green-600 transition shadow-md shrink-0"
              >
                Chat on WhatsApp →
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Trip Details */}
              <div>
                <h3 className="text-2xl font-black text-black mb-6 flex items-center border-b border-gray-100 pb-4">
                  1. Trip Requirements
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Journey Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Return Date (Optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input type="date" value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Total Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select value={formData.passengers} onChange={e => setFormData({...formData, passengers: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                        <option>10 - 20 (Minibus)</option>
                        <option>20 - 35 (Mid-size)</option>
                        <option>35 - 50 (Full Coach)</option>
                        <option>50+ (Multiple Buses)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Bus Preference</label>
                    <div className="relative">
                      <Bus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select value={formData.busType} onChange={e => setFormData({...formData, busType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                        <option>Volvo A/C Sleeper</option>
                        <option>Volvo A/C Seater</option>
                        <option>Scania Multi-Axle</option>
                        <option>Non-A/C Standard</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Meal Type Preference</label>
                    <div className="relative">
                      <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none">
                        <option>No Meals (Water Only)</option>
                        <option>Snacks & Beverages</option>
                        <option>Full Meals (Veg)</option>
                        <option>Full Meals (Non-Veg)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-black text-black mb-6 flex items-center border-b border-gray-100 pb-4">
                  2. Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Full Name</label>
                    <input required type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Company / Group Name (Optional)</label>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} placeholder="Tech Corp Ltd." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Special Notes / Requirements</label>
                <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} placeholder="Any specific pickup points, extra luggage, or special assistance needed?" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition resize-none"></textarea>
              </div>

              {/* Submit Section */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500 font-bold max-w-sm">
                  By submitting this request, you agree to our <a href="#" className="text-black underline">Terms of Service</a> and <a href="#" className="text-black underline">Privacy Policy</a>.
                </p>
                <button disabled={submitting} type="submit" className="bg-black text-white px-10 py-4 rounded-xl font-black hover:bg-gray-800 transition flex items-center shadow-lg disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Quote Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
