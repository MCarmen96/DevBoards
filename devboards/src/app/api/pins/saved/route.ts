import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/pins/saved - Obtener pins guardados del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver tus pins guardados' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const savedPins = await prisma.savedPin.findMany({
      where: { userId: session.user.id },
      take: limit,
      orderBy: { savedAt: 'desc' },
      include: {
        pin: {
          include: {
            author: {
              select: { id: true, name: true, image: true },
            },
            savedBy: true,
          },
        },
      },
    });

    // Extraer solo los pins
    const pins = savedPins.map((sp) => sp.pin);

    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error al obtener pins guardados:', error);
    return NextResponse.json(
      { error: 'Error al obtener pins guardados' },
      { status: 500 }
    );
  }
}
