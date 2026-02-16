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

  if (session?.user?.id === userId) {
    return null;
  }

  return (
    <div className="d-flex align-items-center gap-2 flex-grow-1">
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`btn flex-grow-1 fw-bold ${
          following 
            ? 'btn-secondary' 
            : 'btn-primary'
        }`}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        ) : following ? 'Siguiendo' : 'Seguir'}
      </button>
      {showCount && (
        <span className="text-secondary small">
          {count} seguidores
        </span>
      )}
    </div>
  );
}
