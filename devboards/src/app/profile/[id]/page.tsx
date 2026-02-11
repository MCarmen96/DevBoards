import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { FollowButton } from '@/components/ui/FollowButton';
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
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Profile Header Section */}
      <section className="flex flex-col items-center justify-center mb-12">
        <div className="flex flex-col items-center gap-6 max-w-2xl w-full text-center">
          {/* Avatar */}
          <div className="relative">
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
              <span className="font-bold text-gray-900 dark:text-white">{stats.createdCount}</span>
              <span className="text-[#909acb]">Pins</span>
            </div>
            <div className="flex gap-1.5 items-center hover:text-[#0d33f2] cursor-pointer transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{user._count.followers}</span>
              <span className="text-[#909acb]">Seguidores</span>
            </div>
            <div className="flex gap-1.5 items-center hover:text-[#0d33f2] cursor-pointer transition-colors">
              <span className="font-bold text-gray-900 dark:text-white">{user._count.following}</span>
              <span className="text-[#909acb]">Siguiendo</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full max-w-xs mt-2">
            {currentUserId && (
              <FollowButton userId={user.id} />
            )}
            <button className="flex-1 h-10 rounded-lg bg-gray-200 dark:bg-[#1e2336] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-[#2a324b] transition-colors">
              Compartir
            </button>
          </div>
        </div>
      </section>

      {/* Pins Section Header */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Pins de {user.name}
        </h2>
      </section>

      {/* Pins Grid */}
      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#1e2336] rounded-xl">
          <div className="w-24 h-24 bg-gray-100 dark:bg-[#222949] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-[#909acb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Este usuario aún no ha creado pins
          </h3>
          <p className="text-[#909acb]">
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
