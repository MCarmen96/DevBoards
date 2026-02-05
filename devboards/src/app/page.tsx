import { prisma } from '@/lib/prisma';
import { PinGrid } from '@/components/pins/PinGrid';
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
    <div className="py-6">
      {/* Hero Section */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Descubre código creativo
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explora colecciones de UI, CSS, HTML, JavaScript y TypeScript creadas por desarrolladores para desarrolladores.
        </p>
      </div>

      {/* Pin Grid */}
      <PinGrid pins={pins} />

      {/* Empty State */}
      {pins.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Sé el primero en crear!
          </h3>
          <p className="text-gray-500 mb-6">
            Aún no hay pins. Crea el primer pin y comparte tu código con la comunidad.
          </p>
          <a
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
          >
            Crear Pin
          </a>
        </div>
      )}
    </div>
  );
}

// Revalidar cada 60 segundos para mostrar nuevo contenido
export const revalidate = 60;
