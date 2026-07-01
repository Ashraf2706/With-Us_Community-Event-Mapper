import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok', db: 'up' }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return Response.json({ status: 'degraded', db: 'down' }, { status: 503 });
  }
}