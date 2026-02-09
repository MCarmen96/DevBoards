import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/users/[id]/follow - Seguir a un usuario
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: followingId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (session.user.id === followingId) {
      return NextResponse.json(
        { error: 'No puedes seguirte a ti mismo' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!userToFollow) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Crear seguimiento
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId,
      },
    });

    // Contar seguidores
    const followersCount = await prisma.follow.count({
      where: { followingId },
    });

    return NextResponse.json({ following: true, followersCount }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya sigues a este usuario' },
        { status: 409 }
      );
    }

    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Error al seguir usuario' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]/follow - Dejar de seguir a un usuario
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: followingId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    // Contar seguidores
    const followersCount = await prisma.follow.count({
      where: { followingId },
    });

    return NextResponse.json({ following: false, followersCount });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Error al dejar de seguir' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/follow - Verificar si sigo a un usuario
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: followingId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ following: false, followersCount: 0 });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    });

    const followersCount = await prisma.follow.count({
      where: { followingId },
    });

    return NextResponse.json({
      following: !!follow,
      followersCount,
    });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json(
      { error: 'Error al verificar seguimiento' },
      { status: 500 }
    );
  }
}
