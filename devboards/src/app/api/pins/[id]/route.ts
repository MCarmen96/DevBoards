import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/pins/[id] - Obtener un pin específico
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const pin = await prisma.pin.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true, bio: true },
        },
        savedBy: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!pin) {
      return NextResponse.json(
        { error: 'Pin no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pin);
  } catch (error) {
    console.error('Error al obtener pin:', error);
    return NextResponse.json(
      { error: 'Error al obtener el pin' },
      { status: 500 }
    );
  }
}

// PUT /api/pins/[id] - Actualizar un pin
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es el autor del pin
    const existingPin = await prisma.pin.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingPin) {
      return NextResponse.json(
        { error: 'Pin no encontrado' },
        { status: 404 }
      );
    }

    if (existingPin.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para editar este pin' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { title, description, codeSnippet, language, tags } = data;

    const updatedPin = await prisma.pin.update({
      where: { id },
      data: {
        title,
        description,
        codeSnippet,
        language,
        tags,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(updatedPin);
  } catch (error) {
    console.error('Error al actualizar pin:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el pin' },
      { status: 500 }
    );
  }
}

// DELETE /api/pins/[id] - Eliminar un pin
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario es el autor del pin
    const existingPin = await prisma.pin.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingPin) {
      return NextResponse.json(
        { error: 'Pin no encontrado' },
        { status: 404 }
      );
    }

    if (existingPin.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este pin' },
        { status: 403 }
      );
    }

    await prisma.pin.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pin eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pin:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el pin' },
      { status: 500 }
    );
  }
}
