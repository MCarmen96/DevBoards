'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BoardCard } from '@/components/boards/BoardCard';
import { CreateBoardForm } from '@/components/boards/CreateBoardForm';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { BoardPreview } from '@/types';

export default function BoardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<BoardPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchBoards();
    }
  }, [session]);

  const fetchBoards = async () => {
    try {
      const response = await fetch('/api/boards');
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = () => {
    setShowCreateModal(false);
    fetchBoards();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container-xxl py-4 px-3 px-lg-4 px-xxl-5">
      <PageHeader 
        title="Mis Tableros" 
        description="Organiza tus pins en colecciones temáticas"
      >
        <Button onClick={() => setShowCreateModal(true)}>
          Crear tablero
        </Button>
      </PageHeader>

      {boards.length === 0 ? (
        <div className="text-center py-5">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-collection text-secondary fs-1"></i>
          </div>
          <h2 className="h5 fw-semibold text-body mb-2">
            No tienes tableros
          </h2>
          <p className="text-secondary mb-4">
            Crea tu primer tablero para organizar tus pins favoritos
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Crear mi primer tablero
          </Button>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
          {boards.map((board) => (
            <div className="col" key={board.id}>
              <BoardCard board={board} />
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear tablero */}
      {showCreateModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-body p-4">
                <h2 className="h5 fw-semibold text-body mb-4">Crear tablero</h2>
                <CreateBoardForm
                  onSuccess={handleBoardCreated}
                  onCancel={() => setShowCreateModal(false)}
                />
              </div>
            </div>
          </div>
          <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: -1 }} onClick={() => setShowCreateModal(false)} />
        </div>
      )}
    </div>
  );
}
