import { describe, it, expect, afterAll, vi } from 'vitest';
import { randomUUID } from 'node:crypto';

const cookieStore = new Map<string, string>();
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) =>
      cookieStore.has(name) ? { name, value: cookieStore.get(name)! } : undefined,
    set: (name: string, value: string) => cookieStore.set(name, value),
    delete: (name: string) => cookieStore.delete(name),
    has: (name: string) => cookieStore.has(name),
  }),
}));

const { prisma } = await import('@/lib/prisma');
const { POST: register } = await import('@/app/api/auth/register/route');
const { POST: login } = await import('@/app/api/auth/login/route');
const { POST: logout } = await import('@/app/api/auth/logout/route');
const { GET: getProfile } = await import('@/app/api/profile/route');

const email = `auth-${randomUUID()}@example.com`;
const password = 'correct-horse-battery';

function req(body: unknown) {
  return new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('auth flow', () => {
  afterAll(async () => {
    cookieStore.clear();
    await prisma.user.deleteMany({ where: { email } });
  });

  it('registers a user and sets a session', async () => {
    const res = await register(req({ email, password, name: 'Auth Tester' }));
    expect(res.status).toBe(201);
    expect(cookieStore.has('session')).toBe(true);
  });

  it('returns the current user via the DAL', async () => {
    const res = await getProfile();
    expect(res.status).toBe(200);
    expect((await res.json()).user.email).toBe(email);
  });

  it('rejects a wrong password', async () => {
    expect((await login(req({ email, password: 'nope' }))).status).toBe(401);
  });

  it('logs in with correct credentials', async () => {
    const res = await login(req({ email, password }));
    expect(res.status).toBe(200);
    expect(cookieStore.has('session')).toBe(true);
  });

  it('logs out and clears the session', async () => {
    await logout();
    expect(cookieStore.has('session')).toBe(false);
    expect((await getProfile()).status).toBe(401);
  });
});