'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

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
    <div className="flex items-center gap-2">
      <Button
        onClick={handleFollow}
        disabled={loading}
        variant={following ? 'secondary' : 'primary'}
        className={following ? 'bg-gray-200 dark:bg-gray-700' : ''}
      >
        {loading ? '...' : following ? 'Siguiendo' : 'Seguir'}
      </Button>
      {showCount && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {count} seguidores
        </span>
      )}
    </div>
  );
}
