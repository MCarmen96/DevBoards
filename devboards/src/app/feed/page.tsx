import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { PageHeader } from '@/components/ui/PageHeader';
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
    <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1440px' }}>
      <PageHeader 
        title="Siguiendo" 
        description="Pins de los usuarios que sigues"
      />

      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="text-center py-5">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-people text-secondary fs-1"></i>
          </div>
          <h3 className="h5 fw-semibold text-body mb-2">
            No sigues a nadie todavía
          </h3>
          <p className="text-secondary mb-4">
            Explora y sigue a otros desarrolladores para ver sus pins aquí.
          </p>
          <Link
            href="/"
            className="btn btn-primary rounded-3 px-4 py-2 fw-medium shadow"
          >
            Explorar pins
          </Link>
        </div>
      )}
    </main>
  );
}

export const metadata = {
  title: 'Siguiendo | DevBoards',
  description: 'Pins de los usuarios que sigues',
};
