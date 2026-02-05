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
    },
  });

  return pin as PinWithRelations | null;
}

export default async function PinPage({ params }: PinPageProps) {
  const { id } = await params;
  const pin = await getPin(id);

  if (!pin) {
    notFound();
  }

  return (
    <div className="py-8">
      <PinDetail pin={pin} />
    </div>
  );
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
