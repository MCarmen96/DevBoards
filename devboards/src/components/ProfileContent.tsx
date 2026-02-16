'use client';

import { useState } from 'react';
import { EditProfileButton } from '@/components/ui/EditProfileButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { FollowersModal } from '@/components/ui/FollowersModal';
import { ProfileBoardsSection } from '@/components/ProfileBoardsSection';
import { ProfilePinsSection } from '@/components/ProfilePinsSection';
import { BoardPreview, PinWithRelations } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';

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
  const { theme } = useAppTheme();
  const isNoUsability = theme === 'no-usabilidad';

  const getUsername = (email: string | null, name: string | null): string => {
    if (name) return name.toLowerCase().replace(/\s+/g, '');
    if (email) return email.split('@')[0];
    return 'user';
  };

  const username = getUsername(user.email, user.name);

  return (
    <>
      {/* Profile Header Section */}
      <section 
        className={`mb-4 mb-md-5 ${isNoUsability ? 'p-4 rounded-3' : 'd-flex flex-column align-items-center justify-content-center'}`}
        style={isNoUsability ? {
          background: 'linear-gradient(135deg, #f59e0b15 0%, #f59e0b25 100%)',
          border: '2px dashed #f59e0b',
        } : undefined}
      >
        <div 
          className={`d-flex ${isNoUsability ? 'flex-row align-items-start' : 'flex-column align-items-center'} gap-3 w-100 px-2`}
          style={isNoUsability ? { maxWidth: '100%' } : { maxWidth: '672px', textAlign: 'center' }}
        >
          {/* Avatar with edit overlay */}
          <div className="position-relative" role="button">
            <div 
              className={`${isNoUsability ? 'rounded-4 border-3 border-warning' : 'rounded-circle border-4'} bg-secondary d-flex align-items-center justify-content-center overflow-hidden border shadow avatar-lg`}
              style={{ 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                ...(user.image ? { backgroundImage: `url("${user.image}")` } : {}),
                ...(isNoUsability ? { width: '120px', height: '120px', flexShrink: 0 } : {})
              }}
            >
              {!user.image && (
                <span className={`${isNoUsability ? 'fs-2' : 'fs-1'} text-secondary`}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            {!isNoUsability && (
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center opacity-0" style={{ transition: 'opacity 0.3s' }}>
                <i className="bi bi-pencil text-white fs-5"></i>
              </div>
            )}
          </div>

          {/* Name and username */}
          <div className={isNoUsability ? 'flex-grow-1' : ''}>
            <h1 
              className={`${isNoUsability ? 'h4 mb-1' : 'h3 h2-md'} fw-bold`}
              style={isNoUsability ? { color: '#f59e0b', fontFamily: 'monospace', letterSpacing: '0.5px' } : undefined}
            >
              {user.name}
            </h1>
            <p 
              className={`${isNoUsability ? 'mb-2' : 'mb-0'} ${isNoUsability ? 'text-warning' : 'text-secondary'} small`}
              style={isNoUsability ? { fontStyle: 'italic' } : undefined}
            >
              @{username}
            </p>

            {/* Bio */}
            {user.bio && (
              <p 
                className={`small mb-0 ${isNoUsability ? 'text-body-secondary' : 'text-secondary'}`}
                style={isNoUsability ? { maxWidth: '100%', fontSize: '0.85rem' } : { maxWidth: '448px' }}
              >
                {user.bio}
              </p>
            )}

            {/* Stats for no-usability - inline with name */}
            {isNoUsability && (
              <div className="d-flex align-items-center gap-2 mt-2 flex-wrap small">
                <button 
                  onClick={() => setActiveTab('pins')}
                  className="btn btn-sm btn-outline-warning px-2 py-1 d-flex gap-1 align-items-center"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-pin-angle"></i>
                  <span className="fw-bold">{stats.pinCount}</span>
                </button>
                <button 
                  onClick={() => setModalType('followers')}
                  className="btn btn-sm btn-outline-warning px-2 py-1 d-flex gap-1 align-items-center"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-people"></i>
                  <span className="fw-bold">{stats.followersCount}</span>
                </button>
                <button 
                  onClick={() => setModalType('following')}
                  className="btn btn-sm btn-outline-warning px-2 py-1 d-flex gap-1 align-items-center"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-person-check"></i>
                  <span className="fw-bold">{stats.followingCount}</span>
                </button>
              </div>
            )}

            {/* Action buttons for no-usability */}
            {isNoUsability && (
              <div className="d-flex gap-2 mt-3">
                <EditProfileButton user={{ name: user.name, bio: user.bio }} />
                <ShareButton title={`${user.name} en DevBoards`} />
              </div>
            )}
          </div>
        </div>

        {/* Stats - Original centered layout (only for non no-usability) */}
        {!isNoUsability && (
          <>
            <div className="d-flex align-items-center justify-content-center gap-3 gap-md-4 small fw-medium flex-wrap profile-stats" style={{ maxWidth: '672px' }}>
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

            {/* Action buttons - Original centered layout */}
            <div className="d-flex gap-2 w-100 mt-2 justify-content-center" style={{ maxWidth: '320px' }}>
              <EditProfileButton user={{ name: user.name, bio: user.bio }} />
              <ShareButton title={`${user.name} en DevBoards`} />
            </div>
          </>
        )}
      </section>

      {/* Tab navigation */}
      <section className="mb-4">
        <div className={`d-flex ${isNoUsability ? 'gap-3 mb-3' : 'justify-content-center gap-2 border-bottom'}`}>
          <button
            onClick={() => setActiveTab('pins')}
            className={`btn ${isNoUsability ? 'btn-warning' : 'btn-link'} ${isNoUsability ? 'px-3 py-2' : 'px-4 py-3'} text-decoration-none fw-medium position-relative ${
              isNoUsability 
                ? (activeTab === 'pins' ? '' : 'btn-outline-warning')
                : (activeTab === 'pins' ? 'text-body' : 'text-secondary')
            }`}
            style={isNoUsability ? undefined : {
              borderBottom: activeTab === 'pins' ? '2px solid currentColor' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <i className="bi bi-pin-angle me-2"></i>
            {isNoUsability ? 'PINS' : 'Mis Pins'}
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`btn ${isNoUsability ? 'btn-warning' : 'btn-link'} ${isNoUsability ? 'px-3 py-2' : 'px-4 py-3'} text-decoration-none fw-medium position-relative ${
              isNoUsability 
                ? (activeTab === 'boards' ? '' : 'btn-outline-warning')
                : (activeTab === 'boards' ? 'text-body' : 'text-secondary')
            }`}
            style={isNoUsability ? undefined : {
              borderBottom: activeTab === 'boards' ? '2px solid currentColor' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            <i className="bi bi-collection me-2"></i>
            {isNoUsability ? 'TABLEROS' : 'Tableros'}
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
