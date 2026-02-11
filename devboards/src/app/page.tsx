import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
import { FilterChips } from '@/components/ui/FilterChips';
import { FAB } from '@/components/ui/FAB';
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
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Filter Chips */}
      <FilterChips />

      {/* Pin Grid */}
      <PinGrid pins={pins} />

      {/* Empty State */}
      {pins.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 dark:bg-[#1e2337] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-slate-400 dark:text-[#909acb]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            ¡Sé el primero en crear!
          </h3>
          <p className="text-slate-500 dark:text-[#909acb] mb-6">
            Aún no hay pins. Crea el primer pin y comparte tu código con la comunidad.
          </p>
          <a
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-[#0d33f2] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-[#0d33f2]/20"
          >
            Crear Pin
          </a>
        </div>
      )}

      {/* FAB */}
      <FAB />
    </main>
  );
}

// Revalidar cada 60 segundos para mostrar nuevo contenido
export const revalidate = 60;
