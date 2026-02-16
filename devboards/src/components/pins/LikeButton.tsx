'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  pinId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ pinId, initialLiked, initialCount }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/pins/${pinId}/like`, {
        method: liked ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`btn btn-sm d-flex align-items-center gap-2 ${
        liked
          ? 'btn-outline-danger'
          : 'btn-outline-secondary'
      }`}
    >
      <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      <span>{count}</span>
    </button>
  );
}
