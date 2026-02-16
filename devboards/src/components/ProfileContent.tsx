'use client';

import { useState } from 'react';
import { EditProfileButton } from '@/components/ui/EditProfileButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { FollowersModal } from '@/components/ui/FollowersModal';
import { ProfileBoardsSection } from '@/components/ProfileBoardsSection';
import { ProfilePinsSection } from '@/components/ProfilePinsSection';
import { BoardPreview, PinWithRelations } from '@/types';

interface ProfileStats {
  pinCount: number;
  followersCount: number;
  followingCount: number;
}

interface UserData {
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
}

interface ProfileContentProps {
  user: UserData;
  stats: ProfileStats;
  boards: BoardPreview[];
  pins: PinWithRelations[];
}

export function ProfileContent({ user, stats, boards, pins }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'pins' | 'boards'>('pins');
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null);

  const getUsername = (email: string | null, name: string | null): string => {
    if (name) return name.toLowerCase().replace(/\s+/g, '');
    if (email) return email.split('@')[0];
    return 'user';
  };

  const username = getUsername(user.email, user.name);

  return (
    <>
      {/* Profile Header Section */}
      <section className="d-flex flex-column align-items-center justify-content-center mb-4 mb-md-5">
        <div className="d-flex flex-column align-items-center gap-3 w-100 text-center px-2" style={{ maxWidth: '672px' }}>
          {/* Avatar with edit overlay */}
          <div className="position-relative" role="button">
            <div 
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden border border-4 shadow avatar-lg"
              style={{ 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                ...(user.image ? { backgroundImage: `url("${user.image}")` } : {})
              }}
            >
              {!user.image && (
                <span className="fs-1 text-secondary">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center opacity-0" style={{ transition: 'opacity 0.3s' }}>
              <i className="bi bi-pencil text-white fs-5"></i>
            </div>
          </div>

          {/* Name and username */}
          <div>
            <h1 className="h3 h2-md fw-bold text-body">{user.name}</h1>
            <p className="text-secondary small">@{username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-secondary small mb-0" style={{ maxWidth: '448px' }}>{user.bio}</p>
          )}

          {/* Stats - Clickable */}
          <div className="d-flex align-items-center justify-content-center gap-3 gap-md-4 small fw-medium flex-wrap profile-stats">
            <button 
              onClick={() => setActiveTab('pins')}
              className="btn btn-link p-0 d-flex gap-1 align-items-center text-decoration-none"
            >
              <span className="fw-bold text-body">{stats.pinCount}</span>
              <span className="text-secondary">Pins</span>
            </button>
            <button 
              onClick={() => setModalType('followers')}
              className="btn btn-link p-0 d-flex gap-1 align-items-center text-decoration-none"
            >
              <span className="fw-bold text-body">{stats.followersCount}</span>
              <span className="text-secondary">Seguidores</span>
            </button>
            <button 
              onClick={() => setModalType('following')}
              className="btn btn-link p-0 d-flex gap-1 align-items-center text-decoration-none"
            >
              <span className="fw-bold text-body">{stats.followingCount}</span>
              <span className="text-secondary">Siguiendo</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-2 w-100 mt-2 justify-content-center" style={{ maxWidth: '320px' }}>
            <EditProfileButton user={{ name: user.name, bio: user.bio }} />
            <ShareButton title={`${user.name} en DevBoards`} />
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="mb-4">
        <div className="d-flex justify-content-center gap-2 border-bottom">
          <button
            onClick={() => setActiveTab('pins')}
            className={`btn btn-link px-4 py-3 text-decoration-none fw-medium position-relative ${
              activeTab === 'pins' ? 'text-body' : 'text-secondary'
            }`}
            style={{
              borderBottom: activeTab === 'pins' ? '2px solid currentColor' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <i className="bi bi-pin-angle me-2"></i>
            Mis Pins
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`btn btn-link px-4 py-3 text-decoration-none fw-medium position-relative ${
              activeTab === 'boards' ? 'text-body' : 'text-secondary'
            }`}
            style={{
              borderBottom: activeTab === 'boards' ? '2px solid currentColor' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <i className="bi bi-collection me-2"></i>
            Tableros
          </button>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === 'pins' ? (
        <ProfilePinsSection pins={pins} />
      ) : (
        <ProfileBoardsSection boards={boards} />
      )}

      {/* Modal for followers/following */}
      <FollowersModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'followers'}
        count={modalType === 'followers' ? stats.followersCount : stats.followingCount}
      />
    </>
  );
}
