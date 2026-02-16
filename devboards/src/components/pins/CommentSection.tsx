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
      <div className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-semibold d-flex align-items-center gap-2">
          <i className="bi bi-chat-dots text-secondary"></i>
          Discusión
        </h6>
        <small className="text-secondary">{count} comentarios</small>
      </div>

      {/* Comments List */}
      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '300px' }}>
        {comments.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center text-center py-4">
            <i className="bi bi-chat-dots fs-1 text-secondary mb-2"></i>
            <p className="text-secondary small mb-1">No hay comentarios aún</p>
            <small className="text-muted">Sé el primero en comentar</small>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((comment) => (
              <div key={comment.id} className="d-flex gap-2">
                <Link href={`/profile/${comment.user.id}`} className="flex-shrink-0">
                  <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '32px', height: '32px' }}>
                    {comment.user.image ? (
                      <img src={comment.user.image} alt="" className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <small className="fw-medium text-secondary">
                        {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                      </small>
                    )}
                  </div>
                </Link>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex align-items-baseline gap-2 flex-wrap">
                    <Link href={`/profile/${comment.user.id}`} className="small fw-medium text-decoration-none">
                      {comment.user.name}
                    </Link>
                    <small className="text-muted">{formatDistanceToNow(new Date(comment.createdAt))}</small>
                  </div>
                  <p className="small text-secondary mb-0">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-top">
        {session ? (
          <form onSubmit={handleSubmit} className="d-flex gap-2 align-items-center">
            <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0" style={{ width: '32px', height: '32px' }}>
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-100 h-100 object-fit-cover" />
              ) : (
                <small className="fw-medium text-secondary">
                  {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                </small>
              )}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="form-control form-control-sm"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-send"></i>
            </button>
          </form>
        ) : (
          <p className="small text-secondary text-center mb-0 py-2">
            <Link href="/login" className="text-primary text-decoration-none fw-medium">
              Inicia sesión
            </Link>{' '}
            para comentar
          </p>
        )}
      </div>
    </>
  );
}
