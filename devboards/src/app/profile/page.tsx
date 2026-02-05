import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { PinWithRelations } from '@/types';

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
  const [createdCount, savedCount] = await Promise.all([
    prisma.pin.count({ where: { authorId: userId } }),
    prisma.savedPin.count({ where: { userId } }),
  ]);

  return { createdCount, savedCount };
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

  const [pins, stats] = await Promise.all([
    getUserPins(session.user.id),
    getUserStats(session.user.id),
  ]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-gray-600">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    user.role === 'creator'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role === 'creator' ? '✍️ Creator' : '👨‍💻 Explorer'}
                </span>
              </div>

              {user.bio && (
                <p className="mt-4 text-gray-700">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-6">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-900">
                    {stats.createdCount}
                  </span>
                  <span className="text-sm text-gray-500">Pins creados</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-gray-900">
                    {stats.savedCount}
                  </span>
                  <span className="text-sm text-gray-500">Pins guardados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Pins */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Mis Pins</h2>
          {user.role === 'creator' && (
            <Link
              href="/create"
              className="px-4 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
            >
              + Crear Pin
            </Link>
          )}
        </div>

        {pins.length > 0 ? (
          <PinGrid pins={pins} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aún no has creado pins
            </h3>
            <p className="text-gray-500 mb-6">
              ¡Comparte tu primer snippet de código con la comunidad!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
            >
              Crear mi primer Pin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Mi Perfil | DevBoards',
  description: 'Tu perfil en DevBoards',
};
