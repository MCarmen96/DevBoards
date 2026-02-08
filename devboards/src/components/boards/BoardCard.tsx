'use client';

import Link from 'next/link';
import { BoardPreview } from '@/types';

interface BoardCardProps {
  board: BoardPreview;
}

export function BoardCard({ board }: BoardCardProps) {
  const previewImages = board.pins.slice(0, 4).map((bp) => bp.pin);

  return (
    <Link href={`/boards/${board.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square">
        {previewImages.length > 0 ? (
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 overflow-hidden"
              >
                {previewImages[index] && (
                  <img
                    src={previewImages[index].imageUrl}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-sm">Sin pins</span>
            </div>
          </div>
        )}

        {board.isPrivate && (
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
          {board.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {board._count.pins} {board._count.pins === 1 ? 'pin' : 'pins'}
        </p>
      </div>
    </Link>
  );
}
