import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/boards/[id] - Obtener detalle del tablero
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        pins: {
          include: {
            pin: {
              include: {
                author: {
                  select: { id: true, name: true, image: true },
                },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
        _count: {
          select: { pins: true },
        },
      },
    });

    if (!board) {
      return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
    }

    // Si es privado, solo el propietario puede verlo
    if (board.isPrivate && board.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json(
      { error: 'Error al obtener tablero' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[id] - Eliminar tablero
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await prisma.board.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting board:', error);
    return NextResponse.json(
      { error: 'Error al eliminar tablero' },
      { status: 500 }
    );
  }
}

// PATCH /api/boards/[id] - Actualizar tablero
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: { id },
    });

    if (!board) {
      return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const data = await request.json();

    const updatedBoard = await prisma.board.update({
      where: { id },
      data: {
        name: data.name?.trim() || board.name,
        description: data.description?.trim() ?? board.description,
        isPrivate: data.isPrivate ?? board.isPrivate,
      },
    });

    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json(
      { error: 'Error al actualizar tablero' },
      { status: 500 }
    );
  }
}
