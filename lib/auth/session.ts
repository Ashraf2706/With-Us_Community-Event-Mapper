import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { signSession, verifySession } from './jwt';
import { SESSION_COOKIE, SESSION_MAX_AGE } from './constants';

export async function createSession(userId: string): Promise<void> {
  const token = await signSession({ userId });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
      emailVerified: true,
      createdAt: true,
    },
  });
}