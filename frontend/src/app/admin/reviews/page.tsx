'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Star, Check, X, Trash2 } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews');
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await axios.put(`/reviews/${id}`, { status });
      fetchReviews();
    } catch (err) {
      console.error('Failed to update review', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await axios.delete(`/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-black">Reviews Management</h2>
        <p className="text-gray-500 font-medium">Approve, reject, or delete customer reviews.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-4 font-bold">Customer</th>
              <th className="p-4 font-bold">Route</th>
              <th className="p-4 font-bold">Rating</th>
              <th className="p-4 font-bold">Comment</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-sm">{review.user?.email || 'Unknown'}</td>
                <td className="p-4 text-gray-600 font-medium text-sm">
                  {review.route ? `${review.route.from} → ${review.route.to}` : 'N/A'}
                </td>
                <td className="p-4">
                  <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                </td>
                <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{review.comment || '—'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(review.id, 'Approved')}
                      className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleStatus(review.id, 'Rejected')}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500 font-bold">No reviews yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
