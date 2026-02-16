import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query || query.length < 1) {
    // Devolver sugerencias populares por defecto
    const pins = await prisma.pin.findMany({
      select: {
        tags: true,
        language: true,
      },
      take: 100,
    });

    // Extraer tags únicos más comunes
    const tagCounts = new Map<string, number>();
    const languageCounts = new Map<string, number>();

    pins.forEach((pin) => {
      if (pin.tags) {
        pin.tags.split(',').forEach((tag) => {
          const t = tag.trim().toLowerCase();
          if (t) tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
        });
      }
      if (pin.language) {
        const lang = pin.language.toLowerCase();
        languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
      }
    });

    const popularTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => ({ type: 'tag', value: tag }));

    const popularLanguages = Array.from(languageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => ({ type: 'language', value: lang }));

    return NextResponse.json({
      suggestions: [...popularLanguages, ...popularTags],
    });
  }

  // Buscar coincidencias basadas en el query
  const pins = await prisma.pin.findMany({
    where: {
      OR: [
        { tags: { contains: query } },
        { language: { contains: query } },
        { title: { contains: query } },
      ],
    },
    select: {
      id: true,
      title: true,
      tags: true,
      language: true,
    },
    take: 100,
  });

  const suggestions: { type: string; value: string; pinId?: string }[] = [];
  const seen = new Set<string>();

  // Añadir títulos que coincidan
  pins.forEach((pin) => {
    if (pin.title.toLowerCase().includes(query.toLowerCase()) && !seen.has(pin.title)) {
      seen.add(pin.title);
      suggestions.push({ type: 'pin', value: pin.title, pinId: pin.id });
    }
  });

  // Añadir tags que coincidan
  pins.forEach((pin) => {
    if (pin.tags) {
      pin.tags.split(',').forEach((tag) => {
        const t = tag.trim();
        if (t.toLowerCase().includes(query.toLowerCase()) && !seen.has(t.toLowerCase())) {
          seen.add(t.toLowerCase());
          suggestions.push({ type: 'tag', value: t });
        }
      });
    }
  });

  // Añadir lenguajes que coincidan
  pins.forEach((pin) => {
    if (pin.language && pin.language.toLowerCase().includes(query.toLowerCase()) && !seen.has(pin.language.toLowerCase())) {
      seen.add(pin.language.toLowerCase());
      suggestions.push({ type: 'language', value: pin.language });
    }
  });

  // Limitar sugerencias
  return NextResponse.json({
    suggestions: suggestions.slice(0, 8),
  });
}
