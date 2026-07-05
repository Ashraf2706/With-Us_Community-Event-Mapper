import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import { loginSchema } from '@/lib/auth/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!user || !(await verifyPassword(user.passwordHash, parsed.data.password))) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await createSession(user.id);
  return Response.json(
    { user: { id: user.id, email: user.email, name: user.name } },
    { status: 200 },
  );
}