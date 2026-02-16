'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export function FAB() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link
      href="/create"
      className="fab-button d-flex align-items-center justify-content-center text-decoration-none"
      title="Crear nuevo pin"
    >
      <i className="bi bi-plus-lg fs-4"></i>
    </Link>
  );
}
