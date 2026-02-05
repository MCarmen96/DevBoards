import { Pin, User, SavedPin } from '@prisma/client';

// Tipos extendidos con relaciones
export type PinWithAuthor = Pin & {
  author: Pick<User, 'id' | 'name' | 'image'>;
};

export type PinWithRelations = Pin & {
  author: Pick<User, 'id' | 'name' | 'image'>;
  savedBy: SavedPin[];
};

export type UserWithPins = User & {
  createdPins: Pin[];
  savedPins: (SavedPin & { pin: Pin })[];
};

// Tipos para formularios
export type CreatePinInput = {
  title: string;
  description?: string;
  imageUrl: string;
  codeSnippet?: string;
  language?: string;
  tags?: string;
};

export type UpdatePinInput = Partial<CreatePinInput>;

// Tipos para autenticación
export type UserRole = 'explorer' | 'creator';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};

// Lenguajes soportados
export const SUPPORTED_LANGUAGES = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React/JSX' },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['value'];
