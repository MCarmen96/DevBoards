import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';

  if (!query && !tag) {
    return NextResponse.json({ pins: [] });
  }

  const pins = await prisma.pin.findMany({
    where: {
      OR: [
        // Búsqueda por título
        { title: { contains: query } },
        // Búsqueda por descripción
        { description: { contains: query } },
        // Búsqueda por tags
        { tags: { contains: tag || query } },
        // Búsqueda por lenguaje
        { language: { contains: query } },
      ],
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ pins });
}
