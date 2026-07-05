import { hash, verify } from '@node-rs/argon2';

const opts = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, opts);
}

export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}