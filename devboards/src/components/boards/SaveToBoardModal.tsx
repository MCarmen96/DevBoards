'use client';

import { useState, useEffect } from 'react';
import { BoardPreview } from '@/types';
import { CreateBoardForm } from './CreateBoardForm';

interface SaveToBoardModalProps {
  pinId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function SaveToBoardModal({ pinId, isOpen, onClose }: SaveToBoardModalProps) {
  const [boards, setBoards] = useState<BoardPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [savedBoards, setSavedBoards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      fetchBoards();
    }
  }, [isOpen]);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/boards');
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
        
        // Check which boards already have this pin
        const savedIds = new Set<string>();
        data.forEach((board: BoardPreview) => {
          if (board.pins?.some((bp) => bp.pin.id === pinId)) {
            savedIds.add(board.id);
          }
        });
        setSavedBoards(savedIds);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBoard = async (boardId: string) => {
    setSaving(boardId);
    try {
      const isAlreadySaved = savedBoards.has(boardId);
      
      if (isAlreadySaved) {
        // Remove from board
        const response = await fetch(`/api/boards/${boardId}/pins`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinId }),
        });
        
        if (response.ok) {
          setSavedBoards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(boardId);
            return newSet;
          });
        }
      } else {
        // Add to board
        const response = await fetch(`/api/boards/${boardId}/pins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinId }),
        });
        
        if (response.ok) {
          setSavedBoards((prev) => new Set([...prev, boardId]));
        }
      }
    } catch (error) {
      console.error('Error saving to board:', error);
    } finally {
      setSaving(null);
    }
  };

  const handleBoardCreated = () => {
    setShowCreateForm(false);
    fetchBoards();
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {showCreateForm ? 'Crear tablero' : 'Guardar en tablero'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {showCreateForm ? (
              <CreateBoardForm
                onSuccess={handleBoardCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : (
              <>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="btn btn-light d-flex align-items-center gap-3 p-3 text-start"
                    >
                      <div className="rounded d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-plus-lg fs-5 text-secondary"></i>
                      </div>
                      <span className="fw-medium">Crear tablero</span>
                    </button>

                    {boards.length === 0 ? (
                      <p className="text-center text-secondary py-4">
                        No tienes tableros. ¡Crea uno!
                      </p>
                    ) : (
                      boards.map((board) => (
                        <button
                          key={board.id}
                          onClick={() => handleSaveToBoard(board.id)}
                          disabled={saving === board.id}
                          className="btn btn-light d-flex align-items-center gap-3 p-3 text-start"
                        >
                          <div className="rounded overflow-hidden flex-shrink-0 bg-secondary-subtle" style={{ width: '48px', height: '48px' }}>
                            {board.pins?.[0]?.pin?.imageUrl ? (
                              <img
                                src={board.pins[0].pin.imageUrl}
                                alt=""
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                <i className="bi bi-collection text-secondary"></i>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <p className="fw-medium mb-0">{board.name}</p>
                            <small className="text-secondary">
                              {board._count?.pins ?? board.pinCount ?? 0} pins
                            </small>
                          </div>
                          <div className="flex-shrink-0">
                            {saving === board.id ? (
                              <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            ) : savedBoards.has(board.id) ? (
                              <div className="rounded-circle bg-dark d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                <i className="bi bi-check-lg text-white"></i>
                              </div>
                            ) : (
                              <div className="rounded-circle border border-secondary" style={{ width: '32px', height: '32px' }}></div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
