import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/pins/[id]/like - Dar like a un pin
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pinId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      return NextResponse.json({ error: 'Pin no encontrado' }, { status: 404 });
    }

    // Crear like
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        pinId,
      },
    });

    // Contar likes totales
    const likesCount = await prisma.like.count({
      where: { pinId },
    });

    return NextResponse.json({ liked: true, likesCount }, { status: 201 });
  } catch (error: unknown) {
    // Si ya existe el like
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya has dado like a este pin' },
        { status: 409 }
      );
    }

    console.error('Error liking pin:', error);
    return NextResponse.json(
      { error: 'Error al dar like' },
      { status: 500 }
    );
  }
}

// DELETE /api/pins/[id]/like - Quitar like de un pin
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pinId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.like.delete({
      where: {
        userId_pinId: {
          userId: session.user.id,
          pinId,
        },
      },
    });

    // Contar likes totales
    const likesCount = await prisma.like.count({
      where: { pinId },
    });

    return NextResponse.json({ liked: false, likesCount });
  } catch (error) {
    console.error('Error unliking pin:', error);
    return NextResponse.json(
      { error: 'Error al quitar like' },
      { status: 500 }
    );
  }
}
