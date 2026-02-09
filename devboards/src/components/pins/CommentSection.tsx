'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CommentWithUser } from '@/types';
import { formatDistanceToNow } from '@/lib/utils';

interface CommentSectionProps {
  pinId: string;
  initialCount: number;
}

export function CommentSection({ pinId, initialCount }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, pinId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/pins/${pinId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/pins/${pinId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
        setCount(count + 1);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-sm font-medium">{count} comentarios</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {/* Formulario para añadir comentario */}
          {session ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añade un comentario..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Enviar'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <Link href="/login" className="text-red-500 hover:underline">
                Inicia sesión
              </Link>{' '}
              para comentar
            </p>
          )}

          {/* Lista de comentarios */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No hay comentarios aún
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                      {comment.user.image ? (
                        <img
                          src={comment.user.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                      <Link
                        href={`/profile/${comment.user.id}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
                      >
                        {comment.user.name}
                      </Link>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 ml-2">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
