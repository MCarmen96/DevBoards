import { prisma } from '@/lib/prisma';
import { HomeContent } from '@/components/HomeContent';
import { PinWithRelations } from '@/types';

async function getRandomPins(): Promise<PinWithRelations[]> {
  const count = await prisma.pin.count();
  
  if (count === 0) {
    return [];
  }
  
  const pins = await prisma.pin.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
      savedBy: true,
    },
  });

  // Mezclar para más variedad
  return pins.sort(() => Math.random() - 0.5) as PinWithRelations[];
}

export default async function HomePage() {
  const pins = await getRandomPins();

  return (
    <main className="flex-grow-1 container-fluid py-4 px-3 px-lg-4 px-xxl-5">
      <HomeContent pins={pins} />
    </main>
  );
}

// Revalidar cada 60 segundos para mostrar nuevo contenido
export const revalidate = 60;
