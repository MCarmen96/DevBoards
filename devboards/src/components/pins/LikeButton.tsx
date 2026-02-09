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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
        liked
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <svg
        className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-sm font-medium">{count}</span>
    </button>
  );
}
