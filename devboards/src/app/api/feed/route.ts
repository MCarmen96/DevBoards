import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/feed - Obtener pins de usuarios seguidos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener IDs de usuarios seguidos
    const following = await prisma.follow.findMany({
      where: { followerId: session.user.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return NextResponse.json([]);
    }

    // Obtener pins de usuarios seguidos
    const pins = await prisma.pin.findMany({
      where: {
        authorId: { in: followingIds },
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Error al obtener feed' },
      { status: 500 }
    );
  }
}
