import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { PinWithRelations } from '@/types';

async function getFollowingPins(userId: string): Promise<PinWithRelations[]> {
  // Obtener los IDs de usuarios que sigo
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);

  if (followingIds.length === 0) {
    return [];
  }

  const pins = await prisma.pin.findMany({
    where: {
      authorId: { in: followingIds },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
    },
  });

  return pins as PinWithRelations[];
}

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const pins = await getFollowingPins(session.user.id);

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Siguiendo
      </h1>

      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 dark:bg-[#1e2337] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-slate-400 dark:text-[#909acb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No sigues a nadie todavía
          </h3>
          <p className="text-slate-500 dark:text-[#909acb] mb-6">
            Explora y sigue a otros desarrolladores para ver sus pins aquí.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#0d33f2] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-[#0d33f2]/20"
          >
            Explorar pins
          </a>
        </div>
      )}
    </main>
  );
}

export const metadata = {
  title: 'Siguiendo | DevBoards',
  description: 'Pins de los usuarios que sigues',
};
