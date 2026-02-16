import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: session.user.id },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const users = followers.map((f) => f.follower);

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return NextResponse.json({ error: 'Error al obtener seguidores' }, { status: 500 });
  }
}
