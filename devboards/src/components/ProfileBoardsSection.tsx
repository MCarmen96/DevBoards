'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BoardCard } from '@/components/boards/BoardCard';
import { BoardPreview } from '@/types';

interface ProfileBoardsSectionProps {
  boards: BoardPreview[];
}

export function ProfileBoardsSection({ boards }: ProfileBoardsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private'>('all');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const filteredBoards = useMemo(() => {
    switch (activeFilter) {
      case 'public':
        return boards.filter((board) => !board.isPrivate);
      case 'private':
        return boards.filter((board) => board.isPrivate);
      default:
        return boards;
    }
  }, [boards, activeFilter]);

  const publicCount = boards.filter((b) => !b.isPrivate).length;
  const privateCount = boards.filter((b) => b.isPrivate).length;

  return (
    <>
      {/* Filter / Tabs Bar */}
      <section className="mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-sm">
            <div className="row g-2">
              <div className="col-auto">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`btn d-flex align-items-center gap-2 px-3 py-2 fw-bold small shadow-sm ${
                    activeFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                >
                  Todos
                  <span className="badge bg-secondary-subtle text-secondary ms-1">{boards.length}</span>
                </button>
              </div>
              <div className="col-auto">
                <button 
                  onClick={() => setActiveFilter('public')}
                  className={`btn d-flex align-items-center gap-2 px-3 py-2 fw-medium small ${
                    activeFilter === 'public' ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                >
                  <i className="bi bi-unlock"></i>
                  Públicos
                  <span className="badge bg-secondary-subtle text-secondary ms-1">{publicCount}</span>
                </button>
              </div>
              <div className="col-auto">
                <button 
                  onClick={() => setActiveFilter('private')}
                  className={`btn d-flex align-items-center gap-2 px-3 py-2 fw-medium small ${
                    activeFilter === 'private' ? 'btn-dark' : 'btn-outline-secondary'
                  }`}
                >
                  <i className="bi bi-lock"></i>
                  Privados
                  <span className="badge bg-secondary-subtle text-secondary ms-1">{privateCount}</span>
                </button>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setActiveView('list')}
                className={`btn btn-link p-1 ${activeView === 'list' ? 'text-primary' : 'text-secondary'}`}
                title="Vista lista"
              >
                <i className="bi bi-list-ul fs-5"></i>
              </button>
              <button
                onClick={() => setActiveView('grid')}
                className={`btn btn-link p-1 ${activeView === 'grid' ? 'text-primary' : 'text-secondary'}`}
                title="Vista cuadrícula"
              >
                <i className="bi bi-grid-3x3 fs-5"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Boards Grid or List */}
      {activeView === 'grid' ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 pb-5">
          {/* Create New Board Card */}
          <div className="col">
            <Link 
              href="/boards"
              className="d-flex flex-column align-items-center justify-content-center gap-3 h-100 rounded-3 border border-2 border-dashed text-decoration-none"
              style={{ minHeight: '280px' }}
            >
              <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary" style={{ height: '56px', width: '56px' }}>
                <i className="bi bi-plus-lg fs-3"></i>
              </div>
              <div className="text-center px-3">
                <h3 className="h6 fw-bold text-body">Crear Tablero</h3>
                <p className="small text-secondary mt-1 mb-0">Organiza tus snippets</p>
              </div>
            </Link>
          </div>

          {/* Board Cards */}
          {filteredBoards.map((board) => (
            <div className="col" key={board.id}>
              <BoardCard board={board} />
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="pb-5">
          {/* Create New Board Row */}
          <Link 
            href="/boards"
            className="d-flex align-items-center gap-3 p-3 mb-2 rounded-3 border border-2 border-dashed text-decoration-none"
          >
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary flex-shrink-0" style={{ height: '48px', width: '48px' }}>
              <i className="bi bi-plus-lg fs-5"></i>
            </div>
            <div>
              <h3 className="h6 fw-bold text-body mb-0">Crear Tablero</h3>
              <p className="small text-secondary mb-0">Organiza tus snippets</p>
            </div>
          </Link>

          {/* Board Rows */}
          {filteredBoards.map((board) => (
            <Link 
              key={board.id}
              href={`/boards/${board.id}`}
              className="d-flex align-items-center gap-3 p-3 mb-2 rounded-3 border bg-body text-decoration-none"
            >
              {/* Preview thumbnail */}
              <div 
                className="rounded overflow-hidden flex-shrink-0 bg-secondary-subtle"
                style={{ width: '64px', height: '64px' }}
              >
                {board.previewImages?.[0] ? (
                  <img 
                    src={board.previewImages[0]} 
                    alt="" 
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <i className="bi bi-collection text-secondary"></i>
                  </div>
                )}
              </div>
              
              {/* Board info */}
              <div className="flex-grow-1 min-width-0">
                <div className="d-flex align-items-center gap-2">
                  <h3 className="h6 fw-bold text-body mb-0 text-truncate">{board.name}</h3>
                  {board.isPrivate && (
                    <i className="bi bi-lock-fill text-secondary small"></i>
                  )}
                </div>
                <p className="small text-secondary mb-0">
                  {board.pinCount} {board.pinCount === 1 ? 'pin' : 'pins'}
                </p>
              </div>

              {/* Arrow */}
              <i className="bi bi-chevron-right text-secondary"></i>
            </Link>
          ))}

          {/* Empty state for filtered results */}
          {filteredBoards.length === 0 && (
            <div className="text-center py-5">
              <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-collection text-secondary fs-4"></i>
              </div>
              <p className="text-secondary mb-0">
                No tienes tableros {activeFilter === 'public' ? 'públicos' : 'privados'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
