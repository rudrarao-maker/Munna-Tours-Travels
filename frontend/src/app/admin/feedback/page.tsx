'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, Minus, TrendingUp, Sparkles, Reply } from 'lucide-react';
import axios from '@/lib/axios';

export default function FeedbackSentimentPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('/feedback');
      const statsRes = await axios.get('/feedback/analytics');
      
      setData({
        feedbacks: res.data.feedbacks,
        stats: statsRes.data
      });
    } catch {
      // Fallback Demo Data
      setData({
        feedbacks: [
          { id: '1', rating: 5, comment: 'Amazing trip! The Volvo bus was very comfortable and the driver was professional.', sentimentLabel: 'positive', sentimentScore: 0.9, createdAt: '2026-07-16T10:00:00Z', user: { name: 'Rahul Desai' }, adminResponse: null },
          { id: '2', rating: 2, comment: 'The AC was not working properly in the back seats. Needs maintenance.', sentimentLabel: 'negative', sentimentScore: -0.6, createdAt: '2026-07-15T14:30:00Z', user: { name: 'Priya Patel' }, adminResponse: 'We sincerely apologize. The AC has been serviced.' },
          { id: '3', rating: 4, comment: 'Good overall, but the rest stop food options were limited.', sentimentLabel: 'neutral', sentimentScore: 0.1, createdAt: '2026-07-14T09:15:00Z', user: { name: 'Amit Shah' }, adminResponse: null },
        ],
        stats: {
          totalFeedback: 145,
          avgRating: 4.2,
          avgSentiment: 0.65,
          distribution: { positive: 98, neutral: 32, negative: 15 }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="font-bold">Loading Feedback...</div>;

  const sentimentIcon = (label: string) => {
    if (label === 'positive') return <ThumbsUp size={16} className="text-green-500" />;
    if (label === 'negative') return <ThumbsDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
          AI Sentiment & Feedback <Sparkles size={24} className="text-blue-500" />
        </h1>
        <p className="font-medium" style={{ color: 'var(--muted)' }}>Automatically analyze customer reviews using Gemini AI.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Average Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>{data.stats.avgRating.toFixed(1)}</p>
            <Star size={20} fill="#f59e0b" stroke="#f59e0b" />
          </div>
        </div>
        
        <div className="p-6 rounded-3xl flex justify-between items-center" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div>
            <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Positive</h3>
            <p className="text-3xl font-black text-green-500">{data.stats.distribution.positive}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600"><ThumbsUp size={20} /></div>
        </div>

        <div className="p-6 rounded-3xl flex justify-between items-center" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div>
            <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Neutral</h3>
            <p className="text-3xl font-black text-gray-500">{data.stats.distribution.neutral}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Minus size={20} /></div>
        </div>

        <div className="p-6 rounded-3xl flex justify-between items-center" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <div>
            <h3 className="text-sm font-bold opacity-60 mb-1" style={{ color: 'var(--muted)' }}>Negative</h3>
            <p className="text-3xl font-black text-red-500">{data.stats.distribution.negative}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600"><ThumbsDown size={20} /></div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="rounded-3xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>Recent Reviews</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
          {data.feedbacks.map((item: any) => (
            <div key={item.id} className="p-6 transition hover:bg-black/5 dark:hover:bg-white/5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white bg-blue-500 shrink-0">
                    {item.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{item.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < item.rating ? '#f59e0b' : 'none'} stroke={i < item.rating ? '#f59e0b' : 'var(--muted)'} />
                      ))}
                      <span className="text-xs ml-2 font-medium" style={{ color: 'var(--muted)' }}>{item.createdAt.split('T')[0]}</span>
                    </div>
                  </div>
                </div>
                
                {/* AI Sentiment Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black capitalize ${
                  item.sentimentLabel === 'positive' ? 'bg-green-100 text-green-700' :
                  item.sentimentLabel === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  <Sparkles size={12} /> {item.sentimentLabel} ({(item.sentimentScore * 100).toFixed(0)}%)
                </div>
              </div>
              
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--foreground)' }}>"{item.comment}"</p>

              {/* Admin Response */}
              {item.adminResponse ? (
                <div className="ml-14 p-4 rounded-xl relative before:absolute before:left-[-20px] before:top-4 before:w-[20px] before:h-0.5" 
                     style={{ backgroundColor: 'var(--section-alt)', '--tw-before-bg': 'var(--card-border)' } as any}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Admin Response</p>
                  <p className="text-sm" style={{ color: 'var(--foreground)' }}>{item.adminResponse}</p>
                </div>
              ) : (
                <button className="ml-14 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
                        style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}>
                  <Reply size={14} /> Reply
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
