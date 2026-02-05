import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
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

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const [pins, stats] = await Promise.all([
    getUserPins(id),
    getUserStats(id),
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
              </div>
            </div>
          </div>
        </div>

        {/* User's Pins */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Pins de {user.name}
        </h2>

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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Este usuario aún no ha creado pins
            </h3>
            <p className="text-gray-500">
              Vuelve más tarde para ver su contenido
            </p>
          </div>
        )}
      </div>
    </div>
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
