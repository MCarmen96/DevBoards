'use client';

import Link from 'next/link';
import { BoardPreview } from '@/types';

interface BoardCardProps {
  board: BoardPreview;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'now';
}

export function BoardCard({ board }: BoardCardProps) {
  // Handle different board data formats
  const previewImages = board.previewImages || 
    (board.pins?.slice(0, 4).map((bp) => (bp as { pin: { imageUrl: string } }).pin.imageUrl) ?? []);
  const pinCount = board.pinCount ?? board._count?.pins ?? 0;

  return (
    <Link href={`/boards/${board.id}`} className="group flex flex-col gap-3 cursor-pointer">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1e2336] ring-1 ring-white/5 group-hover:ring-[#0d33f2]/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#0d33f2]/10">
        {previewImages.length > 0 ? (
          <div className="grid grid-cols-3 grid-rows-2 h-full gap-[1px]">
            {/* Main Preview - takes 2 cols and 2 rows */}
            <div 
              className="col-span-2 row-span-2 bg-cover bg-center"
              style={previewImages[0] ? { backgroundImage: `url("${previewImages[0]}")` } : undefined}
            >
              {!previewImages[0] && <div className="w-full h-full bg-gray-700" />}
            </div>
            {/* Secondary Previews */}
            <div 
              className="col-span-1 row-span-1 bg-cover bg-center"
              style={previewImages[1] ? { backgroundImage: `url("${previewImages[1]}")` } : undefined}
            >
              {!previewImages[1] && <div className="w-full h-full bg-gray-700" />}
            </div>
            <div 
              className="col-span-1 row-span-1 bg-cover bg-center"
              style={previewImages[2] ? { backgroundImage: `url("${previewImages[2]}")` } : undefined}
            >
              {!previewImages[2] && <div className="w-full h-full bg-gray-700" />}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-[#909acb]">
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

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-white/5 transition-colors duration-300" />
      </div>

      <div className="px-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight group-hover:text-[#0d33f2] transition-colors">
            {board.name}
          </h3>
          {board.isPrivate && (
            <svg className="w-4 h-4 text-[#909acb]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#909acb] font-medium">
          <span>{pinCount} {pinCount === 1 ? 'Pin' : 'Pins'}</span>
          {board.updatedAt && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{formatTimeAgo(new Date(board.updatedAt))}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
