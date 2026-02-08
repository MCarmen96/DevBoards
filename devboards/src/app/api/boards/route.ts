import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/boards - Obtener tableros del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const boards = await prisma.board.findMany({
      where: { userId: session.user.id },
      include: {
        pins: {
          include: {
            pin: {
              select: { id: true, imageUrl: true, title: true },
            },
          },
          take: 4,
          orderBy: { addedAt: 'desc' },
        },
        _count: {
          select: { pins: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(boards);
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Error al obtener tableros' },
      { status: 500 }
    );
  }
}

// POST /api/boards - Crear nuevo tablero
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.name || data.name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre del tablero es requerido' },
        { status: 400 }
      );
    }

    const board = await prisma.board.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        isPrivate: data.isPrivate || false,
        userId: session.user.id,
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Error al crear tablero' },
      { status: 500 }
    );
  }
}
