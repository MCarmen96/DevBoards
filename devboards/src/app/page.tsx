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
    <main className="flex-grow-1 container-fluid py-4" style={{ maxWidth: '1440px' }}>
      {/* Filter Chips */}
      <FilterChips />

      {/* Pin Grid */}
      <PinGrid pins={pins} />

      {/* Empty State */}
      {pins.length === 0 && (
        <div className="text-center py-5">
          <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-plus-lg fs-1 text-secondary"></i>
          </div>
          <h3 className="h4 fw-semibold mb-2">
            ¡Sé el primero en crear!
          </h3>
          <p className="text-secondary mb-4">
            Aún no hay pins. Crea el primer pin y comparte tu código con la comunidad.
          </p>
          <a href="/create" className="btn btn-primary">
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
