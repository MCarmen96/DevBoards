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
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    fetchComments();
  }, [pinId]);

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
    <>
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#222949] flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-[#909acb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Discusión
        </h3>
        <span className="text-[#565f89] text-xs">{count} comentarios</span>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <svg className="w-12 h-12 text-[#2b3355] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[#565f89] text-sm">No hay comentarios aún</p>
            <p className="text-[#3d4566] text-xs mt-1">Sé el primero en comentar</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#1e2337] ring-2 ring-[#222949] flex items-center justify-center overflow-hidden">
                  {comment.user.image ? (
                    <img src={comment.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-medium text-[#909acb]">
                      {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <Link href={`/profile/${comment.user.id}`} className="text-sm font-medium text-white hover:text-[#0d33f2] transition-colors">
                    {comment.user.name}
                  </Link>
                  <span className="text-[10px] text-[#565f89]">{formatDistanceToNow(new Date(comment.createdAt))}</span>
                </div>
                <p className="text-sm text-[#909acb] mt-0.5 break-words">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-[#222949] bg-[#0d101c]">
        {session ? (
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-[#1e2337] ring-2 ring-[#222949] flex items-center justify-center overflow-hidden flex-shrink-0">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-[#909acb]">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-[#161b2e] border border-[#222949] rounded-lg px-4 py-2 text-sm text-white placeholder-[#565f89] focus:outline-none focus:ring-1 focus:ring-[#0d33f2] focus:border-[#0d33f2] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="p-2 bg-[#0d33f2] hover:bg-blue-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        ) : (
          <p className="text-sm text-[#565f89] text-center py-2">
            <Link href="/login" className="text-[#0d33f2] hover:underline font-medium">
              Inicia sesión
            </Link>{' '}
            para comentar
          </p>
        )}
      </div>
    </>
  );
}
