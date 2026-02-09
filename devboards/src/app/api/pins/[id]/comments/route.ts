import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/pins/[id]/comments - Obtener comentarios de un pin
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: pinId } = await params;

    const comments = await prisma.comment.findMany({
      where: { pinId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    );
  }
}

// POST /api/pins/[id]/comments - Añadir comentario a un pin
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pinId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'El comentario no puede estar vacío' },
        { status: 400 }
      );
    }

    // Verificar que el pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      return NextResponse.json({ error: 'Pin no encontrado' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        pinId,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    );
  }
}
