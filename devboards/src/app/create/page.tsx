import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CreatePinForm } from '@/components/pins/CreatePinForm';

export default async function CreatePinPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="py-4">
      <div className="container" style={{ maxWidth: '896px' }}>
        <div className="mb-4">
          <h1 className="h3 fw-bold text-body">Crear nuevo Pin</h1>
          <p className="text-secondary mt-2">
            Comparte tu código con la comunidad de desarrolladores
          </p>
        </div>
        
        <div className="bg-body rounded-4 shadow-lg">
          <CreatePinForm />
        </div>
      </div>
    </div>
  );
}
