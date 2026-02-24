import { prisma } from '@/lib/prisma';
import { HomeContent } from '@/components/HomeContent';
import { PinWithRelations } from '@/types';

async function getRandomPins(): Promise<PinWithRelations[]> {
  const count = await prisma.pin.count();
  if (count === 0) return [];

  const pins = await prisma.pin.findMany({
    take: 30,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, image: true } },
      savedBy: true,
    },
  });

  return pins.sort(() => Math.random() - 0.5) as PinWithRelations[];
}

async function searchPins(query: string): Promise<PinWithRelations[]> {
  const pins = await prisma.pin.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
        { language: { contains: query } },
      ],
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      savedBy: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return pins as PinWithRelations[];
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; addToBoard?: string; boardName?: string }>;
}) {
  const { q, addToBoard, boardName } = await searchParams;
  const pins = q ? await searchPins(q) : await getRandomPins();

  return (
    <main className="flex-grow-1 container-fluid py-4 px-3 px-lg-4 px-xxl-5">
      <HomeContent pins={pins} searchQuery={q} addToBoardId={addToBoard} addToBoardName={boardName} />
    </main>
  );
}

// Revalidar cada 60 segundos para mostrar nuevo contenido
export const revalidate = 60;
