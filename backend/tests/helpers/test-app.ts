import type { Express } from 'express';
import { createApp } from '../../src/app';
import { closeDb, createMigrator, resetDatabase } from '../../src/shared/db';

/** The real app, without an HTTP server or Socket.IO (supertest calls it directly). */
export function createTestApp(): Express {
  return createApp({ io: null });
}

/** Brings the test database schema up to date. Call it in beforeAll of every integration test file. */
export async function migrateTestDb(): Promise<void> {
  await createMigrator().up();
}

/** Empty tables + seeds: call it in beforeEach when a test writes data. */
export async function resetDb(): Promise<void> {
  await resetDatabase();
}

export { closeDb };
