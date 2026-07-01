# With Us - Community Event Mapper

Location-based platform to discover, organize, and attend local events.

## Stack
Next.js (App Router) · TypeScript · Prisma · PostgreSQL · Tailwind · Vitest

## Local development
1. cp .env.example .env
2. docker compose up -d
3. npm install
4. npm run dev
5. Open http://localhost:3000/api/health → {"status":"ok","db":"up"}

## Scripts
- npm run dev / build / start
- npm run typecheck — tsc --noEmit
- npm run lint
- npm run test — Vitest (needs Postgres running)
- npm run format — Prettier

## Deployment
Vercel (app) + Neon (Postgres). Set DATABASE_URL in the Vercel project
to the Neon pooled connection string.