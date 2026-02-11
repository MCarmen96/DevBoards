'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  initialCount?: number;
  showCount?: boolean;
}

export function FollowButton({
  userId,
  initialFollowing = false,
  initialCount = 0,
  showCount = false,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Verificar estado inicial
  useEffect(() => {
    if (session?.user?.id && session.user.id !== userId) {
      checkFollowStatus();
    }
  }, [session, userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`);
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following);
        setCount(data.followersCount);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.id === userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: following ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following);
        setCount(data.followersCount);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  // No mostrar el botón si es el propio usuario
  if (session?.user?.id === userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-1">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`flex-1 h-10 rounded-lg font-bold text-sm transition-colors disabled:opacity-50 ${
          following 
            ? 'bg-gray-200 dark:bg-[#1e2336] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#2a324b]' 
            : 'bg-[#0d33f2] text-white hover:bg-[#0a29c9]'
        }`}
      >
        {loading ? '...' : following ? 'Siguiendo' : 'Seguir'}
      </button>
      {showCount && (
        <span className="text-sm text-[#909acb]">
          {count} seguidores
        </span>
      )}
    </div>
  );
}
