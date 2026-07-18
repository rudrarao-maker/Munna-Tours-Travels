'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import axios from '@/lib/axios';
import { Star, Upload, X, MapPin, Send, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function RouteReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const routeId = resolvedParams.id;
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRouteAndReviews();
  }, [routeId]);

  const fetchRouteAndReviews = async () => {
    try {
      // Mock data for demo since backend might not have this specific route yet
      setRoute({ id: routeId, from: 'Ahmedabad', to: 'Pune' });
      setReviews([
        { id: '1', rating: 5, comment: 'Excellent journey, very comfortable seats and punctual departure.', user: { email: 'user@example.com' }, createdAt: '2026-07-15T10:00:00Z', images: '["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80"]' },
        { id: '2', rating: 4, comment: 'Good service but AC was a bit too cold.', user: { email: 'test@example.com' }, createdAt: '2026-07-10T14:30:00Z', images: '[]' }
      ]);
      
      // In real implementation:
      // const [routeRes, reviewsRes] = await Promise.all([
      //   axios.get(`/routes/${routeId}`),
      //   axios.get(`/reviews?routeId=${routeId}`)
      // ]);
      // setRoute(routeRes.data);
      // setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 3) {
        toast.error('Maximum 3 images allowed');
        return;
      }
      setImages([...images, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedImageUrls: string[] = [];

      // Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('files', img));
        const uploadRes = await axios.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImageUrls = uploadRes.data.urls;
      }

      // Submit review
      await axios.post('/reviews', {
        rating,
        comment,
        routeId,
        userId: user.id,
        images: uploadedImageUrls
      });

      toast.success('Review submitted successfully! Pending approval.');
      setRating(5);
      setComment('');
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
    ));
  };

  if (loading) return <div className="p-10 text-center">Loading reviews...</div>;

  return (
    <div className="bg-[var(--background)] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black mb-2 text-[var(--foreground)]">Passenger Reviews</h1>
          {route && (
            <p className="text-xl text-[var(--muted)] flex items-center justify-center gap-2 font-medium">
              <MapPin size={20} /> {route.from} to {route.to}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="md:col-span-1 bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-sm h-fit sticky top-24">
            <h2 className="text-xl font-black mb-4 text-[var(--foreground)]">Write a Review</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--muted)]">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star size={24} className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--muted)]">Your Experience</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--foreground)] focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none min-h-[120px] resize-none"
                  placeholder="Tell us about your journey..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--muted)]">Photos (Max 3)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={url} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <label className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--card-border)] cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition text-[var(--muted)]">
                      <ImageIcon size={20} className="mb-1" />
                      <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting || !user}
                className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
              </button>
              {!user && <p className="text-xs text-red-500 text-center mt-2 font-bold">Please login to review.</p>}
            </form>
          </div>

          {/* Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] text-[var(--muted)] font-bold">
                No reviews yet. Be the first to review this route!
              </div>
            ) : (
              reviews.map((review) => {
                const reviewImages = review.images ? JSON.parse(review.images) : [];
                return (
                  <div key={review.id} className="p-6 bg-[var(--card-bg)] rounded-3xl border border-[var(--card-border)] shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black">
                          {review.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-[var(--foreground)]">{review.user?.email || 'Anonymous'}</p>
                          <p className="text-xs font-bold text-[var(--muted)]">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <p className="text-[var(--foreground)] mb-4">{review.comment}</p>
                    
                    {reviewImages.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {reviewImages.map((img: string, idx: number) => (
                          <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition">
                            <Image src={img} alt="Review photo" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
