'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserPreview {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
  count: number;
}

export function FollowersModal({ isOpen, onClose, type, count }: FollowersModalProps) {
  const [users, setUsers] = useState<UserPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, type]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${type}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getUsername = (email: string | null, name: string | null): string => {
    if (name) return name.toLowerCase().replace(/\s+/g, '');
    if (email) return email.split('@')[0];
    return 'user';
  };

  if (!isOpen) return null;

  const title = type === 'followers' ? 'Seguidores' : 'Siguiendo';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop show" 
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="modal show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                {title}
                <span className="badge bg-secondary-subtle text-secondary ms-2">{count}</span>
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Cerrar"
              ></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : users.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {users.map((user) => (
                    <li key={user.id} className="mb-3">
                      <Link 
                        href={`/profile/${user.id}`}
                        className="d-flex align-items-center gap-3 text-decoration-none"
                        onClick={onClose}
                      >
                        <div 
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0"
                          style={{ 
                            height: '48px', 
                            width: '48px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            ...(user.image ? { backgroundImage: `url("${user.image}")` } : {})
                          }}
                        >
                          {!user.image && (
                            <span className="text-white fw-bold">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="mb-0 fw-medium text-body">{user.name || 'Usuario'}</p>
                          <p className="mb-0 small text-secondary">@{getUsername(user.email, user.name)}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <i className={`bi ${type === 'followers' ? 'bi-people' : 'bi-person-plus'} fs-1 text-secondary`}></i>
                  <p className="text-secondary mt-3 mb-0">
                    {type === 'followers' 
                      ? 'Aún no tienes seguidores' 
                      : 'Aún no sigues a nadie'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
