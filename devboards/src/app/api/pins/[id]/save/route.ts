import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// POST /api/pins/[id]/save - Guardar un pin
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pinId } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para guardar pins' },
        { status: 401 }
      );
    }

    // Verificar que el pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      return NextResponse.json(
        { error: 'Pin no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya está guardado
    const existingSave = await prisma.savedPin.findUnique({
      where: {
        userId_pinId: {
          userId: session.user.id,
          pinId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { error: 'Ya has guardado este pin' },
        { status: 400 }
      );
    }

    // Guardar el pin
    const savedPin = await prisma.savedPin.create({
      data: {
        userId: session.user.id,
        pinId,
      },
      include: {
        pin: {
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(savedPin, { status: 201 });
  } catch (error) {
    console.error('Error al guardar pin:', error);
    return NextResponse.json(
      { error: 'Error al guardar el pin' },
      { status: 500 }
    );
  }
}

// DELETE /api/pins/[id]/save - Eliminar pin guardado
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    const { id: pinId } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    await prisma.savedPin.delete({
      where: {
        userId_pinId: {
          userId: session.user.id,
          pinId,
        },
      },
    });

    return NextResponse.json({ message: 'Pin eliminado de guardados' });
  } catch (error) {
    console.error('Error al eliminar pin guardado:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el pin guardado' },
      { status: 500 }
    );
  }
}
