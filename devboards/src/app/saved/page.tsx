import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
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
    <div className="py-4">
      <div className="container" style={{ maxWidth: '1280px' }}>
        <div className="mb-4">
          <h1 className="h3 fw-bold text-body">Pins Guardados</h1>
          <p className="text-secondary mt-2">
            Tu biblioteca personal de referencias de código
          </p>
        </div>

        {pins.length > 0 ? (
          <PinGrid pins={pins} />
        ) : (
          <div className="text-center py-5">
            <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
              <i className="bi bi-bookmark text-secondary fs-1"></i>
            </div>
            <h3 className="h5 fw-semibold text-body mb-2">
              No tienes pins guardados
            </h3>
            <p className="text-secondary mb-4">
              Explora y guarda pins que te interesen para tenerlos siempre a mano
            </p>
            <Link
              href="/"
              className="btn btn-danger rounded-pill px-4 py-2 fw-medium"
            >
              Explorar Pins
            </Link>
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
