import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/pins - Obtener pins (aleatorios o paginados)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const random = searchParams.get('random') === 'true';
    const userId = searchParams.get('userId');

    let pins;

    if (userId) {
      // Obtener pins de un usuario específico
      pins = await prisma.pin.findMany({
        where: { authorId: userId },
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          savedBy: true,
        },
      });
    } else if (random) {
      // Obtener pins aleatorios (para el feed principal)
      const count = await prisma.pin.count();
      const skip = Math.max(0, Math.floor(Math.random() * count) - limit);
      
      pins = await prisma.pin.findMany({
        take: limit,
        skip: skip,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          savedBy: true,
        },
      });

      // Mezclar los resultados para más aleatoriedad
      pins = pins.sort(() => Math.random() - 0.5);
    } else {
      // Obtener pins ordenados por fecha
      pins = await prisma.pin.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
          savedBy: true,
        },
      });
    }

    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error al obtener pins:', error);
    return NextResponse.json(
      { error: 'Error al obtener pins' },
      { status: 500 }
    );
  }
}

// POST /api/pins - Crear un nuevo pin
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para crear un pin' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, imageUrl, codeSnippet, language, tags } = data;

    // Validaciones
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Título e imagen son requeridos' },
        { status: 400 }
      );
    }

    const pin = await prisma.pin.create({
      data: {
        title,
        description,
        imageUrl,
        codeSnippet,
        language,
        tags,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(pin, { status: 201 });
  } catch (error) {
    console.error('Error al crear pin:', error);
    return NextResponse.json(
      { error: 'Error al crear el pin' },
      { status: 500 }
    );
  }
}
