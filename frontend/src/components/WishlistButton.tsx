'use client';

import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  itemType: 'route' | 'hotel';
  itemId: string;
}

export default function WishlistButton({ itemType, itemId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && token) {
      checkWishlist();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const checkWishlist = async () => {
    try {
      const res = await axios.get('/wishlist');
      const wishlisted = res.data.some((item: any) => 
        item.itemType === itemType && 
        (itemType === 'route' ? item.routeId === itemId : item.hotelId === itemId)
      );
      setIsWishlisted(wishlisted);
    } catch (error) {
      console.error('Failed to check wishlist status', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/wishlist/toggle', {
        itemType,
        ...(itemType === 'route' ? { routeId: itemId } : { hotelId: itemId })
      });
      setIsWishlisted(res.data.isWishlisted);
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      alert('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all ${
        isWishlisted 
          ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30' 
          : 'bg-black/50 border-white/20 text-white hover:bg-black/70'
      }`}
    >
      <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
    </button>
  );
}
