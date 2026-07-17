'use client';

import { Award, Heart, Shield, Users, Map, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Premium Hero */}
      <div className="relative py-32 text-center overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] z-10" />
          <div 
            className="w-full h-full bg-cover bg-center opacity-20 dark:opacity-10" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')" }} 
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 max-w-4xl pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-widest mb-6 border"
            style={{ backgroundColor: 'var(--section-alt)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
          >
            Since 2010
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
            style={{ color: 'var(--foreground)' }}
          >
            Redefining Intercity Travel
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Founded with a passion for discovery, we are dedicated to curating premium, unforgettable travel experiences. Your Journey, Our Responsibility.
          </motion.p>
        </div>
      </div>

      {/* Animated Stats */}
      <div className="py-20 -mt-10 relative z-30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '15+', label: 'Years Experience' },
              { num: '100k+', label: 'Happy Travelers' },
              { num: '50+', label: 'Destinations' },
              { num: '150+', label: 'Premium Fleet' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-card)' }}
              >
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--foreground)' }}>{stat.num}</div>
                <div className="font-bold uppercase tracking-wider text-xs md:text-sm" style={{ color: 'var(--muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story / Timeline */}
      <div className="py-24" style={{ backgroundColor: 'var(--section-alt)' }}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6" style={{ color: 'var(--foreground)' }}>The Journey So Far</h2>
              <p className="text-lg font-medium leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                What started as a single minibus operating between Ahmedabad and Pune has grown into one of Western India's most trusted luxury charter fleets.
              </p>
              <div className="space-y-6">
                {[
                  { year: '2010', text: 'Founded with a single 12-seater minibus.' },
                  { year: '2015', text: 'Introduced the first Volvo A/C Sleeper route.' },
                  { year: '2020', text: 'Expanded to over 50 destinations across 5 states.' },
                  { year: '2026', text: 'Launched AI-powered trip planning and live tracking.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="font-black text-xl w-16 shrink-0" style={{ color: 'var(--foreground)' }}>{item.year}</div>
                    <div className="w-1 bg-black/10 dark:bg-white/10 relative rounded-full">
                      <div className="absolute top-2 -left-1 w-3 h-3 bg-black dark:bg-white rounded-full" />
                    </div>
                    <div className="font-medium pt-1 pb-4" style={{ color: 'var(--muted)' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-[600px] rounded-3xl bg-cover bg-center border shadow-2xl" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop')", borderColor: 'var(--card-border)' }} />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Our Core Values</h2>
            <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>The principles that drive every mile we travel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Safety First', desc: 'Verified partners, speed governors, and 24/7 central tracking.' },
              { icon: Award, title: 'Premium Quality', desc: 'Handpicked luxury coaches maintained to the highest standards.' },
              { icon: Users, title: 'Expert Crew', desc: 'Highly trained dual-driver systems for all overnight journeys.' },
              { icon: Heart, title: 'Customer Love', desc: 'Every itinerary is carefully crafted to ensure unforgettable memories.' },
            ].map((val, i) => (
              <div key={i} className="text-center group p-8 rounded-3xl transition-all hover:-translate-y-2 border border-transparent hover:border-[var(--card-border)]"
                   style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="w-20 h-20 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:-rotate-3 transition-transform shadow-lg">
                  <val.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--foreground)' }}>{val.title}</h3>
                <p className="font-medium" style={{ color: 'var(--muted)' }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
