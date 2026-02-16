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
    <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1280px' }}>
      {/* Profile Header Section */}
      <section className="d-flex flex-column align-items-center justify-content-center mb-5">
        <div className="d-flex flex-column align-items-center gap-3 w-100 text-center" style={{ maxWidth: '672px' }}>
          {/* Avatar with edit overlay */}
          <div className="position-relative" role="button">
            <div 
              className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden border border-4 shadow"
              style={{ 
                height: '128px', 
                width: '128px', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                ...(user.image ? { backgroundImage: `url("${user.image}")` } : {})
              }}
            >
              {!user.image && (
                <span className="fs-1 text-secondary">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center opacity-0" style={{ transition: 'opacity 0.3s' }}>
              <i className="bi bi-pencil text-white fs-5"></i>
            </div>
          </div>

          {/* Name and username */}
          <div>
            <h1 className="h3 fw-bold text-body">{user.name}</h1>
            <p className="text-secondary small">@{username}</p>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-secondary" style={{ maxWidth: '448px' }}>{user.bio}</p>
          )}

          {/* Stats */}
          <div className="d-flex align-items-center gap-4 small fw-medium">
            <div className="d-flex gap-1 align-items-center" role="button">
              <span className="fw-bold text-body">{stats.pinCount}</span>
              <span className="text-secondary">Pins</span>
            </div>
            <div className="d-flex gap-1 align-items-center" role="button">
              <span className="fw-bold text-body">{stats.followersCount}</span>
              <span className="text-secondary">Seguidores</span>
            </div>
            <div className="d-flex gap-1 align-items-center" role="button">
              <span className="fw-bold text-body">{stats.followingCount}</span>
              <span className="text-secondary">Siguiendo</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-2 w-100 mt-2" style={{ maxWidth: '320px' }}>
            <button className="btn btn-secondary flex-grow-1 fw-bold small">
              Editar Perfil
            </button>
            <button className="btn btn-secondary flex-grow-1 fw-bold small">
              Compartir
            </button>
          </div>
        </div>
      </section>

      {/* Filter / Tabs Bar */}
      <section className="mb-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2 overflow-auto w-100 pb-2 pb-sm-0">
          <button className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 fw-bold small text-nowrap shadow-sm">
            Todos
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 fw-medium small text-nowrap">
            <i className="bi bi-unlock"></i>
            Públicos
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 fw-medium small text-nowrap">
            <i className="bi bi-lock"></i>
            Privados
          </button>
        </div>
        <div className="d-flex align-items-center gap-2 text-secondary align-self-end align-self-sm-auto">
          <i className="bi bi-sliders fs-5" role="button"></i>
          <i className="bi bi-grid-3x3 fs-5" role="button"></i>
        </div>
      </section>

      {/* Boards Grid */}
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
        {boards.map((board) => (
          <div className="col" key={board.id}>
            <BoardCard board={board} />
          </div>
        ))}
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Mi Perfil | DevBoards',
  description: 'Tu perfil en DevBoards',
};
