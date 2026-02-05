import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { PinWithRelations } from '@/types';

async function getSavedPins(userId: string): Promise<PinWithRelations[]> {
  const savedPins = await prisma.savedPin.findMany({
    where: { userId },
    orderBy: { savedAt: 'desc' },
    include: {
      pin: {
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          savedBy: true,
        },
      },
    },
  });

  return savedPins.map((sp) => sp.pin) as PinWithRelations[];
}

export default async function SavedPinsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const pins = await getSavedPins(session.user.id);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pins Guardados</h1>
          <p className="text-gray-500 mt-2">
            Tu biblioteca personal de referencias de código
          </p>
        </div>

        {pins.length > 0 ? (
          <PinGrid pins={pins} />
        ) : (
          <div className="text-center py-20">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes pins guardados
            </h3>
            <p className="text-gray-500 mb-6">
              Explora y guarda pins que te interesen para tenerlos siempre a mano
            </p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
            >
              Explorar Pins
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Pins Guardados | DevBoards',
  description: 'Tu biblioteca personal de pins guardados',
};
