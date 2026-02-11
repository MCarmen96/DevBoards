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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showCreateForm ? 'Crear tablero' : 'Guardar en tablero'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {showCreateForm ? (
            <CreateBoardForm
              onSuccess={handleBoardCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Crear tablero</span>
                  </button>

                  {boards.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No tienes tableros. ¡Crea uno!
                    </p>
                  ) : (
                    boards.map((board) => (
                      <button
                        key={board.id}
                        onClick={() => handleSaveToBoard(board.id)}
                        disabled={saving === board.id}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {board.pins?.[0]?.pin?.imageUrl ? (
                            <img
                              src={board.pins[0].pin.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white">{board.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {board._count?.pins ?? board.pinCount ?? 0} pins
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {saving === board.id ? (
                            <div className="w-6 h-6 border-2 border-[#0d33f2] border-t-transparent rounded-full animate-spin" />
                          ) : savedBoards.has(board.id) ? (
                            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
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
  );
}
