import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/boards/[id]/pins - Añadir pin al tablero
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: boardId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { pinId } = await request.json();

    if (!pinId) {
      return NextResponse.json({ error: 'Se requiere pinId' }, { status: 400 });
    }

    // Verificar que el pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      return NextResponse.json({ error: 'Pin no encontrado' }, { status: 404 });
    }

    // Añadir pin al tablero
    const boardPin = await prisma.boardPin.create({
      data: {
        boardId,
        pinId,
      },
    });

    // Actualizar timestamp del tablero
    await prisma.board.update({
      where: { id: boardId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(boardPin, { status: 201 });
  } catch (error: unknown) {
    // Si ya existe la relación
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El pin ya está en este tablero' },
        { status: 409 }
      );
    }

    console.error('Error adding pin to board:', error);
    return NextResponse.json(
      { error: 'Error al añadir pin al tablero' },
      { status: 500 }
    );
  }
}

// DELETE /api/boards/[id]/pins - Quitar pin del tablero
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    const { id: boardId } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Tablero no encontrado' }, { status: 404 });
    }

    if (board.userId !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { pinId } = await request.json();

    if (!pinId) {
      return NextResponse.json({ error: 'Se requiere pinId' }, { status: 400 });
    }

    await prisma.boardPin.delete({
      where: {
        boardId_pinId: {
          boardId,
          pinId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing pin from board:', error);
    return NextResponse.json(
      { error: 'Error al quitar pin del tablero' },
      { status: 500 }
    );
  }
}
