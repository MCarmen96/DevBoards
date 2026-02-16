import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PinDetail } from '@/components/pins/PinDetail';
import { PinWithRelations } from '@/types';

interface PinPageProps {
  params: Promise<{ id: string }>;
}

async function getPin(id: string): Promise<PinWithRelations | null> {
  const pin = await prisma.pin.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
      likes: true,
      _count: {
        select: { likes: true, comments: true },
      },
    },
  });

  return pin as PinWithRelations | null;
}

async function getRelatedPins(pinId: string, language?: string | null) {
  const pins = await prisma.pin.findMany({
    where: {
      id: { not: pinId },
      ...(language ? { language } : {}),
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  });
  return pins;
}

export default async function PinPage({ params }: PinPageProps) {
  const { id } = await params;
  const pin = await getPin(id);

  if (!pin) {
    notFound();
  }

  const relatedPins = await getRelatedPins(id, pin.language);

  // PinDetail component handles its own Bootstrap styling
  return <PinDetail pin={pin} relatedPins={relatedPins} />;
}

export async function generateMetadata({ params }: PinPageProps) {
  const { id } = await params;
  const pin = await getPin(id);

  if (!pin) {
    return { title: 'Pin no encontrado' };
  }

  return {
    title: `${pin.title} | DevBoards`,
    description: pin.description || `Pin de ${pin.author.name}`,
  };
}
