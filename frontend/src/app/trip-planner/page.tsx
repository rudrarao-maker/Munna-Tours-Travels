'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Calendar, Users, Wallet, Compass, Clock, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import axios from '@/lib/axios';

type Activity = { time: string; activity: string; location: string };
type DayPlan = { day: number; title: string; activities: Activity[] };
type TripPlan = {
  title: string;
  summary: string;
  days: DayPlan[];
  estimatedCost: string;
  tips: string[];
};

export default function TripPlannerPage() {
  const [form, setForm] = useState({
    destination: '',
    days: '3',
    travelers: '4',
    interests: '',
    budget: 'moderate',
  });
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);
    try {
      const res = await axios.post('/ai/trip-plan', form);
      setPlan(res.data);
    } catch (err) {
      console.error('Failed to generate trip plan', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen pt-24">
      {/* Hero */}
      <div className="bg-black text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles size={24} />
            </div>
            <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">AI Powered</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">AI Trip Planner</h1>
          <p className="text-xl text-white/60 font-medium max-w-2xl">
            Tell us where you want to go, and our AI will craft the perfect day-by-day itinerary for your group trip.
          </p>
        </div>
      </div>

      {/* Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <form onSubmit={handleGenerate} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase mb-2">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    required type="text" placeholder="e.g. Goa, Manali, Varanasi"
                    value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase mb-2">Number of Days</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={form.days} onChange={e => setForm({ ...form, days: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase mb-2">Travelers</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text" placeholder="e.g. 4 friends, family of 6"
                    value={form.travelers} onChange={e => setForm({ ...form, travelers: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 uppercase mb-2">Budget Level</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition appearance-none"
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-600 uppercase mb-2">Interests (Optional)</label>
              <input
                type="text" placeholder="e.g. temples, beaches, adventure sports, local food, photography"
                value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-4 font-bold text-black focus:border-black focus:ring-1 focus:ring-black outline-none transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gray-800 transition flex items-center justify-center gap-3 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={22} className="animate-spin" /> Generating Your Plan...</>
              ) : (
                <><Sparkles size={22} /> Generate AI Trip Plan</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {plan && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pb-24"
          >
            <div className="container mx-auto px-4 max-w-5xl">
              {/* Header */}
              <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-3xl p-8 md:p-10 mb-8 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Compass size={20} className="text-purple-400" />
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Your Custom Itinerary</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2">{plan.title}</h2>
                <p className="text-white/60 font-medium text-lg">{plan.summary}</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">
                    💰 Est. Cost: {plan.estimatedCost}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/10">
                    📅 {plan.days.length} Days
                  </span>
                </div>
              </div>

              {/* Day-by-Day */}
              <div className="space-y-6">
                {plan.days.map((day, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black text-sm">
                        {day.day}
                      </div>
                      <h3 className="text-lg font-black text-black">{day.title}</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {day.activities.map((act, j) => (
                        <div key={j} className="flex items-start gap-4">
                          <div className="flex items-center gap-2 shrink-0 w-24">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-500">{act.time}</span>
                          </div>
                          <div>
                            <p className="font-bold text-black">{act.activity}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {act.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              {plan.tips && plan.tips.length > 0 && (
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h3 className="font-black text-black flex items-center gap-2 mb-4">
                    <Lightbulb size={20} className="text-amber-500" /> Travel Tips
                  </h3>
                  <ul className="space-y-2">
                    {plan.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                        <ArrowRight size={14} className="text-amber-500 mt-0.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 bg-black text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">Love this plan?</h3>
                  <p className="text-white/60 font-medium">Book a Munna Travels charter bus for this trip now.</p>
                </div>
                <a href="/routes" className="bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-gray-100 transition shrink-0">
                  Book Now →
                </a>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
