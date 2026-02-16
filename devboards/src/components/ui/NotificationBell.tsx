'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from '@/lib/utils';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  pinId?: string;
  boardId?: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationId ? { notificationId } : { markAll: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.pinId) {
      router.push(`/pin/${notification.pinId}`);
    } else if (notification.boardId) {
      router.push(`/boards/${notification.boardId}`);
    }
  };

  return (
    <div ref={bellRef} className="dropdown position-relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-link text-secondary position-relative p-2"
        type="button"
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="dropdown-menu dropdown-menu-end show shadow-lg" 
          style={{ 
            width: '320px', 
            maxHeight: '400px',
            position: 'absolute',
            right: 0,
            top: '100%',
            zIndex: 1060
          }}
        >
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <h6 className="mb-0 fw-semibold">Notificaciones</h6>
            {unreadCount > 0 && (
              <button
                onClick={() => markAsRead()}
                className="btn btn-link btn-sm text-primary p-0"
              >
                Marcar todas leídas
              </button>
            )}
          </div>

          <div className="overflow-auto" style={{ maxHeight: '320px' }}>
            {notifications.length === 0 ? (
              <p className="text-center text-secondary p-4 mb-0">
                No tienes notificaciones
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`dropdown-item d-block border-bottom py-3 ${
                    !notification.read ? 'bg-primary bg-opacity-10' : ''
                  }`}
                >
                  <p className="mb-1 small">
                    {notification.message}
                  </p>
                  <small className="text-secondary">
                    {formatDistanceToNow(new Date(notification.createdAt))}
                  </small>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
