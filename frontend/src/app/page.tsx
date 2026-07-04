'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, MapPin, Calendar, Navigation, Shield, Clock, Heart, ArrowRight, ArrowRightLeft, Bus, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')" }} 
        />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white font-bold tracking-widest text-sm uppercase mb-6"
          >
            Premium Intercity Travel
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter leading-tight"
          >
            Journey Beyond <br className="hidden md:block"/> Boundaries
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 drop-shadow-lg font-medium max-w-2xl mx-auto"
          >
            India's most trusted luxury bus fleet. Experience safe, punctual, and highly comfortable travel across the country.
          </motion.p>
          
          {/* Bus Search Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-5xl mx-auto border border-gray-100 items-center relative"
          >
            <div className="flex-1 flex items-center bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-black transition-colors w-full">
              <MapPin className="text-gray-400 mr-3" size={24} />
              <input type="text" placeholder="Leaving From (e.g. Jodhpur)" className="bg-transparent outline-none w-full font-bold text-lg text-black placeholder-gray-400" />
            </div>
            
            <div className="hidden md:flex w-10 h-10 rounded-full bg-black text-white items-center justify-center z-10 absolute left-1/3 -ml-5 shadow-lg border-4 border-white cursor-pointer hover:bg-gray-800">
               <ArrowRightLeft size={16} />
            </div>

            <div className="flex-1 flex items-center bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-black transition-colors w-full pl-6 md:pl-8">
              <MapPin className="text-black mr-3" size={24} />
              <input type="text" placeholder="Going To (e.g. Ahmedabad)" className="bg-transparent outline-none w-full font-bold text-lg text-black placeholder-gray-400" />
            </div>
            
            <div className="flex-1 flex items-center bg-gray-50 p-4 rounded-2xl border border-transparent focus-within:border-black transition-colors w-full">
              <Calendar className="text-black mr-3" size={24} />
              <input type="date" className="bg-transparent outline-none w-full font-bold text-lg text-black" />
            </div>
            
            <button className="bg-black text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition flex items-center justify-center shadow-lg w-full md:w-auto shrink-0">
              <Search className="mr-2" size={22} />
              Request a Bus
            </button>
          </motion.div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Popular Bus Routes</h2>
              <p className="text-xl text-gray-500 font-medium">Book tickets on our most highly demanded and frequently serviced routes.</p>
            </div>
            <Link href="/routes" className="hidden md:flex items-center text-black font-black hover:underline group text-lg">
              View All Routes <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { from: 'Ahmedabad', to: 'Mumbai', price: '₹900', time: '8 hrs 30 mins', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop' },
              { from: 'Ahmedabad', to: 'Pune', price: '₹1200', time: '11 hrs 45 mins', image: 'https://images.unsplash.com/photo-1514498308433-ed3e100ce613?q=80&w=800&auto=format&fit=crop' },
              { from: 'Ahmedabad', to: 'Udaipur', price: '₹550', time: '5 hrs 15 mins', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2403f55?q=80&w=800&auto=format&fit=crop' },
            ].map((route, i) => (
              <Link href={`/routes?route=${route.from}-${route.to}`} key={i}>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] group relative h-96 cursor-pointer border border-gray-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                    style={{ backgroundImage: `url('${route.image}')` }}
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm flex items-center border border-white/20">
                      <Clock size={16} className="mr-2" /> {route.time}
                    </span>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-black text-white drop-shadow-md mb-1 flex items-center gap-2">
                        {route.from} <ArrowRight size={24} className="text-gray-400" /> {route.to}
                      </h3>
                      <p className="text-gray-300 font-bold text-sm tracking-widest uppercase">Available for Charter & Groups</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Starting from</p>
                      <p className="text-2xl font-black text-white">{route.price}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link href="/routes" className="inline-flex items-center text-black font-black hover:underline group text-lg">
              View All Routes <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Fleet Showcase */}
      <section className="py-24 bg-black text-white border-t border-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Our Premium Fleet</h2>
            <p className="text-xl text-gray-400 font-medium">Travel in absolute luxury. Our modern buses are designed for maximum comfort and safety.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sleeper */}
            <div className="group cursor-pointer">
              <div className="h-64 rounded-3xl bg-gray-800 mb-6 overflow-hidden relative border border-gray-700">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="text-2xl font-black mb-3">Volvo A/C Sleeper (2x1)</h3>
              <p className="text-gray-400 font-medium mb-4">Ultimate overnight comfort. Individual AC vents, reading lights, premium blankets, and charging points.</p>
            </div>
            
            {/* Semi-Sleeper */}
            <div className="group cursor-pointer">
              <div className="h-64 rounded-3xl bg-gray-800 mb-6 overflow-hidden relative border border-gray-700">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="text-2xl font-black mb-3">Scania Multi-Axle Semi-Sleeper</h3>
              <p className="text-gray-400 font-medium mb-4">Ergonomic reclining seats with calf support, expansive legroom, and air-suspension for a smooth ride.</p>
            </div>

            {/* Seater */}
            <div className="group cursor-pointer">
              <div className="h-64 rounded-3xl bg-gray-800 mb-6 overflow-hidden relative border border-gray-700">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1520105072000-f44fc083e5fd?q=80&w=800&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="text-2xl font-black mb-3">BharatBenz Premium Seater</h3>
              <p className="text-gray-400 font-medium mb-4">Perfect for short intercity hops. Push-back seats, ample luggage space, and top-tier safety standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Why Book With Munna Travels?</h2>
            <p className="text-xl text-gray-500 font-medium">We deliver unparalleled reliability and peace of mind on every journey.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group p-8 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors border border-gray-200">
                <Navigation size={32} className="text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-black mb-4">Live GPS Tracking</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Track your bus in real-time and share your location link with family members for safety.</p>
            </div>
            
            <div className="text-center group p-8 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors border border-gray-200">
                <Clock size={32} className="text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-black mb-4">Flexible Scheduling</h3>
              <p className="text-gray-500 font-medium leading-relaxed">You set the schedule. Our drivers accommodate your specific itinerary and ensure prompt pickups and drop-offs.</p>
            </div>
            
            <div className="text-center group p-8 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors border border-gray-200">
                <Heart size={32} className="text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-black mb-4">Ultimate Comfort</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Fresh linens, deep-cleaned cabins, and sanitized blankets provided on all overnight sleeper routes.</p>
            </div>

            <div className="text-center group p-8 rounded-3xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors border border-gray-200">
                <Shield size={32} className="text-black group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-black text-black mb-4">Women's Safety</h3>
              <p className="text-gray-500 font-medium leading-relaxed">Special seat reservations for solo female travelers and verified professional driving staff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-16">What Our Passengers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-left relative shadow-sm hover:shadow-lg transition-shadow">
              <Bus className="absolute top-10 right-10 text-gray-100" size={80} strokeWidth={1} />
              <div className="flex text-black mb-6 relative z-10">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
              </div>
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8 relative z-10">
                "I travel frequently between Jaipur and Delhi for business. Munna Travels' Volvo sleeper is the only service where I actually get a full night's sleep. Spotlessly clean!"
              </p>
              <div className="flex items-center relative z-10">
                <div 
                  className="w-14 h-14 bg-gray-200 rounded-full mr-4 bg-cover bg-center border-2 border-white shadow-sm"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop')" }}
                />
                <div>
                  <h4 className="font-black text-black">Aarav Sharma</h4>
                  <p className="text-sm font-bold text-gray-500">Frequent Traveler</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-3xl border border-gray-100 text-left relative shadow-sm hover:shadow-lg transition-shadow">
              <Bus className="absolute top-10 right-10 text-gray-100" size={80} strokeWidth={1} />
              <div className="flex text-black mb-6 relative z-10">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
              </div>
              <p className="text-xl text-gray-700 font-medium leading-relaxed mb-8 relative z-10">
                "As a solo female traveler, the live GPS tracking and dedicated women's seats make me feel incredibly safe. The staff is highly professional and courteous."
              </p>
              <div className="flex items-center relative z-10">
                <div 
                  className="w-14 h-14 bg-gray-200 rounded-full mr-4 bg-cover bg-center border-2 border-white shadow-sm"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop')" }}
                />
                <div>
                  <h4 className="font-black text-black">Priya Desai</h4>
                  <p className="text-sm font-bold text-gray-500">Ahmedabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs & Guides */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Transit Tips & Guides</h2>
            <p className="text-xl text-gray-500 font-medium">Make the most of your road journey with our expert travel advice.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Travel Blogs */}
            <div className="group cursor-pointer">
              <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=600&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-xs font-black tracking-widest text-blue-600 uppercase mb-2 block">Highway Eats</span>
              <h3 className="text-lg font-black text-black group-hover:underline leading-tight">Top 5 Highway Dhabas on the Delhi-Jaipur Route</h3>
            </div>

            {/* Travel Tips */}
            <div className="group cursor-pointer">
              <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553531580-652231dae097?q=80&w=600&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-xs font-black tracking-widest text-green-600 uppercase mb-2 block">Travel Tips</span>
              <h3 className="text-lg font-black text-black group-hover:underline leading-tight">How to Pack Smart for an Overnight Bus Journey</h3>
            </div>

            {/* Destination Guides */}
            <div className="group cursor-pointer">
              <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-xs font-black tracking-widest text-orange-600 uppercase mb-2 block">City Guides</span>
              <h3 className="text-lg font-black text-black group-hover:underline leading-tight">Navigating Udaipur: Local Transport Guide</h3>
            </div>

            {/* Festival Guides */}
            <div className="group cursor-pointer">
              <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=600&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-xs font-black tracking-widest text-purple-600 uppercase mb-2 block">Festival Rush</span>
              <h3 className="text-lg font-black text-black group-hover:underline leading-tight">Booking Tickets During Diwali: A Survival Guide</h3>
            </div>

            {/* Adventure Blogs */}
            <div className="group cursor-pointer">
              <div className="h-48 rounded-2xl bg-gray-200 mb-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=600&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <span className="text-xs font-black tracking-widest text-red-600 uppercase mb-2 block">Safety First</span>
              <h3 className="text-lg font-black text-black group-hover:underline leading-tight">Why Our Fleet Maintenance Leads the Industry</h3>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/blog" className="inline-flex items-center font-black text-black border-2 border-black px-8 py-3 rounded-xl hover:bg-black hover:text-white transition-colors">
               Read All Articles <ArrowRight className="ml-2" size={20} />
             </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to hit the road?</h2>
          <p className="text-xl text-gray-400 font-medium mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied groups and travelers. Book your premium charter bus today and experience the difference in quality and comfort.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-black px-10 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition shadow-lg">
              Request Charter Quote
            </button>
            <button className="border-2 border-gray-700 text-white px-10 py-4 rounded-xl font-black text-lg hover:border-white transition">
              Track My Bus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
