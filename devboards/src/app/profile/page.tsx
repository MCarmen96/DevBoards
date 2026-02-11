import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BoardCard } from '@/components/boards/BoardCard';
import { BoardPreview } from '@/types';

async function getUserBoards(userId: string): Promise<BoardPreview[]> {
  const boards = await prisma.board.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      pins: {
        take: 4,
        include: {
          pin: {
            select: { imageUrl: true },
          },
        },
        orderBy: { addedAt: 'desc' },
      },
      _count: {
        select: { pins: true },
      },
    },
  });

  return boards.map((board) => ({
    id: board.id,
    name: board.name,
    isPrivate: board.isPrivate,
    pinCount: board._count.pins,
    previewImages: board.pins.map((bp) => bp.pin.imageUrl),
    updatedAt: board.updatedAt,
  }));
}

async function getUserStats(userId: string) {
  const [pinCount, followersCount, followingCount] = await Promise.all([
    prisma.pin.count({ where: { authorId: userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return { pinCount, followersCount, followingCount };
}

function getUsername(email: string | null, name: string | null): string {
  if (name) {
    return name.toLowerCase().replace(/\s+/g, '');
  }
  if (email) {
    return email.split('@')[0];
  }
  return 'user';
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

  const [boards, stats] = await Promise.all([
    getUserBoards(session.user.id),
    getUserStats(session.user.id),
  ]);

  const username = getUsername(user.email, user.name);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Profile Header Section */}
      <section className="flex flex-col items-center justify-center mb-12">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full text-center">
          {/* Avatar with edit overlay */}
          <div className="relative group cursor-pointer">
            <div 
              className="h-32 w-32 rounded-full bg-cover bg-center border-4 border-[#f5f6f8] dark:border-[#101322] shadow-xl bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden"
              style={user.image ? { backgroundImage: `url("${user.image}")` } : undefined}
            >
              {!user.image && (
                <span className="text-4xl text-gray-600 dark:text-gray-300">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>

          {/* Name and username */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-[#909acb] text-sm">@{username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-600 dark:text-gray-300 max-w-md">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex gap-1.5 items-center hover:text-[#0d33f2] cursor-pointer transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{stats.pinCount}</span>
              <span className="text-[#909acb]">Pins</span>
            </div>
            <div className="flex gap-1.5 items-center hover:text-[#0d33f2] cursor-pointer transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{stats.followersCount}</span>
              <span className="text-[#909acb]">Seguidores</span>
            </div>
            <div className="flex gap-1.5 items-center hover:text-[#0d33f2] cursor-pointer transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{stats.followingCount}</span>
              <span className="text-[#909acb]">Siguiendo</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full max-w-xs mt-2">
            <button className="flex-1 h-10 rounded-lg bg-gray-200 dark:bg-[#1e2336] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-[#2a324b] transition-colors">
              Editar Perfil
            </button>
            <button className="flex-1 h-10 rounded-lg bg-gray-200 dark:bg-[#1e2336] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-[#2a324b] transition-colors">
              Compartir
            </button>
          </div>
        </div>
      </section>

      {/* Filter / Tabs Bar */}
      <section className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 scrollbar-hide">
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold whitespace-nowrap shadow-sm">
            Todos
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white dark:bg-[#1e2336] border border-gray-200 dark:border-[#2a324b] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a324b] text-sm font-medium whitespace-nowrap transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Públicos
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-white dark:bg-[#1e2336] border border-gray-200 dark:border-[#2a324b] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a324b] text-sm font-medium whitespace-nowrap transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privados
          </button>
        </div>
        <div className="flex items-center gap-2 text-[#909acb] self-end sm:self-auto">
          <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <svg className="w-5 h-5 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
      </section>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        {/* Create New Board Card */}
        <Link 
          href="/boards"
          className="group flex flex-col items-center justify-center gap-4 h-full min-h-[280px] rounded-xl border-2 border-dashed border-gray-300 dark:border-[#2a324b] hover:border-[#0d33f2] dark:hover:border-[#0d33f2] bg-transparent hover:bg-[#0d33f2]/5 transition-all duration-300 cursor-pointer"
        >
          <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-[#1e2336] group-hover:bg-[#0d33f2] group-hover:text-white flex items-center justify-center text-[#0d33f2] dark:text-[#0d33f2] transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="text-center px-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#0d33f2] transition-colors">Crear Tablero</h3>
            <p className="text-sm text-[#909acb] mt-1">Organiza tus snippets</p>
          </div>
        </Link>

        {/* Board Cards */}
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Mi Perfil | DevBoards',
  description: 'Tu perfil en DevBoards',
};
