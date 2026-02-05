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
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear nuevo Pin</h1>
          <p className="text-gray-500 mt-2">
            Comparte tu código con la comunidad de desarrolladores
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl">
          <CreatePinForm />
        </div>
      </div>
    </div>
  );
}
