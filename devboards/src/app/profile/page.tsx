import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProfileContent } from '@/components/ProfileContent';
import { BoardPreview, PinWithRelations } from '@/types';

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

async function getUserPins(userId: string): Promise<PinWithRelations[]> {
  const pins = await prisma.pin.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  return pins as PinWithRelations[];
}

async function getUserStats(userId: string) {
  const [pinCount, followersCount, followingCount] = await Promise.all([
    prisma.pin.count({ where: { authorId: userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return { pinCount, followersCount, followingCount };
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

  const [boards, pins, stats] = await Promise.all([
    getUserBoards(session.user.id),
    getUserPins(session.user.id),
    getUserStats(session.user.id),
  ]);

  return (
    <main className="flex-grow-1 w-100 container-xxl py-3 py-md-4 px-3 px-md-4 px-xxl-5">
      {/* Breadcrumb - Solo visible en tema Usabilidad */}
      <Breadcrumb currentPage="Mi Perfil" />
      
      <ProfileContent
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
          bio: user.bio,
        }}
        stats={stats}
        boards={boards}
        pins={pins}
      />
    </main>
  );
}

export const metadata = {
  title: 'Mi Perfil | DevBoards',
  description: 'Tu perfil en DevBoards',
};
