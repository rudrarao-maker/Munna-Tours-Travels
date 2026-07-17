'use client';

import { useState } from 'react';
import { Bot, Map, Calendar, Users, Sparkles, Navigation, List } from 'lucide-react';
import axios from '@/lib/axios';

export default function TripPlannerPage() {
  const [formData, setFormData] = useState({
    destination: '',
    days: '3',
    travelers: '5',
    interests: 'sightseeing, food, history'
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/ai/trip-plan', formData);
      setItinerary(res.data.days || res.data);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
      alert('Failed to generate itinerary. Using mock data for demo.');
      
      // Fallback Mock Data
      setItinerary([
        {
          day: 1,
          title: "Arrival and Local Culture",
          activities: [
            { time: "09:00 AM", description: "Arrive via TripNova Holidays Premium Coach" },
            { time: "12:00 PM", description: "Check-in and Authentic Local Lunch" },
            { time: "04:00 PM", description: "Heritage Walk in the Old City" }
          ]
        },
        {
          day: 2,
          title: "Monuments & Museums",
          activities: [
            { time: "10:00 AM", description: "Visit the Grand Palace" },
            { time: "02:00 PM", description: "Guided Museum Tour" },
            { time: "07:00 PM", description: "Dinner at a Rooftop Restaurant" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <Bot size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>AI Trip Planner</h1>
          <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>Let our AI generate a personalized daily itinerary for your next group trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Planner Form */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl border shadow-[0_8px_30px_rgb(0,0,0,0.12)] sticky top-32"
                 style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-2xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Trip Details</h2>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Destination</label>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="text" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} 
                           placeholder="e.g. Udaipur, Rajasthan" 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold outline-none border border-transparent focus:border-black dark:focus:border-white transition-colors"
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Duration (Days)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="number" min="1" max="14" value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})} 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold outline-none border border-transparent focus:border-black dark:focus:border-white transition-colors"
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Group Size</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input required type="number" min="1" value={formData.travelers} onChange={e => setFormData({...formData, travelers: e.target.value})} 
                           className="w-full rounded-xl py-4 pl-12 pr-4 font-bold outline-none border border-transparent focus:border-black dark:focus:border-white transition-colors"
                           style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Interests (Comma separated)</label>
                  <textarea rows={2} value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} 
                            placeholder="e.g. History, Food, Nightlife" 
                            className="w-full rounded-xl py-4 px-4 font-bold outline-none border border-transparent focus:border-black dark:focus:border-white transition-colors resize-none"
                            style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)' }}></textarea>
                </div>
                <button type="submit" disabled={loading} 
                        className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl font-black text-lg hover:opacity-90 transition flex items-center justify-center shadow-lg disabled:opacity-50 mt-4">
                  {loading ? (
                    <><Sparkles className="animate-pulse mr-2" /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2" /> Generate Itinerary</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-7">
            {itinerary ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--foreground)' }}>Your Custom Itinerary</h2>
                  <button className="text-sm font-bold flex items-center border px-4 py-2 rounded-lg hover:opacity-80 transition"
                          style={{ borderColor: 'var(--card-border)', color: 'var(--foreground)', backgroundColor: 'var(--card-bg)' }}>
                    <List size={16} className="mr-2" /> Save Draft
                  </button>
                </div>

                {itinerary.map((day: any, idx: number) => (
                  <div key={idx} className="p-8 rounded-3xl border shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                       style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                    <div className="flex items-center mb-6 pb-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
                      <div className="w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex flex-col items-center justify-center mr-4 shrink-0 shadow-md">
                        <span className="text-xs uppercase font-bold opacity-80">Day</span>
                        <span className="text-xl font-black leading-none">{day.day}</span>
                      </div>
                      <h3 className="text-2xl font-black" style={{ color: 'var(--foreground)' }}>{day.title}</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {day.activities.map((act: any, aIdx: number) => (
                        <div key={aIdx} className="flex gap-4">
                          <div className="w-24 shrink-0 text-sm font-bold pt-1" style={{ color: 'var(--muted)' }}>
                            {act.time}
                          </div>
                          <div className="relative">
                            {/* Vertical Line */}
                            {aIdx !== day.activities.length - 1 && (
                              <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5" style={{ backgroundColor: 'var(--card-border)' }}></div>
                            )}
                            <div className="w-6 h-6 rounded-full border-4 flex items-center justify-center shrink-0 mt-0.5 z-10 relative" 
                                 style={{ backgroundColor: 'var(--background)', borderColor: 'var(--foreground)' }}>
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--foreground)' }}></div>
                            </div>
                          </div>
                          <div className="font-medium pt-0.5" style={{ color: 'var(--foreground)' }}>
                            {act.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] border border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center"
                   style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
                <Navigation size={48} className="mb-4 opacity-20" style={{ color: 'var(--foreground)' }} />
                <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)' }}>Ready to Plan?</h3>
                <p className="font-medium max-w-sm" style={{ color: 'var(--muted)' }}>Fill out the details on the left, and our AI will construct the perfect itinerary for your group.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
