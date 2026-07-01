import { describe, it, expect, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';

const email = `test-${randomUUID()}@example.com`;
let userId: string;
let eventId: string;

describe('data model: User, Event, Rsvp', () => {
  afterAll(async () => {
    // Cascade removes the event and rsvp when the user is deleted
    await prisma.user.deleteMany({ where: { email } });
  });

  it('creates a user, event, and rsvp with working relations', async () => {
    const user = await prisma.user.create({
      data: { email, passwordHash: 'placeholder', name: 'Test Organizer' },
    });
    userId = user.id;

    const event = await prisma.event.create({
      data: {
        title: 'Neighborhood Rugby Match',
        description: 'Friendly local match.',
        category: 'SPORTS',
        startsAt: new Date(Date.now() + 86_400_000),
        latitude: 39.0837,
        longitude: -77.1528,
        locationName: 'Aspen Hill Park',
        organizerId: user.id,
      },
    });
    eventId = event.id;

    const rsvp = await prisma.rsvp.create({
      data: { userId: user.id, eventId: event.id, status: 'GOING' },
    });

    const loaded = await prisma.event.findUniqueOrThrow({
      where: { id: event.id },
      include: { organizer: true, rsvps: true },
    });

    expect(loaded.organizer.email).toBe(email);
    expect(loaded.rsvps).toHaveLength(1);
    expect(loaded.rsvps[0].id).toBe(rsvp.id);
  });

  it('enforces one rsvp per user per event', async () => {
    await expect(
      prisma.rsvp.create({
        data: { userId, eventId, status: 'INTERESTED' },
      }),
    ).rejects.toThrow();
  });
});