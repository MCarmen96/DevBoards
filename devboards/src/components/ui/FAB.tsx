'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function FAB() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Link
        href="/create"
        className="flex items-center justify-center size-14 rounded-full bg-[#0d33f2] hover:bg-blue-600 text-white shadow-lg shadow-[#0d33f2]/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
}
