import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { FollowButton } from '@/components/ui/FollowButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { PinWithRelations } from '@/types';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });
}

async function getUserPins(userId: string): Promise<PinWithRelations[]> {
  const pins = await prisma.pin.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
    },
  });

  return pins as PinWithRelations[];
}

async function getUserStats(userId: string) {
  const createdCount = await prisma.pin.count({ where: { authorId: userId } });
  return { createdCount };
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

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;
  const isOwnProfile = currentUserId === id;
  
  // Redirect to own profile page if viewing self
  if (isOwnProfile) {
    const { redirect } = await import('next/navigation');
    redirect('/profile');
  }
  
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const [pins, stats] = await Promise.all([
    getUserPins(id),
    getUserStats(id),
  ]);

  const username = getUsername(user.email, user.name);

  return (
    <main className="flex-grow-1 w-100 container-xxl py-4 px-3 px-lg-4 px-xxl-5">
      <Breadcrumb items={[{ label: 'Perfil', href: '/profile' }, { label: user.name || username }]} />
      {/* Profile Header Section */}
      <section className="d-flex flex-column align-items-center justify-content-center mb-5">
        <div className="d-flex flex-column align-items-center gap-3 w-100 text-center" style={{ maxWidth: '672px' }}>
          {/* Avatar */}
          <div className="position-relative">
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
              <span className="fw-bold text-body">{stats.createdCount}</span>
              <span className="text-secondary">Pins</span>
            </div>
            <div className="d-flex gap-1 align-items-center" role="button">
              <span className="fw-bold text-body">{user._count.followers}</span>
              <span className="text-secondary">Seguidores</span>
            </div>
            <div className="d-flex gap-1 align-items-center" role="button">
              <span className="fw-bold text-body">{user._count.following}</span>
              <span className="text-secondary">Siguiendo</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="d-flex gap-2 w-100 mt-2" style={{ maxWidth: '320px' }}>
            {currentUserId && (
              <FollowButton userId={user.id} />
            )}
            <button className="btn btn-secondary flex-grow-1 fw-bold small">
              Compartir
            </button>
          </div>
        </div>
      </section>

      {/* Pins Section Header */}
      <section className="mb-4">
        <h2 className="h5 fw-bold text-body">
          Pins de {user.name}
        </h2>
      </section>

      {/* Pins Grid */}
      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="text-center py-5 bg-body rounded-3">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-image text-secondary fs-1"></i>
          </div>
          <h3 className="h5 fw-semibold text-body mb-2">
            Este usuario aún no ha creado pins
          </h3>
          <p className="text-secondary">
            Vuelve más tarde para ver su contenido
          </p>
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return { title: 'Usuario no encontrado' };
  }

  return {
    title: `${user.name} | DevBoards`,
    description: `Perfil de ${user.name} en DevBoards`,
  };
}
