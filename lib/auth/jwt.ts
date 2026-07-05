import { SignJWT, jwtVerify } from 'jose';
import { getEnv } from '@/lib/env';

const alg = 'HS256';

function secret() {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export interface SessionPayload {
  userId: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [alg] });
    return typeof payload.userId === 'string' ? { userId: payload.userId } : null;
  } catch {
    return null;
  }
}